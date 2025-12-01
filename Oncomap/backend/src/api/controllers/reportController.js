const db = require('../../config/database');
const { getStatesByRegion } = require('../../utils/regionMap');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('html-pdf-node');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

const fmt = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const initCategories = () => ({
    medicamentos: 0, equipamentos: 0, obras: 0, servicos: 0, estadia: 0, outros: 0
});

const somaCategoriasComRetorno = (target, analysis) => {
    if (!analysis) return 0;
    const vMed = parseFloat(analysis.medicamentos || 0);
    const vEquip = parseFloat(analysis.equipamentos || 0);
    const vObras = parseFloat(analysis.obras_infraestrutura || 0);
    const vServ = parseFloat(analysis.servicos_saude || 0);
    const vEstadia = parseFloat(analysis.estadia_paciente || 0);
    const vOutros = parseFloat(analysis.outros_relacionados || 0);

    target.medicamentos += vMed;
    target.equipamentos += vEquip;
    target.obras += vObras;
    target.servicos += vServ;
    target.estadia += vEstadia;
    target.outros += vOutros;

    return vMed + vEquip + vObras + vServ + vEstadia + vOutros;
};

const cleanGeminiResponse = (text) => {
    const codeBlockMatch = text.match(/```html([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) return codeBlockMatch[1].trim();
    const htmlStart = text.indexOf('<h1');
    if (htmlStart !== -1) return text.substring(htmlStart).replace(/```/g, '').trim();
    return text.replace(/```html/g, '').replace(/```/g, '').trim();
};

// --- GERAÇÃO DO PDF (LAYOUT FLUIDO E SEM BURACOS) ---
const createPdf = async (htmlContent) => {
    const finalHtml = `
        <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Helvetica', Arial, sans-serif; padding: 40px; padding-bottom: 60px; color: #333; line-height: 1.6; -webkit-print-color-adjust: exact; }
                    
                    /* Títulos - Mantém a regra de não ficar sozinho no fim da página */
                    h1 { color: #0D4B55; text-align: center; border-bottom: 3px solid #0D4B55; padding-bottom: 15px; margin-bottom: 30px; font-size: 26px; page-break-after: avoid; }
                    h2 { color: #2E7D32; margin-top: 30px; border-left: 6px solid #2E7D32; padding-left: 15px; font-size: 20px; background-color: #f1f8e9; padding: 10px; page-break-after: avoid; }
                    h3 { color: #444; margin-top: 25px; margin-bottom: 10px; font-size: 15px; text-transform: uppercase; font-weight: bold; border-bottom: 1px dashed #ccc; page-break-after: avoid; }
                    
                    p { text-align: justify; margin-bottom: 15px; font-size: 13px; color: #444; }
                    
                    /* TABELAS - Essas SIM devem ficar juntas, não podem quebrar no meio */
                    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px; table-layout: fixed; }
                    table, tr, td, th { page-break-inside: avoid !important; break-inside: avoid !important; }
                    
                    th, td { border: 1px solid #999 !important; padding: 10px 12px; vertical-align: middle; word-wrap: break-word; }
                    th { background-color: #0D4B55 !important; color: white !important; font-weight: bold; text-transform: uppercase; font-size: 11px; text-align: left; }
                    tr:nth-child(even) { background-color: #f2f2f2 !important; }
                    
                    th:first-child, td:first-child { width: 65%; text-align: left; }
                    th:last-child, td:last-child { width: 35%; text-align: right; }

                    .total-geral { font-size: 18px; font-weight: bold; text-align: center; margin: 30px 0; padding: 20px; background: #e0f2f1; border: 1px solid #00695c; color: #004d40; border-radius: 8px; }
                    
                    /* AQUI ESTÁ A CORREÇÃO DO ESPAÇO EM BRANCO */
                    /* Removemos o page-break-inside: avoid daqui para deixar o ano fluir entre páginas */
                    .ano-section { 
                        margin-bottom: 50px; 
                        display: block;
                    }
                    
                    .footer { position: fixed; bottom: 0; left: 0; right: 0; height: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; background-color: white; }
                </style>
            </head>
            <body>
                ${htmlContent}
                <div class="footer">Relatório detalhado gerado pelo OncoMap em ${new Date().toLocaleDateString()}.</div>
            </body>
        </html>
    `;

    const options = { 
        format: 'A4', 
        printBackground: true, 
        margin: { top: "40px", bottom: "60px", left: "25px", right: "25px" },
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--font-render-hinting=none']
    };

    return pdf.generatePdf({ content: finalHtml }, options);
};

