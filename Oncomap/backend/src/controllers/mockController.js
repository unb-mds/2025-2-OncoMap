// backend/src/controllers/mockController.js
const fs = require('fs');
const path = require('path');

// Função para ler nossos arquivos JSON de forma segura
const readMockFile = (fileName) => {
    try {
        const filePath = path.join(__dirname, '..', 'mocks', fileName);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Erro ao ler o arquivo mock ${fileName}:`, error);
        return null;
    }
};

const getRegionSummary = (req, res) => {
    const { regionName } = req.params;

    // Para a demo, vamos retornar os dados do Sudeste, não importa a região clicada
    console.log(`Buscando dados mock para a região: ${regionName}`);

    const data = readMockFile('summary_sudeste.json');

    if (data) {
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: 'Falha ao ler dados do resumo.' });
};

const getMunicipalityDetails = (req, res) => {
    const { ibgeCode } = req.params;

    // Para a demo, vamos retornar os dados do Rio, não importa a cidade clicada
    console.log(`Buscando dados mock para o município com código IBGE: ${ibgeCode}`);

    const data = readMockFile('details_rio.json');

    if (data) {
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: 'Falha ao ler dados do município.' });
};

module.exports = {
    getRegionSummary,
    getMunicipalityDetails,
};