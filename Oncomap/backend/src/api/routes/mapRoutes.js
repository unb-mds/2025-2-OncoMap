const express = require('express');
const router = express.Router();
const db = require('../../config/database'); 


const regionMap = {
    'sudeste': ['SP', 'RJ', 'MG', 'ES'],
    'sul': ['PR', 'SC', 'RS'],
    'nordeste': ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'],
    'norte': ['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC'],
    'centro-oeste': ['MT', 'MS', 'GO', 'DF']
};

const ufToCode = {
    'RO': '11', 'AC': '12', 'AM': '13', 'RR': '14', 'PA': '15', 'AP': '16', 'TO': '17',
    'MA': '21', 'PI': '22', 'CE': '23', 'RN': '24', 'PB': '25', 'PE': '26', 'AL': '27',
    'SE': '28', 'BA': '29', 'MG': '31', 'ES': '32', 'RJ': '33', 'SP': '35', 'PR': '41',
    'SC': '42', 'RS': '43', 'MS': '50', 'MT': '51', 'GO': '52', 'DF': '53'
};

const codeToUf = Object.entries(ufToCode).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});

const codeToName = {
    '11': 'Rondônia', '12': 'Acre', '13': 'Amazonas', '14': 'Roraima', '15': 'Pará', '16': 'Amapá', '17': 'Tocantins',
    '21': 'Maranhão', '22': 'Piauí', '23': 'Ceará', '24': 'Rio Grande do Norte', '25': 'Paraíba', '26': 'Pernambuco', '27': 'Alagoas',
    '28': 'Sergipe', '29': 'Bahia', '31': 'Minas Gerais', '32': 'Espírito Santo', '33': 'Rio de Janeiro', '35': 'São Paulo', '41': 'Paraná',
    '42': 'Santa Catarina', '43': 'Rio Grande do Sul', '50': 'Mato Grosso do Sul', '51': 'Mato Grosso', '52': 'Goiás', '53': 'Distrito Federal'
};

router.get('/regiao/:regiaoSlug', async (req, res) => {
    const { regiaoSlug } = req.params;
    const chaveRegiao = regiaoSlug.toLowerCase().trim();
    const estadosDaRegiao = regionMap[chaveRegiao];

    if (!estadosDaRegiao) return res.status(400).json({ error: "Região inválida." });

    try {
        const query = `
            SELECT 
                municipality_name as nome,
                municipality_ibge_code as codarea,
                state_uf as uf,
                SUM(COALESCE(final_extracted_value, COALESCE(extracted_value, 0) + COALESCE(extracted_value_txt, 0))) as total_investido
            FROM mentions
            WHERE state_uf = ANY($1) 
            GROUP BY municipality_name, municipality_ibge_code, state_uf
            HAVING SUM(COALESCE(final_extracted_value, COALESCE(extracted_value, 0) + COALESCE(extracted_value_txt, 0))) > 0
            ORDER BY state_uf, total_investido DESC
        `;

        const result = await db.query(query, [estadosDaRegiao]);
        const linhas = result.rows;

        const estadosAgrupados = {};

        estadosDaRegiao.forEach(uf => {
            const codigo = ufToCode[uf];
            if (codigo) {
                estadosAgrupados[codigo] = {
                    codarea: codigo,
                    uf: uf,
                    nome: codeToName[codigo] || uf,
                    investimentos: []
                };
            }
        });

        let totalGeralRegiao = 0;

        linhas.forEach(row => {
            const codEstado = ufToCode[row.uf];
            const valorNumerico = parseFloat(row.total_investido);
            totalGeralRegiao += valorNumerico;

            if (codEstado && estadosAgrupados[codEstado]) {
                estadosAgrupados[codEstado].investimentos.push({
                    codarea_municipio: row.codarea,
                    nome: row.nome,
                    valor: valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                });
            }
        });

        res.json({
            regiao: chaveRegiao.toUpperCase(),
            investimentosGerais: [
                { 
                    nome: "Total Detectado na Região", 
                    valor: totalGeralRegiao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                }
            ],
            municipios: Object.values(estadosAgrupados)
        });

    } catch (error) {
        console.error('[MapRoutes] Erro na Região:', error);
        res.status(500).json({ error: 'Erro ao buscar dados da região.' });
    }
});

