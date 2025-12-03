const axios = require('axios');
const db = require('../config/database');
require('dotenv').config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

async function updateTxtUrls() {
    console.log('✅ Iniciando busca por txt_urls ausentes...');

    const mentionsToUpdate = await db.query(
        `SELECT id, municipality_ibge_code, publication_date, source_url 
         FROM mentions 
         WHERE txt_url IS NULL`
    );

    if (mentionsToUpdate.rows.length === 0) {
        console.log('🎉 Nenhuma menção precisa de atualização de txt_url.');
        return;
    }

    console.log(`ℹ️  Encontradas ${mentionsToUpdate.rows.length} menções para atualizar.`);

    for (const [index, mention] of mentionsToUpdate.rows.entries()) {
        console.log(`\n[${index + 1}/${mentionsToUpdate.rows.length}] Processando menção ID: ${mention.id}...`);

        try {
            const searchDate = formatDate(new Date(mention.publication_date));
            const searchUrl = `https://queridodiario.ok.org.br/api/gazettes?territory_ids=${mention.municipality_ibge_code}&published_since=${searchDate}&published_until=${searchDate}&size=50`; // Size alto para garantir pegar todos do dia

            console.log(`  -> Buscando diários de ${searchDate} para ${mention.municipality_ibge_code}...`);
            const response = await axios.get(searchUrl);
            const gazettes = response.data.gazettes;

            let foundTxtUrl = null;

            if (gazettes && gazettes.length > 0) {
                const matchingGazette = gazettes.find(g => g.url === mention.source_url);

                if (matchingGazette) {
                    foundTxtUrl = matchingGazette.txt_url;
                } else {
                    console.warn(`  -> Aviso: Diário com URL ${mention.source_url} não encontrado na resposta da API para ${searchDate}.`);
                }
            } else {
                 console.warn(`  -> Aviso: Nenhum diário encontrado na API para ${mention.municipality_ibge_code} em ${searchDate}.`);
            }

            await db.query(
                `UPDATE mentions SET txt_url = $1 WHERE id = $2`,
                [foundTxtUrl, mention.id]
            );

            if (foundTxtUrl) {
                console.log(`  -> Sucesso! txt_url encontrado e salvo.`);
            } else {
                console.log(`  -> Concluído. Nenhum txt_url foi fornecido pela API para este diário.`);
            }

            await delay(500);

        } catch (error) {
            console.error(`❌ ERRO ao processar a menção ID ${mention.id}:`, error.message);
            await delay(1000);
        }
    }

    console.log('🎉 Processo de atualização de txt_urls finalizado!');
}

updateTxtUrls().catch(console.error);