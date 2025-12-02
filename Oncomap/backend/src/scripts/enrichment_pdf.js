// Oncomap/backend/src/scripts/enrichment_pdf.js
// VERSÃO: AUTO (Sem Range de ID) - Processa tudo que está pendente
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/database');
const axios = require('axios');
require('dotenv').config();
const { get_encoding } = require("tiktoken");
const pdfParse = require('pdf-parse');

// --- 1. CONFIGURAÇÃO DO ROTEADOR DE CHAVES ---
const apiKeys = (process.env.GEMINI_API_KEYS || "")
    .split(',')
    .map(key => key.trim())
    .filter(key => key.length > 0);

if (apiKeys.length === 0) {
    console.error("❌ ERRO FATAL: Nenhuma GEMINI_API_KEYS encontrada no .env. Adicione-as separadas por vírgula.");
    process.exit(1);
}

let currentKeyIndex = 0;
let genAIInstance = null;
let modelInstance = null;

function updateModelInstance() {
    const currentKey = apiKeys[currentKeyIndex];
    console.log(`\n🔄 Inicializando/Atualizando instância da API. Usando Chave #${currentKeyIndex + 1} de ${apiKeys.length}.`);
    genAIInstance = new GoogleGenerativeAI(currentKey);
    modelInstance = genAIInstance.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
}

function switchToNextKey() {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.warn(`\n-> 🔑 Trocando para a Chave de API #${currentKeyIndex + 1}...\n`);
    updateModelInstance();
}

updateModelInstance();
// --- FIM DO ROTEADOR DE CHAVES ---

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- CONSTANTES DE CONTROLE ---
const MAX_TOKENS_PARA_PROCESSAR = 800000;
const MAX_RETRIES = 3;
const DELAY_BETWEEN_MENTIONS = 1000;

const tokenizer = get_encoding("cl100k_base");

// --- FUNÇÕES DE PROMPT E EXTRAÇÃO ---
function getGeminiPrompt(textContent, mentionId, municipalityName) {
     return `
      **Tarefa:** VOCÊ É UM ANALISTA FINANCEIRO ESPECIALIZADO EM ORÇAMENTO PÚBLICO DE SAÚDE ONCOLÓGICA. Analise CUIDADOSAMENTE o seguinte texto extraído de um Diário Oficial Municipal brasileiro. Seu objetivo é:
      1. Identificar, extrair e somar TODOS os valores monetários (em Reais) que representem gastos ou investimentos DIRETAMENTE relacionados à área de ONCOLOGIA.
      2. Categorizar esses valores somados conforme as regras abaixo.
      3. Extrair informações contextuais RELEVANTES sobre esses gastos oncológicos, se claramente presentes.

      **Formatos de Valor a Procurar (Exemplos):** R$ 1.234,56, Valor: 1.234,56, custo total de 1.234,56, etc.

      **Formato OBRIGATÓRIO da Resposta:**
      Sua resposta deve ser **EXCLUSIVAMENTE um objeto JSON válido**, sem nenhum texto antes ou depois, e sem usar markdown (como \`\`\`json). A estrutura base é MANDATÓRIA, mas campos adicionais podem ser incluídos se relevantes.

      {
        "mention_id": ${mentionId},
        "municipality_name": "${municipalityName}",
        "total_gasto_oncologico": 0.00,  // MANDATÓRIO (Soma calculada por você)
        "medicamentos": 0.00,         // MANDATÓRIO
        "equipamentos": 0.00,         // MANDATÓRIO
        "estadia_paciente": 0.00,       // MANDATÓRIO
        "obras_infraestrutura": 0.00,  // MANDATÓRIO
        "servicos_saude": 0.00,         // MANDATÓRIO
        "outros_relacionados": 0.00,    // MANDATÓRIO
        "detalhes_extraidos": [
           {
              "valor_individual": 1234.56,
              "categoria_estimada": "Medicamentos",
              "empresa_contratada": "Nome da Empresa LTDA",
              "objeto_contrato": "Descrição breve do serviço/produto oncológico",
              "numero_processo": "123/2025"
           }
        ]
      }

      **Regras Detalhadas:**
      1.  **Foco Estrito em Oncologia:** Considere APENAS valores ligados a oncologia, câncer, quimioterapia, radioterapia, etc.
      2.  **Extração e Conversão Numérica:** Encontre TODOS os valores. Converta para float (ponto decimal).
      3.  **Categorização:** Siga as definições...
      4.  **Soma Total:** Deve ser a soma exata das outras categorias. VERIFIQUE A SOMA.
      5.  **Detalhes Extraídos:** Adicione um objeto ao array para CADA valor encontrado. Se nenhum valor for encontrado, retorne um array vazio [].
      6.  **Nenhum Valor Encontrado:** JSON com valores numéricos zerados e array "detalhes_extraidos" vazio [].
      7.  **JSON Puro:** Apenas o JSON.

      **Texto para Análise:**
      """
      ${textContent}
      """
  `;
}