// --- 1. RELATÓRIO POR REGIÃO ---
const generateRegionReport = async (req, res) => {
    const { regionName } = req.params;
    const states = getStatesByRegion(regionName);
    if (states.length === 0) return res.status(400).json({ error: "Região inválida." });

    try {
        const queryRaw = `SELECT EXTRACT(YEAR FROM publication_date) as ano, state_uf, COALESCE(final_extracted_value, COALESCE(extracted_value, 0) + COALESCE(extracted_value_txt, 0)) as valor, gemini_analysis, gemini_analysis_txt FROM mentions WHERE state_uf = ANY($1) AND (final_extracted_value IS NOT NULL OR extracted_value > 0 OR extracted_value_txt > 0) ORDER BY publication_date DESC;`;
        const { rows: rowsRaw } = await db.query(queryRaw, [states]);

        const dadosPorAno = {};
        let totalGeral = 0;
        const categoriasGerais = initCategories();

        rowsRaw.forEach(row => {
            const ano = row.ano || 'Indefinido';
            const valor = parseFloat(row.valor);
            const analysis = row.gemini_analysis_txt || row.gemini_analysis;
            totalGeral += valor;
            const catGeral = somaCategoriasComRetorno(categoriasGerais, analysis);
            if ((valor - catGeral) > 0.01) categoriasGerais.outros += (valor - catGeral);

            if (!dadosPorAno[ano]) dadosPorAno[ano] = { total: 0, categorias: initCategories(), estados: {} };
            dadosPorAno[ano].total += valor;
            const catAno = somaCategoriasComRetorno(dadosPorAno[ano].categorias, analysis);
            if ((valor - catAno) > 0.01) dadosPorAno[ano].categorias.outros += (valor - catAno);
            
            if (!dadosPorAno[ano].estados[row.state_uf]) dadosPorAno[ano].estados[row.state_uf] = 0;
            dadosPorAno[ano].estados[row.state_uf] += valor;
        });

        const dataContext = JSON.stringify({
            regiao: regionName.toUpperCase(),
            total_acumulado: fmt(totalGeral),
            categorias_gerais: categoriasGerais,
            evolucao_anual: dadosPorAno
        });

        const prompt = `
            Atue como um Auditor Sênior de Contas Públicas. Seu objetivo é criar um relatório minucioso e extenso.
            REGIÃO: ${regionName.toUpperCase()}. DADOS: ${dataContext}.
            
            REGRAS DE TABELA (RIGOROSO):
            - Use APENAS HTML puro: <table>, <thead>, <tbody>, <tr>, <th>, <td>.
            - NÃO use CSS inline ou classes.
            - Tabelas sempre com 2 colunas: Descrição e Valor.
            
            ESTRUTURA E CONTEÚDO (HTML):
            
            1. <h1>Relatório Regional: ${regionName.toUpperCase()}</h1>
            2. <div class="total-geral">Investimento Total Detectado: ${fmt(totalGeral)}</div>
            
            3. <h2>Visão Geral do Período</h2>
            - Tabela acumulada (Categorias | Valor).
            - <p><strong>Análise Estrutural:</strong> [ESCREVA 2 PARÁGRAFOS DETALHADOS. Identifique qual foi a prioridade da região como um todo. Explique se o foco foi infraestrutura (Obras) ou custeio (Medicamentos/Serviços). Discuta a magnitude do valor total.]</p>

            4. (LOOP PARA CADA ANO):
               <div class="ano-section">
                   <h2>Exercício Financeiro de [ANO]</h2>
                   
                   <h3>1. Distribuição Geográfica (Estados)</h3>
                   - Tabela (Estado | Valor).
                   - <p>[ESCREVA UM PARÁGRAFO comparando os estados. Quem liderou os investimentos? Houve muita disparidade entre eles?]</p>

                   <h3>2. Detalhamento Temático</h3>
                   - Tabela (Categoria | Valor).
                   
                   <h3>3. Parecer de Auditoria</h3>
                   - <p>[ESCREVA 2 a 3 PARÁGRAFOS DENSOS. Analise profundamente como o dinheiro foi gasto neste ano. Se houve aumento em relação a outros anos, levante hipóteses (ex: novas obras, combate a endemias). Não seja superficial. Use linguagem técnica de gestão pública.]</p>
               </div>
            
            5. <h2>Conclusão Regional</h2>
            - <p>[RESUMO EXECUTIVO FINAL de 2 parágrafos sobre a tendência de gastos na região.]</p>
        `;

        const result = await model.generateContent(prompt);
        const pdfBuffer = await createPdf(cleanGeminiResponse(result.response.text()));
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Erro Região PDF:", error);
        res.status(500).json({ error: "Erro ao gerar PDF." });
    }
};

