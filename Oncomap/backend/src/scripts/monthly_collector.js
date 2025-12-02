// Oncomap/backend/src/scripts/monthly_collector.js

const puppeteer = require('puppeteer');
const db = require('../config/database');
require('dotenv').config();

// --- CONFIGURAÇÕES ---
// Nota: Usamos a URL base, os parâmetros montaremos na navegação
const QD_API_BASE = "https://queridodiario.ok.org.br/api/gazettes";
const KEYWORDS_QUERYSTRING = 'quimioterapia,radioterapia,oncologia,oncológico,"tratamento de câncer"';
const LOOKBACK_DAYS = 30; 


function getStartDate(days) {
    const data = new Date();
    data.setDate(data.getDate() - days);
    return data.toISOString().split('T')[0];
}

async function runMonthlyCollector() {
    console.log('✅ Iniciando o coletor MENSAL (Via Puppeteer Browser)...');
    const since = getStartDate(LOOKBACK_DAYS);
    let browser = null;

    try {
        console.log(`🔎 Iniciando navegador Chrome...`);
        
        // 1. Inicia o Puppeteer com configurações para rodar no Docker/GitHub Actions
        browser = await puppeteer.launch({
            headless: "new", // Modo invisível novo
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Evita erros de memória em containers
                '--disable-blink-features=AutomationControlled' // Tenta esconder que é um robô
            ]
        });

        const page = await browser.newPage();

        // 2. Define um User-Agent real
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');

        // 3. Monta a URL com os parâmetros query string
        // Precisamos codificar os caracteres especiais (espaços, aspas) para a URL
        const params = new URLSearchParams({
            querystring: KEYWORDS_QUERYSTRING,
            published_since: since,
            size: '500'
        });
        
        const fullUrl = `${QD_API_BASE}?${params.toString()}`;
        console.log(`🔎 Acessando URL da API: ${fullUrl}`);

        // 4. Navega até a API e espera o JSON
        const response = await page.goto(fullUrl, {
            waitUntil: 'networkidle0', // Espera a rede acalmar
            timeout: 60000 // 60 segundos de timeout
        });

        if (!response.ok()) {
            throw new Error(`Erro na requisição Puppeteer: Status ${response.status()}`);
        }

        // 5. Extrai o JSON da resposta
        const data = await response.json();
        const gazettes = data.gazettes;

        if (!gazettes || gazettes.length === 0) {
            console.log('🎉 Nenhum diário novo com as palavras-chave encontrado no período.');
            await browser.close();
            return;
        }

        console.log(`ℹ️  Encontrados ${gazettes.length} diários relevantes. Inserindo no banco...`);

        let insertedCount = 0;
        let skippedCount = 0;

        for (const gazette of gazettes) {
            const insertQuery = `
                INSERT INTO mentions (
                    municipality_ibge_code, municipality_name, state_uf,
                    publication_date, edition, is_extra_edition, 
                    excerpt, source_url, txt_url
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (source_url) DO NOTHING;
            `;
            
            const values = [
                gazette.territory_id,
                gazette.territory_name,
                gazette.state_code,
                gazette.date,
                gazette.edition,
                gazette.is_extra_edition || false,
                gazette.excerpts.join('\n\n---\n\n'),
                gazette.url,
                gazette.txt_url
            ];

            try {
                const result = await db.query(insertQuery, values);
                if (result.rowCount > 0) {
                    insertedCount++;
                    console.log(`  -> Inserido: ${gazette.territory_name}`);
                } else {
                    skippedCount++;
                }
            } catch (dbError) {
                console.error(`  -> ❌ Erro DB:`, dbError.message);
            }
            // Pequena pausa não é necessária aqui pois o DB é local/rápido, mas mantemos por segurança
            // await delay(10); 
        }

        console.log('\n🎉 Coleta mensal finalizada!');
        console.log(`  -> ${insertedCount} novos inseridos.`);
        console.log(`  -> ${skippedCount} já existentes.`);

    } catch (error) {
        console.error("💥 Erro fatal no coletor mensal (Puppeteer):", error.message);
        process.exit(1); // Força erro no Actions
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

runMonthlyCollector().catch(console.error);