function extractJsonFromString(text) {
    if (!text) return null;
    const match = text.match(/\{[\s\S]*\}/);
    let potentialJson = null;
    if (match) {
        potentialJson = match[0].trim();
    } else {
        potentialJson = text.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }
    if (potentialJson && potentialJson.startsWith('{') && potentialJson.endsWith('}')) {
   try { 
       JSON.parse(potentialJson); 
       return potentialJson; 
   } catch { 
       return null; 
   }
}
    return null;
}

async function processSingleText(textContent, mentionId, municipalityName) {
     let attempt = 0;
     let keysRotatedThisChunk = 0;

    while (attempt < MAX_RETRIES) {
        try {
            console.log(`    -> [Chunk 1/1] Enviando texto (Chave #${currentKeyIndex + 1}, Tentativa ${attempt + 1})...`);
            const prompt = getGeminiPrompt(textContent, mentionId, municipalityName);
            const generationConfig = { responseMimeType: "application/json" };
            
            const result = await modelInstance.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig
            });

            const rawResponseText = result.response.text();
            console.log(`    -> [Chunk 1/1] Resposta recebida (Chave #${currentKeyIndex + 1}).`);

            const jsonString = extractJsonFromString(rawResponseText);
            if (jsonString) {
                try {
                    const chunkAnalysis = JSON.parse(jsonString);
                    if (typeof chunkAnalysis.total_gasto_oncologico !== 'number' || !Array.isArray(chunkAnalysis.detalhes_extraidos)) {
                         console.warn(`    -> Aviso: JSON extraído não possui a estrutura esperada.`);
                         return null;
                    }
                    return chunkAnalysis;
                } catch (parseError) { 
                    console.error(`    -> ❌ Erro ao analisar JSON do chunk:`, parseError.message);
                    return null; 
                }
            } else { 
                console.error(`    -> ❌ Não foi possível extrair JSON do chunk.`);
                return null; 
            }
        
        } catch (error) {
            let isRateLimitError = (error.status === 429 || (error.message && (error.message.toLowerCase().includes('resource_exhausted') || error.message.toLowerCase().includes('rate limit'))));

            if (isRateLimitError) {
                console.warn(`    -> 🚦 Rate limit atingido na Chave #${currentKeyIndex + 1} (Chunk 1/1).`);
                
                if (keysRotatedThisChunk >= apiKeys.length - 1) {
                    console.error(`    -> ❌ FALHA TOTAL: Todas as ${apiKeys.length} chaves de API estão em rate limit. Abortando o script.`);
                    throw new Error("ALL_KEYS_RATE_LIMITED"); 
                } else {
                    switchToNextKey();
                    keysRotatedThisChunk++;
                }
            } else {
                console.error(`    -> ❌ ERRO FATAL no chunk 1/1 (ID ${mentionId}):`, error.message);
                if (error.response && error.response.data) { console.error('       Detalhes API:', JSON.stringify(error.response.data, null, 2)); }
                attempt++;
                if (attempt < MAX_RETRIES) {
                    await delay(Math.pow(2, attempt) * 1000);
                } else {
                    console.error(`       -> Desistindo deste chunk após ${MAX_RETRIES} tentativas.`);
                    return null;
                }
            }
        }
    } 
    console.error(`    -> ❌ Excedido retries para chunk 1/1 (ID ${mentionId}).`);
    return null;
}