// --- 2. RELATÓRIO POR ESTADO ---
const generateStateReport = async (req, res) => {
    const { uf } = req.params;
    try {
        const query = `SELECT EXTRACT(YEAR FROM publication_date) as ano, municipality_name, COALESCE(final_extracted_value, COALESCE(extracted_value, 0) + COALESCE(extracted_value_txt, 0)) as valor, gemini_analysis, gemini_analysis_txt FROM mentions WHERE state_uf = $1 AND (final_extracted_value IS NOT NULL OR extracted_value > 0 OR extracted_value_txt > 0) ORDER BY publication_date DESC;`;
        const { rows } = await db.query(query, [uf.toUpperCase()]);
        if (rows.length === 0) return res.status(404).json({ error: "Sem dados." });

        const dadosPorAno = {};
        let totalGeral = 0;
        const categoriasGerais = initCategories();

        rows.forEach(row => {
            const val = parseFloat(row.valor);
            const ano = row.ano || 'Indefinido';
            const analysis = row.gemini_analysis_txt || row.gemini_analysis;
            totalGeral += val;
            const catGeral = somaCategoriasComRetorno(categoriasGerais, analysis);
            if ((val - catGeral) > 0.01) categoriasGerais.outros += (val - catGeral);

            if (!dadosPorAno[ano]) dadosPorAno[ano] = { total: 0, categorias: initCategories(), municipios: {} };
            dadosPorAno[ano].total += val;
            const catAno = somaCategoriasComRetorno(dadosPorAno[ano].categorias, analysis);
            if ((val - catAno) > 0.01) dadosPorAno[ano].categorias.outros += (val - catAno);

            if (!dadosPorAno[ano].municipios[row.municipality_name]) dadosPorAno[ano].municipios[row.municipality_name] = 0;
            dadosPorAno[ano].municipios[row.municipality_name] += val;
        });

        const dataContext = JSON.stringify({
            estado: uf.toUpperCase(),
            total_acumulado: fmt(totalGeral),
            categorias_gerais: categoriasGerais,
            evolucao_anual: dadosPorAno
        });

        const prompt = `
            Você é um Consultor de Orçamento Público. Gere um relatório extenso e detalhado.
            ESTADO: ${uf.toUpperCase()}. DADOS: ${dataContext}.
            
            REGRAS DE TABELA: APENAS HTML padrão (table, tr, td). Sem CSS inline. 2 colunas.
            
            ESTRUTURA (HTML):
            
            1. <h1>Relatório Estadual: ${uf.toUpperCase()}</h1>
            2. <div class="total-geral">Montante Total Acumulado: ${fmt(totalGeral)}</div>
            
            3. <h2>Visão Geral do Período</h2>
            - Tabela acumulada (Categorias).
            - <p><strong>Perfil de Gastos:</strong> [ESCREVA 2 PARÁGRAFOS. Analise se o estado prioriza saúde preventiva (Medicamentos/Serviços) ou estrutural (Obras/Equipamentos). Comente sobre a proporção de gastos em "Outros".]</p>

            4. (LOOP PARA CADA ANO):
               <div class="ano-section">
                   <h2>Exercício de [ANO]</h2>
                   
                   <h3>1. Top Municípios Investidores</h3>
                   - Tabela (Município | Valor).
                   - <p>[Comente brevemente sobre a concentração de recursos nos maiores municípios.]</p>

                   <h3>2. Detalhamento por Categoria</h3>
                   - Tabela (Categoria | Valor).
                   
                   <h3>3. Análise Detalhada do Ano</h3>
                   - <p>[ESCREVA 2 a 3 PARÁGRAFOS COMPLETOS. Não faça listas. Escreva um texto corrido explicando o comportamento dos gastos neste ano. Houve um salto em relação aos outros anos? Qual categoria puxou esse crescimento? Dê contexto.]</p>
               </div>
            
            5. <h2>Conclusão Estadual</h2>
            - <p>[TEXTO CONCLUSIVO sobre a eficácia e direção dos investimentos no estado.]</p>
        `;

        const result = await model.generateContent(prompt);
        const pdfBuffer = await createPdf(cleanGeminiResponse(result.response.text()));
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Erro Estado PDF:", error);
        res.status(500).json({ error: "Erro ao gerar PDF." });
    }
};

