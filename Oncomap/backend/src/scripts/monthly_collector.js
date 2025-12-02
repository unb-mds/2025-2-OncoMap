// Oncomap/backend/src/scripts/monthly_collector.js

const puppeteer = require('puppeteer');
const db = require('../config/database');
require('dotenv').config();

// --- CONFIGURAÇÕES ---
const QD_API_BASE = "https://queridodiario.ok.org.br/api/gazettes";
const KEYWORDS_QUERYSTRING = 'quimioterapia,radioterapia,oncologia,oncológico,"tratamento de câncer"';
const LOOKBACK_DAYS = 30; 

/**
 * Retorna a data de X dias atrás no formato AAAA-MM-DD
 */
function getStartDate(days) {
    const data = new Date();
    data.setDate(data.getDate() - days);
    return data.toISOString().split('T')[0];
}

/**
 * Função principal do coletor mensal.
 */
async function runMonthlyCollector() {
    console.log('✅ Iniciando o coletor MENSAL (Técnica "Cavalo de Troia")...');
    const since = getStartDate(LOOKBACK_DAYS);
    let browser = null;

    try {
        console.log(`🔎 Iniciando navegador Chrome...`);
        
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--window-size=1920,1080'
            ]
        });

        const page = await browser.newPage();
        
        // User-Agent de um PC comum
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // 1. ACESSA O SITE OFICIAL (Não a API!)
        // Isso cria uma sessão legítima e pega os cookies necessários
        const siteUrl = 'https://queridodiario.ok.org.br/';
        console.log(`🌍 Acessando a Home Page para autenticar: ${siteUrl}`);
        
        await page.goto(siteUrl, {
            waitUntil: 'networkidle0', // Espera o site carregar tudo
            timeout: 60000
        });

        // 2. PREPARA A URL DA API
        const params = new URLSearchParams({
            querystring: KEYWORDS_QUERYSTRING,
            published_since: since,
            size: '500'
        });
        const apiUrl = `${QD_API_BASE}?${params.toString()}`;
        console.log(`🔎 Buscando dados internamente na API: ${apiUrl}`);

        // 3. EXECUTA O FETCH DE DENTRO DO NAVEGADOR
        // Aqui está a mágica: o 'fetch' roda DENTRO da página carregada, herdando a legitimidade dela.
        const data = await page.evaluate(async (url) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro na API interna: ${response.status}`);
            }
            return response.json();
        }, apiUrl);

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
        }

        console.log('\n🎉 Coleta mensal finalizada!');
        console.log(`  -> ${insertedCount} novos inseridos.`);
        console.log(`  -> ${skippedCount} já existentes.`);

    } catch (error) {
        console.error("💥 Erro fatal no coletor mensal (Puppeteer):", error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Executa a função
runMonthlyCollector().catch(console.error);