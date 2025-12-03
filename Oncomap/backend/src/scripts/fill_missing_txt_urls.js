const axios = require('axios');
const db = require('../config/database');
require('dotenv').config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function formatDate(date) {
    const d = new Date(date); 
    return d.toISOString().split('T')[0];
}

async function fillMissingTxtUrls() {
    console.log('✅ Iniciando busca por txt_urls que estão como NULL...');

    const mentionsToFill = await db.query(
        `SELECT id, municipality_ibge_code, publication_date, source_url 
         FROM mentions 
         WHERE txt_url IS NULL`
    );

    if (mentionsToFill.rows.length === 0) {
        console.log('🎉 Nenhuma menção com txt_url NULL encontrada. Tudo atualizado!');
        return;
    }

    console.log(`ℹ️  Encontradas ${mentionsToFill.rows.length} menções com txt_url NULL para verificar.`);

    for (const [index, mention] of mentionsToFill.rows.entries()) {
        if (!mention.municipality_ibge_code || !mention.publication_date || !mention.source_url) {
            console.warn(`\n[${index + 1}/${mentionsToFill.rows.length}] Pulando menção ID: ${mention.id} por dados incompletos (IBGE, data ou source_url ausente).`);
            continue; 
        }

        console.log(`\n[${index + 1}/${mentionsToFill.rows.length}] Verificando menção ID: ${mention.id}...`);

        try {
            const searchDate = formatDate(mention.publication_date);
            const searchUrl = `https://queridodiario.ok.org.br/api/gazettes?territory_ids=${mention.municipality_ibge_code}&published_since=${searchDate}&published_until=${searchDate}&size=50`;

            console.log(`  -> Buscando diários de ${searchDate} para ${mention.municipality_ibge_code}...`);
            const response = await axios.get(searchUrl);
            const gazettes = response.data.gazettes;

            let foundTxtUrl = null;

            if (gazettes && gazettes.length > 0) {
                const matchingGazette = gazettes.find(g => g.url === mention.source_url);

                if (matchingGazette) {
                    foundTxtUrl = matchingGazette.txt_url;
                } else {
                    console.warn(`  -> Aviso: Diário com URL ${mention.source_url} não encontrado na API para ${searchDate}. txt_url permanecerá NULL.`);
                }
            } else {
                 console.warn(`  -> Aviso: Nenhum diário encontrado na API para ${mention.municipality_ibge_code} em ${searchDate}. txt_url permanecerá NULL.`);
            }

            await db.query(
                `UPDATE mentions SET txt_url = $1 WHERE id = $2 AND txt_url IS NULL`,
                [foundTxtUrl, mention.id]
            );

            if (foundTxtUrl) {
                console.log(`  -> Sucesso! txt_url encontrado e salvo.`);
            } else {
                console.log(`  -> Concluído. Nenhum txt_url fornecido pela API. O campo permanecerá NULL.`);
            }

            await delay(500);

        } catch (error) {
            console.error(`❌ ERRO ao processar a menção ID ${mention.id}:`, error.message);
            await delay(1000);
        }
    }

    console.log('🎉 Processo de preenchimento de txt_urls NULL finalizado!');
}

fillMissingTxtUrls().catch(console.error);