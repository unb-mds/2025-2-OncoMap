const fs = require('fs');
const path = require('path');

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

const getDadosInvestimentos = (req, res) => {
    console.log('Requisição recebida para dados de investimentos...');

    const data = readMockFile('dados_investimentos.json');

    if (data) {
        return res.status(200).json(data);
    }
    return res.status(500).json({ error: 'Falha ao ler dados de investimentos.' });
};

module.exports = {
    getDadosInvestimentos,
};