router.get('/municipio/:ibge', async (req, res) => {
    const { ibge } = req.params;
    try {
        const query = `
            SELECT municipality_name, state_uf, publication_date, source_url,
                COALESCE(final_extracted_value, COALESCE(extracted_value, 0) + COALESCE(extracted_value_txt, 0)) as valor_final,
                gemini_analysis, gemini_analysis_txt
                FROM mentions
                WHERE municipality_ibge_code = $1 
                AND (final_extracted_value IS NOT NULL OR extracted_value > 0 OR extracted_value_txt > 0)
                ORDER BY publication_date DESC;
        `;
        const { rows } = await db.query(query, [ibge]);

        if (rows.length === 0) return res.status(404).json({ message: "Nenhum dado." });

        const categoriesSummary = { medicamentos: 0, equipamentos: 0, obras_infraestrutura: 0, servicos_saude: 0, outros_relacionados: 0, estadia_paciente: 0 };
        let totalInvested = 0;

        rows.forEach(row => {
            const valorLinha = parseFloat(row.valor_final);
            totalInvested += valorLinha;

            const analysis = row.gemini_analysis_txt || row.gemini_analysis;
            let somaCategoriasLinha = 0;

            if (analysis) {
                const vMedicamentos = parseFloat(analysis.medicamentos || 0);
                const vEquipamentos = parseFloat(analysis.equipamentos || 0);
                const vObras = parseFloat(analysis.obras_infraestrutura || 0);
                const vServicos = parseFloat(analysis.servicos_saude || 0);
                const vEstadia = parseFloat(analysis.estadia_paciente || 0);
                const vOutros = parseFloat(analysis.outros_relacionados || 0);

                categoriesSummary.medicamentos += vMedicamentos;
                categoriesSummary.equipamentos += vEquipamentos;
                categoriesSummary.obras_infraestrutura += vObras;
                categoriesSummary.servicos_saude += vServicos;
                categoriesSummary.estadia_paciente += vEstadia;
                categoriesSummary.outros_relacionados += vOutros;

                somaCategoriasLinha = vMedicamentos + vEquipamentos + vObras + vServicos + vEstadia + vOutros;
            }

            const diferenca = valorLinha - somaCategoriasLinha;
            if (diferenca > 0.01) {
                categoriesSummary.outros_relacionados += diferenca;
            }
        });

        res.json({
            name: rows[0].municipality_name,
            uf: rows[0].state_uf,
            ibge: ibge,
            total_invested: totalInvested,
            categories: categoriesSummary,
            recent_mentions: rows.slice(0, 20).map(row => ({
                date: row.publication_date,
                value: parseFloat(row.valor_final),
                url: row.source_url,
                details: (row.gemini_analysis_txt || row.gemini_analysis)?.detalhes_extraidos || []
            }))
        });
    } catch (error) {
        console.error(`[MapRoutes] Erro Município ${ibge}:`, error);
        res.status(500).json({ error: "Erro interno." });
    }
});

router.get('/estado/:codIbge', async (req, res) => {
    const { codIbge } = req.params;
    
    const uf = codeToUf[codIbge];

    if (!uf) return res.status(400).json({ error: "Código de estado inválido." });

    try {
        const query = `
            SELECT 
                COALESCE(final_extracted_value, COALESCE(extracted_value, 0) + COALESCE(extracted_value_txt, 0)) as valor_final,
                gemini_analysis, gemini_analysis_txt
                FROM mentions
                WHERE state_uf = $1 
                AND (final_extracted_value IS NOT NULL OR extracted_value > 0 OR extracted_value_txt > 0);
        `;

        const { rows } = await db.query(query, [uf]);

        const categoriesSummary = {
            medicamentos: 0, equipamentos: 0, obras_infraestrutura: 0,
            servicos_saude: 0, outros_relacionados: 0, estadia_paciente: 0
        };

        let totalInvested = 0;

        rows.forEach(row => {
            const valorLinha = parseFloat(row.valor_final);
            totalInvested += valorLinha;

            const analysis = row.gemini_analysis_txt || row.gemini_analysis;
            let somaCategoriasLinha = 0;

            if (analysis) {
                const vMedicamentos = parseFloat(analysis.medicamentos || 0);
                const vEquipamentos = parseFloat(analysis.equipamentos || 0);
                const vObras = parseFloat(analysis.obras_infraestrutura || 0);
                const vServicos = parseFloat(analysis.servicos_saude || 0);
                const vEstadia = parseFloat(analysis.estadia_paciente || 0);
                const vOutros = parseFloat(analysis.outros_relacionados || 0);

                categoriesSummary.medicamentos += vMedicamentos;
                categoriesSummary.equipamentos += vEquipamentos;
                categoriesSummary.obras_infraestrutura += vObras;
                categoriesSummary.servicos_saude += vServicos;
                categoriesSummary.estadia_paciente += vEstadia;
                categoriesSummary.outros_relacionados += vOutros;

                somaCategoriasLinha = vMedicamentos + vEquipamentos + vObras + vServicos + vEstadia + vOutros;
            }

            const diferenca = valorLinha - somaCategoriasLinha;
            if (diferenca > 0.01) {
                categoriesSummary.outros_relacionados += diferenca;
            }
        });

        res.json({
            uf: uf,
            ibge: codIbge,
            name: codeToName[codIbge] || uf,
            total_invested: totalInvested,
            categories: categoriesSummary
        });

    } catch (error) {
        console.error(`[MapRoutes] Erro Estado ${codIbge}:`, error);
        res.status(500).json({ error: "Erro interno." });
    }
});

module.exports = router;