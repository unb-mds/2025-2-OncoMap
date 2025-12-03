const axios = require('axios');
const db = require('../config/database');

/**
 * Cria uma pausa (delay) no código.
 * @param {number} ms - O tempo em milissegundos para a pausa.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function collectData() {
    console.log('✅ Iniciando o coletor de dados resiliente...');

    const sinceDate = '2022-01-01';
    console.log(`ℹ️  Período de busca: de ${sinceDate} até hoje.`);

    while (true) {
        let city = null;

        try {
            const nextCityQuery = `
                SELECT ibge_code, name, state_uf 
                FROM municipalities_status 
                WHERE last_processed_at IS NULL 
                LIMIT 1;
            `;
            const result = await db.query(nextCityQuery);

            if (result.rows.length === 0) {
                console.log('🎉 Todas os municípios foram processados. Encerrando o coletor.');
                break;
            }
            
            city = result.rows[0];

            const updateStatusQuery = `
                UPDATE municipalities_status 
                SET last_processed_at = NOW() 
                WHERE ibge_code = $1;
            `;
            await db.query(updateStatusQuery, [city.ibge_code]);

            const querystring = 'quimioterapia,radioterapia,oncologia,oncológico,"tratamento de câncer"';
            
            const keywords = querystring.replace(/"/g, '').split(',');

            const searchUrl = `https://queridodiario.ok.org.br/api/gazettes?territory_ids=${city.ibge_code}&published_since=${sinceDate}&querystring=${querystring}&size=200`;

            console.log(`🔎 Processando: ${city.name} - ${city.state_uf}...`);
            const response = await axios.get(searchUrl);
            const gazettes = response.data.gazettes;

            if (gazettes && gazettes.length > 0) {
                console.log(`  -> ${gazettes.length} diários encontrados. Analisando o texto completo...`);

                for (const gazette of gazettes) {
                    let contentToInsert = null;
                    
                    if (gazette.source_text_url) {
                        try {
                            console.log(`    -> Baixando texto completo de: ${gazette.source_text_url}`);
                            const textResponse = await axios.get(gazette.source_text_url);
                            const fullText = textResponse.data;

                            const pages = fullText.split('\f');
                            
                            let allContexts = [];

                            for (let i = 0; i < pages.length; i++) {
                                const pageContent = pages[i];
                                if (!pageContent) continue;

                                const pageContentLower = pageContent.toLowerCase();

                                const foundKeyword = keywords.find(key => pageContentLower.includes(key));

                                if (foundKeyword) {
                                    console.log(`    -> Palavra-chave "${foundKeyword}" encontrada na página ${i + 1} (de ${pages.length})`);

                                    const previousPageContent = (i > 0) ? pages[i - 1] : "Nenhuma (Esta é a primeira página)";
                                    
                                    const contextBlock = `--- [CONTEXTO DA MENÇÃO (Palavra-chave: "${foundKeyword}")] ---\n\n--- PÁGINA ANTERIOR (Aprox. Pág. ${i}) ---\n${previousPageContent}\n\n--- PÁGINA DA MENÇÃO (Aprox. Pág. ${i + 1}) ---\n${pageContent}`;
                                    allContexts.push(contextBlock);
                                }
                            }

                            if (allContexts.length > 0) {
                                contentToInsert = allContexts.join('\n\n==================== [NOVA MENÇÃO NO MESMO DIÁRIO] ====================\n\n');
                            }

                        } catch (e) {
                            console.error(`    -> ❌ Erro ao baixar ou processar o texto completo (${gazette.source_text_url}): ${e.message}`);
                        }
                    }
                    
                    if (!contentToInsert) {
                        console.log(`    -> (Fallback) Não foi possível processar o texto completo ou nenhuma palavra-chave foi reencontrada. Usando excerpts originais.`);
                        contentToInsert = gazette.excerpts.join('\n\n---\n\n');
                    }

                    const insertQuery = `
                        INSERT INTO mentions (
                            municipality_ibge_code, municipality_name, state_uf,
                            publication_date, edition, is_extra_edition, 
                            excerpt, source_url
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        ON CONFLICT (source_url) DO NOTHING;
                    `;
                    await db.query(insertQuery, [
                        gazette.territory_id, gazette.territory_name, gazette.state_code,
                        gazette.date, gazette.edition, gazette.is_extra_edition || false,
                        contentToInsert, 
                        gazette.url
                    ]);
                }
            }
            
            await delay(500);

        } catch (error) {
            const cityName = city ? city.name : 'cidade desconhecida';
            console.error(`❌ Erro ao processar a cidade ${cityName}:`, error.message);
            
            await delay(2000);
        }
    }
}

collectData().catch(error => {
    console.error("💥 Falha fatal no processo do coletor:", error);
});