const db = require('../../config/database');

const getGeneralStats = async (req, res) => {
    try {
        const statesQuery = `
            SELECT 
                state_uf,
                SUM(final_extracted_value) as total_value
            FROM mentions
            WHERE final_extracted_value IS NOT NULL
            GROUP BY state_uf
            ORDER BY total_value DESC;
        `;

        const municipalitiesQuery = `
            SELECT 
                municipality_ibge_code,
                municipality_name,
                state_uf,
                SUM(final_extracted_value) as total_value
            FROM mentions
            WHERE final_extracted_value IS NOT NULL
            GROUP BY municipality_ibge_code, municipality_name, state_uf
            ORDER BY total_value DESC;
        `;

        const [statesResult, municipalitiesResult] = await Promise.all([
            db.query(statesQuery),
            db.query(municipalitiesQuery)
        ]);

        const statesData = {};
        statesResult.rows.forEach(row => {
            statesData[row.state_uf] = parseFloat(row.total_value || 0);
        });

        const municipalitiesData = municipalitiesResult.rows.map(row => ({
            ibge: row.municipality_ibge_code,
            name: row.municipality_name,
            uf: row.state_uf,
            total: parseFloat(row.total_value || 0)
        }));

        res.status(200).json({
            states: statesData,
            municipalities: municipalitiesData
        });

    } catch (error) {
        console.error("Erro ao buscar estatísticas gerais:", error);
        res.status(500).json({ error: "Erro interno ao processar estatísticas." });
    }
};

const getStateSpecificStats = async (req, res) => {
    const { uf } = req.params;

    try {
        const query = `
            SELECT 
                municipality_name,
                municipality_ibge_code,
                SUM(final_extracted_value) as total_value
            FROM mentions
            WHERE state_uf = $1 AND final_extracted_value IS NOT NULL
            GROUP BY municipality_name, municipality_ibge_code
            ORDER BY total_value DESC;
        `;

        const { rows } = await db.query(query, [uf.toUpperCase()]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Nenhum dado encontrado para este estado." });
        }

        const totalState = rows.reduce((acc, row) => acc + parseFloat(row.total_value), 0);

        res.status(200).json({
            uf: uf.toUpperCase(),
            total_invested: totalState,
            municipalities: rows.map(row => ({
                name: row.municipality_name,
                ibge: row.municipality_ibge_code,
                total: parseFloat(row.total_value)
            }))
        });

    } catch (error) {
        console.error(`Erro ao buscar estado ${uf}:`, error);
        res.status(500).json({ error: "Erro interno." });
    }
};

const getMunicipalitySpecificStats = async (req, res) => {
    const { ibge } = req.params;

    try {
        const query = `
            SELECT 
                municipality_name,
                state_uf,
                publication_date,
                source_url,
                final_extracted_value,
                gemini_analysis
            FROM mentions
            WHERE municipality_ibge_code = $1 AND final_extracted_value IS NOT NULL
            ORDER BY publication_date DESC;
        `;

        const { rows } = await db.query(query, [ibge]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Nenhum dado encontrado para este município." });
        }

        const categoriesSummary = {
            medicamentos: 0,
            equipamentos: 0,
            obras_infraestrutura: 0,
            servicos_saude: 0,
            outros_relacionados: 0,
            estadia_paciente: 0
        };

        rows.forEach(row => {
            const analysis = row.gemini_analysis;
            if (analysis) {
                categoriesSummary.medicamentos += parseFloat(analysis.medicamentos || 0);
                categoriesSummary.equipamentos += parseFloat(analysis.equipamentos || 0);
                categoriesSummary.obras_infraestrutura += parseFloat(analysis.obras_infraestrutura || 0);
                categoriesSummary.servicos_saude += parseFloat(analysis.servicos_saude || 0);
                categoriesSummary.outros_relacionados += parseFloat(analysis.outros_relacionados || 0);
                categoriesSummary.estadia_paciente += parseFloat(analysis.estadia_paciente || 0);
            }
        });

        const totalInvested = rows.reduce((acc, row) => acc + parseFloat(row.final_extracted_value), 0);

        res.status(200).json({
            name: rows[0].municipality_name,
            uf: rows[0].state_uf,
            ibge: ibge,
            total_invested: totalInvested,
            categories: categoriesSummary,
            recent_mentions: rows.slice(0, 10).map(row => ({
                date: row.publication_date,
                value: parseFloat(row.final_extracted_value),
                url: row.source_url,
                details: row.gemini_analysis?.detalhes_extraidos || []
            }))
        });

    } catch (error) {
        console.error(`Erro ao buscar município ${ibge}:`, error);
        res.status(500).json({ error: "Erro interno." });
    }
};

module.exports = {
    getGeneralStats,
    getStateSpecificStats,
    getMunicipalitySpecificStats
};