// --- 3. RELATÓRIO MUNICIPAL ---
const generateMunicipalityReport = async (req, res) => {
    const { ibge } = req.params;
    try {
        const query = `SELECT EXTRACT(YEAR FROM publication_date) as ano, municipality_name, state_uf, COALESCE(final_extracted_value, COALESCE(extracted_value, 0) + COALESCE(extracted_value_txt, 0)) as valor, gemini_analysis, gemini_analysis_txt FROM mentions WHERE municipality_ibge_code = $1 AND (final_extracted_value IS NOT NULL OR extracted_value > 0 OR extracted_value_txt > 0) ORDER BY publication_date DESC;`;
        const { rows } = await db.query(query, [ibge]);
        if (rows.length === 0) return res.status(404).json({ error: "Sem dados." });

        const dadosPorAno = {};
        let totalGeral = 0;
        const categoriasGerais = initCategories();

        rows.forEach(row => {
            const val = parseFloat(row.valor);
            const ano = row.ano || 'Indefinido';
            const analysis = row.gemini_analysis_txt || row.gemini_analysis;
            totalGeral += val;
            const catGeral = somaCategoriasComRetorno(categoriasGerais, analysis);
            if ((val - catGeral) > 0.01) categoriasGerais.outros += (val - catGeral);

            if (!dadosPorAno[ano]) dadosPorAno[ano] = { total: 0, categorias: initCategories() };
            dadosPorAno[ano].total += val;
            const catAno = somaCategoriasComRetorno(dadosPorAno[ano].categorias, analysis);
            if ((val - catAno) > 0.01) dadosPorAno[ano].categorias.outros += (val - catAno);
        });

        const prompt = `
            Você é um Auditor Municipal especializado em Saúde Pública. Gere um relatório profundo.
            MUNICÍPIO: ${rows[0].municipality_name}. DADOS: ${JSON.stringify(dadosPorAno)}.
            TOTAL: ${fmt(totalGeral)}.
            
            REGRAS DE TABELA: APENAS HTML padrão. Sem CSS. 2 colunas.
            
            ESTRUTURA (HTML):
            
            1. <h1>Relatório Municipal: ${rows[0].municipality_name}</h1>
            2. <div class="total-geral">Total Investido no Período: ${fmt(totalGeral)}</div>
            
            3. <h2>Visão Geral da Gestão</h2>
            - Tabela acumulada (Categorias).
            - <p><strong>Diagnóstico Inicial:</strong> [ESCREVA 2 PARÁGRAFOS. Analise o perfil de investimento da cidade. É uma cidade que constrói muito (Obras) ou que foca em atendimento (Serviços/Medicamentos)? O valor total é expressivo para o porte da cidade?]</p>

            4. (LOOP PARA CADA ANO):
               <div class="ano-section">
                   <h2>Exercício de [ANO]</h2>
                   
                   <h3>Destinação dos Recursos</h3>
                   - Tabela (Categoria | Valor).
                   
                   <h3>Parecer Técnico do Ano</h3>
                   - <p>[ESCREVA UM TEXTO LONGO (Mínimo 10 linhas ou 2 parágrafos). Analise detalhadamente para onde foi o dinheiro. Se houve gasto em Equipamentos, explique que isso moderniza o atendimento. Se foi em Obras, cite infraestrutura. Evite frases curtas. Compare com a média geral.]</p>
               </div>
            
            5. <h2>Conclusão Municipal</h2>
            - <p>[Parecer final sobre a transparência e foco dos investimentos na saúde municipal.]</p>
        `;

        const result = await model.generateContent(prompt);
        const pdfBuffer = await createPdf(cleanGeminiResponse(result.response.text()));
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Erro Município PDF:", error);
        res.status(500).json({ error: "Erro ao gerar PDF." });
    }
};

module.exports = { generateRegionReport, generateStateReport, generateMunicipalityReport };