/**
 * Função principal do script - MODIFICADA PARA AUTOMÁTICO (SEM ARGS)
 */
async function enrichData() {
    console.log('✅ Iniciando script de enriquecimento PDF (Modo Automático)...');
    console.log(`🎯 Buscando TODAS as menções pendentes de análise PDF...`);

    let totalProcessadasComSucesso = 0;
    let totalProcessadasComFalha = 0;
    let totalPuladosPorTamanho = 0;

    try {
        while (true) {
            let mentionsToProcess = null;
            try {
                // MODIFICAÇÃO AQUI: Removemos o WHERE id >= $1...
                // Agora pegamos tudo que é NULL e tem source_url
                mentionsToProcess = await db.query(
                    `SELECT id, source_url, municipality_name 
                     FROM mentions 
                     WHERE gemini_analysis IS NULL 
                     AND source_url IS NOT NULL
                     ORDER BY id ASC 
                     LIMIT 100`
                );
            } catch(dbError) {
                console.error("❌ Erro fatal ao buscar menções no banco. Abortando.", dbError.message);
                throw dbError; 
            }

            if (mentionsToProcess.rows.length === 0) {
                console.log('🎉 Nenhuma menção nova para processar. Trabalho concluído.');
                break; 
            }
            
            console.log(`\nℹ️  Encontrado lote de ${mentionsToProcess.rows.length} menções pendentes...`);

            let successCount = 0;
            let failureCount = 0;
            let puladosNesteLote = 0;
            
            for (const [index, mention] of mentionsToProcess.rows.entries()) {
                console.log(`\n[Lote: ${index + 1}/${mentionsToProcess.rows.length}] Iniciando processamento da menção ID: ${mention.id} (${mention.municipality_name})...`);

                let textToAnalyze = null;
                let sourceUsed = 'pdf';
                let finalAnalysisData = {};
                let finalCalculatedTotal = 0.00;
                let success = false;

                try {
                    console.log(`  -> Baixando PDF de: ${mention.source_url}`);
                    const response = await axios.get(mention.source_url, { 
                        responseType: 'arraybuffer',
                        timeout: 15000 
                    });
                    const pdfBuffer = response.data;
                    
                    console.log(`  -> PDF baixado. Extraindo texto...`);
                    const data = await pdfParse(pdfBuffer);
                    textToAnalyze = data.text;
                    console.log(`  -> Texto extraído (${textToAnalyze.length} caracteres).`);
                    
                    if (!textToAnalyze || textToAnalyze.trim() === '') {
                         console.warn('  -> Aviso: Texto extraído do PDF está vazio. Marcando como falha.');
                         finalAnalysisData = { error: 'Texto extraído do PDF estava vazio.', source: sourceUsed, chunked: false };
                         success = false;
                    } else {
                        let tokenCount = 0;
                        try {
                            tokenCount = tokenizer.encode(textToAnalyze).length;
                        } catch (encodeError) {
                             console.error(`  -> ❌ Erro ao tokenizar texto (ID: ${mention.id}). Pulando.`, encodeError.message);
                             finalAnalysisData = { error: `Erro ao tokenizar: ${encodeError.message}`, source: sourceUsed, chunked: false };
                             success = false;
                        }

                        if (!finalAnalysisData.error) {
                            if (tokenCount > MAX_TOKENS_PARA_PROCESSAR) {
                                console.warn(`  -> ⚠️ TEXTO MUITO LONGO (${tokenCount} tokens > ${MAX_TOKENS_PARA_PROCESSAR}). Pulando análise.`);
                                finalAnalysisData = { 
                                    error: `Texto muito longo (${tokenCount} tokens) para processar.`, 
                                    source: sourceUsed, 
                                    chunked: false, 
                                    approx_tokens: tokenCount 
                                };
                                success = false;
                                puladosNesteLote++;
                            
                            } else {
                                console.log(`  -> Texto curto (${tokenCount} tokens). Processando...`);
                                const result = await processSingleText(textToAnalyze, mention.id, mention.municipality_name);
                                
                                if (result) {
                                    finalCalculatedTotal = result.total_gasto_oncologico; 
                                    finalAnalysisData = {
                                         ...result,
                                         source: sourceUsed,
                                         chunked: false,
                                         approx_tokens: tokenCount
                                    };
                                    success = true;
                                } else {
                                     finalAnalysisData = { error: 'Falha no processamento do texto curto', source: sourceUsed, approx_tokens: tokenCount };
                                     finalCalculatedTotal = 0.00;
                                     success = false;
                                }
                            }
                        } 
                    }

                    await db.query(
                        `UPDATE mentions SET gemini_analysis = $1, extracted_value = $2 WHERE id = $3`,
                        [JSON.stringify(finalAnalysisData), finalCalculatedTotal, mention.id]
                    );

                    if(success){
                         console.log(`  -> Sucesso final! Total calculado: R$ ${finalCalculatedTotal.toFixed(2)}`);
                         successCount++;
                    } else {
                          console.error(`  -> Falha final no processamento da menção ID ${mention.id}.`);
                          failureCount++;
                    }

                } catch (error) {
                    if (error.message === "ALL_KEYS_RATE_LIMITED") {
                        console.error("Erro pego no loop principal: ALL_KEYS_RATE_LIMITED.");
                        throw error;
                    }
                    
                    console.error(`❌ ERRO INESPERADO no loop principal ID ${mention.id}:`, error.message);
                     try {
                         await db.query(
                             `UPDATE mentions SET gemini_analysis = $1, extracted_value = 0.00 WHERE id = $2`,
                             [JSON.stringify({ error: `Erro inesperado: ${error.message}`, source: sourceUsed, chunked: false }), mention.id]
                         );
                     } catch (dbError) { console.error("Erro DB:", dbError.message); }
                     failureCount++;
                }

                await delay(DELAY_BETWEEN_MENTIONS);
            } 

            console.log(`\n📊 Lote finalizado! Sucessos: ${successCount} | Falhas: ${failureCount} | Pulados: ${puladosNesteLote}`);
            totalProcessadasComSucesso += successCount;
            totalProcessadasComFalha += failureCount;
            totalPuladosPorTamanho += puladosNesteLote; 
            
            await delay(5000); 

        } 
    } catch (error) {
        if (error.message === "ALL_KEYS_RATE_LIMITED") {
            console.error("\n🚫 PROCESSO INTERROMPIDO: Rate Limit.");
        } else {
            console.error("\n💥 Falha fatal:", error);
        }
        tokenizer.free();
        process.exit(1);
    } 

    console.log(`\n🎉 Processo PDF AUTOMÁTICO finalizado!`);
    console.log(`   - TOTAL Sucessos: ${totalProcessadasComSucesso}`);
    console.log(`   - TOTAL Falhas: ${totalProcessadasComFalha}`);
    console.log(`   - TOTAL Pulados: ${totalPuladosPorTamanho}`);

    tokenizer.free();
}

// --- EXECUÇÃO SEM ARGUMENTOS ---
// O script agora roda direto, sem precisar de ID inicial/final
enrichData().catch(error => {
    if (error.message !== "ALL_KEYS_RATE_LIMITED") {
        console.error("\n💥 Falha fatal (catch final):", error);
    }
    tokenizer.free();
    process.exit(1);
});