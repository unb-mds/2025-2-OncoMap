const db = require('../src/config/database');
const allMunicipalities = require('../src/data/municipios.json');

const ufCodeToAbbreviation = {
    11: 'RO', 12: 'AC', 13: 'AM', 14: 'RR', 15: 'PA', 16: 'AP', 17: 'TO',
    21: 'MA', 22: 'PI', 23: 'CE', 24: 'RN', 25: 'PB', 26: 'PE', 27: 'AL',
    28: 'SE', 29: 'BA', 31: 'MG', 32: 'ES', 33: 'RJ', 35: 'SP', 41: 'PR',
    42: 'SC', 43: 'RS', 50: 'MS', 51: 'MT', 52: 'GO', 53: 'DF'
};

async function populateMunicipalities() {
    console.log('Iniciando a inserção da lista de municípios na tabela de status...');
    let insertedCount = 0;
    let skippedCount = 0;

    for (const city of allMunicipalities) {
        const stateAbbreviation = ufCodeToAbbreviation[city.codigo_uf];

        if (!stateAbbreviation) {
            console.warn(`  -> Aviso: Não foi possível encontrar a sigla para o código UF: ${city.codigo_uf} (Município: ${city.nome}). Pulando.`);
            skippedCount++;
            continue;
        }

        const insertQuery = `
            INSERT INTO municipalities_status (ibge_code, name, state_uf, last_processed_at)
            VALUES ($1, $2, $3, NULL)
            ON CONFLICT (ibge_code) DO NOTHING;
        `;

        const result = await db.query(insertQuery, [city.codigo_ibge, city.nome, stateAbbreviation]);
        
        if (result.rowCount > 0) {
            insertedCount++;
        }
    }

    console.log(`Setup finalizado. ${insertedCount} novos municípios foram adicionados.`);
    if (skippedCount > 0) {
        console.warn(`${skippedCount} municípios foram pulados por falta de código UF correspondente.`);
    }
}

populateMunicipalities().catch(console.error);