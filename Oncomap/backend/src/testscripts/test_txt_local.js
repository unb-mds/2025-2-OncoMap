const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/database');
const axios = require('axios');
require('dotenv').config();
const { get_encoding } = require("tiktoken");

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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_TOKENS_PARA_PROCESSAR_POR_CHUNK = 800000; 
const MAX_RETRIES = 3;
const DELAY_BETWEEN_MENTIONS = 1000;
const DELAY_BETWEEN_CHUNKS = 2000;

const tokenizer = get_encoding("cl100k_base");

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
    const match = text.match(/\{[\sS]*\}/);
    let potentialJson = null;
    if (match) {
        potentialJson = match[0].trim();
    } else {
        potentialJson = text.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }
    if (potentialJson && potentialJson.startsWith('{') && potentialJson.endsWith('}')) {
       try { JSON.parse(potentialJson); return potentialJson; } 
       catch {
        return null;
       }
    }
    return null;
}

function splitTextIntoChunksByToken(text, maxTokens, tokenizerInstance) {
    const chunks = [];
    const tokens = tokenizerInstance.encode(text);
    if (tokens.length <= maxTokens) return [text];
    console.log(`    -> Texto longo (${tokens.length} tokens). Dividindo em chunks de ${maxTokens} tokens...`);
    let startIndex = 0;
    while (startIndex < tokens.length) {
        const endIndex = Math.min(startIndex + maxTokens, tokens.length);
        const chunkTokens = tokens.slice(startIndex, endIndex);
        const chunkText = tokenizerInstance.decode(chunkTokens);
        chunks.push(chunkText);
        startIndex = endIndex;
    }
    console.log(`    -> Dividido em ${chunks.length} chunks.`);
    return chunks;
}

async function processSingleChunk(chunkText, mentionId, municipalityName, chunkIndex, totalChunks) {
     let attempt = 0;
     let keysRotatedThisChunk = 0;
    while (attempt < MAX_RETRIES) {
        try {
            console.log(`    -> [Chunk ${chunkIndex + 1}/${totalChunks}] Enviando texto (Chave #${currentKeyIndex + 1}, Tentativa ${attempt + 1})...`);
            const prompt = getGeminiPrompt(chunkText, mentionId, municipalityName);
            const generationConfig = { responseMimeType: "application/json" };
            const result = await modelInstance.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig
            });
            const rawResponseText = result.response.text();
            console.log(`    -> [Chunk ${chunkIndex + 1}/${totalChunks}] Resposta recebida (Chave #${currentKeyIndex + 1}).`);
            const jsonString = extractJsonFromString(rawResponseText);
            if (jsonString) {
                try {
                    const chunkAnalysis = JSON.parse(jsonString);
                    return {
                        total_gasto_oncologico: parseFloat(chunkAnalysis.total_gasto_oncologico) || 0,
                        medicamentos: parseFloat(chunkAnalysis.medicamentos) || 0,
                        equipamentos: parseFloat(chunkAnalysis.equipamentos) || 0,
                        estadia_paciente: parseFloat(chunkAnalysis.estadia_paciente) || 0,
                        obras_infraestrutura: parseFloat(chunkAnalysis.obras_infraestrutura) || 0,
                        servicos_saude: parseFloat(chunkAnalysis.servicos_saude) || 0,
                        outros_relacionados: parseFloat(chunkAnalysis.outros_relacionados) || 0,
                        detalhes_extraidos: Array.isArray(chunkAnalysis.detalhes_extraidos) ? chunkAnalysis.detalhes_extraidos : []
                    };
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
                console.warn(`    -> 🚦 Rate limit atingido na Chave #${currentKeyIndex + 1} (Chunk ${chunkIndex + 1}/${totalChunks}).`);
                if (keysRotatedThisChunk >= apiKeys.length - 1) {
                    console.error(`    -> ❌ FALHA TOTAL: Todas as ${apiKeys.length} chaves de API estão em rate limit. Abortando o script.`);
                    throw new Error("ALL_KEYS_RATE_LIMITED"); 
                } else {
                    switchToNextKey();
                    keysRotatedThisChunk++;
                }
            } else {
                console.error(`    -> ❌ ERRO FATAL no chunk ${chunkIndex + 1}/${totalChunks} (ID ${mentionId}):`, error.message);
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
    console.error(`    -> ❌ Excedido retries para chunk ${chunkIndex + 1}/${totalChunks} (ID ${mentionId}).`);
    return null;
}


async function testTxtLogicLocally() {
    const outputFilePath = path.resolve(__dirname, 'sample_txt_output.json');

    const IDS_PARA_TESTAR = [12269, 12270];
    
    console.log('✅ Iniciando teste local do script TXT-Fallback (v9.1)...');
    console.log(`🎯 Processando ${IDS_PARA_TESTAR.length} menções de teste.`);
    console.log(`💾 Resultados serão salvos em: ${outputFilePath}`);

    try {
        fs.writeFileSync(outputFilePath, '', 'utf8');
    } catch (e) {
        console.error(`❌ Erro ao limpar arquivo de saída: ${e.message}`);
        return;
    }

    let totalProcessadasComSucesso = 0;
    let totalProcessadasComFalha = 0;
    let totalProcessadasComChunking = 0;

    try {
        const mentionsToTest = await db.query(
            `SELECT id, txt_url, excerpt, municipality_name 
             FROM mentions 
             WHERE id = ANY($1::int[])`,
            [IDS_PARA_TESTAR]
        );

        if (mentionsToTest.rows.length === 0) {
            console.warn('⚠️ Nenhuma das menções especificadas foi encontrada no banco de dados.');
            return;
        }

        for (const [index, mention] of mentionsToTest.rows.entries()) {
            console.log(`\n[${index + 1}/${mentionsToTest.rows.length}] Iniciando processamento da menção ID: ${mention.id} (${mention.municipality_name})...`);

            let textToAnalyze = null;
            let sourceUsed = 'unknown';
            let finalAnalysisData = {};
            let finalCalculatedTotal = 0.00;
            let success = false;

            try {
                if (mention.txt_url) {
                    try {
                        console.log(`  -> Baixando TXT de: ${mention.txt_url}`);
                        const response = await axios.get(mention.txt_url, { timeout: 10000 });
                        textToAnalyze = response.data;
                        sourceUsed = 'txt';
                        console.log(`  -> Texto baixado (${textToAnalyze.length} caracteres).`);
                    } catch (txtError) {
                        console.warn(`  -> Aviso: Falha ao baixar .txt (${txtError.message}). Usando excerpt como fallback.`);
                        textToAnalyze = mention.excerpt;
                        sourceUsed = 'excerpt (fallback)';
                    }
                } else {
                    console.log(`  -> .txt URL não disponível. Usando excerpt.`);
                    textToAnalyze = mention.excerpt;
                    sourceUsed = 'excerpt';
                }

                if (!textToAnalyze || textToAnalyze.trim() === '') {
                     finalAnalysisData = { error: 'Fonte de texto (txt/excerpt) estava vazia.', source: sourceUsed, chunked: false };
                     success = false;
                } else {
                    let tokenCount = 0;
                    try {
                        tokenCount = tokenizer.encode(textToAnalyze).length;
                    } catch (encodeError) {
                         finalAnalysisData = { error: `Erro ao tokenizar: ${encodeError.message}`, source: sourceUsed, chunked: false };
                         success = false;
                    }

                    if (!finalAnalysisData.error) {
                        const chunks = splitTextIntoChunksByToken(textToAnalyze, MAX_TOKENS_PARA_PROCESSAR_POR_CHUNK, tokenizer);
                        const isChunked = chunks.length > 1;
                        if (isChunked) totalProcessadasComChunking++;

                        const aggregatedResults = { 
                            total_gasto_oncologico: 0, medicamentos: 0, equipamentos: 0, estadia_paciente: 0,
                            obras_infraestrutura: 0, servicos_saude: 0, outros_relacionados: 0,
                            detalhes_extraidos: [],
                            _meta: {
                                chunks_processed: 0, chunks_failed: 0, approx_tokens: tokenCount,
                                source: sourceUsed, chunked: isChunked, total_chunks: chunks.length
                            }
                        };

                        for (let i = 0; i < chunks.length; i++) {
                            const chunkResult = await processSingleChunk(chunks[i], mention.id, mention.municipality_name, i, chunks.length);
                            if (chunkResult) {
                                aggregatedResults.total_gasto_oncologico += chunkResult.total_gasto_oncologico;
                                aggregatedResults.medicamentos += chunkResult.medicamentos;
                                aggregatedResults.equipamentos += chunkResult.equipamentos;
                                aggregatedResults.estadia_paciente += chunkResult.estadia_paciente;
                                aggregatedResults.obras_infraestrutura += chunkResult.obras_infraestrutura;
                                aggregatedResults.servicos_saude += chunkResult.servicos_saude;
                                aggregatedResults.outros_relacionados += chunkResult.outros_relacionados;
                                aggregatedResults.detalhes_extraidos.push(...chunkResult.detalhes_extraidos);
                                aggregatedResults._meta.chunks_processed++;
                            } else {
                                aggregatedResults._meta.chunks_failed++;
                            }
                            if (isChunked && i < chunks.length - 1) {
                                await delay(DELAY_BETWEEN_CHUNKS);
                            }
                        }

                        if (aggregatedResults._meta.chunks_failed > 0) {
                            finalAnalysisData = { error: `Falha em ${aggregatedResults._meta.chunks_failed} chunks.`, ...aggregatedResults };
                            success = false;
                        } else {
                            finalCalculatedTotal = aggregatedResults.medicamentos + aggregatedResults.equipamentos +
                                                   aggregatedResults.estadia_paciente + aggregatedResults.obras_infraestrutura +
                                                   aggregatedResults.servicos_saude + aggregatedResults.outros_relacionados;
                            finalAnalysisData = { ...aggregatedResults, total_gasto_oncologico: finalCalculatedTotal };
                            success = true;
                        }
                    }
                }

                const jsonLine = JSON.stringify(finalAnalysisData);
                fs.appendFileSync(outputFilePath, jsonLine + '\n', 'utf8');
                
                if(success){
                     console.log(`  -> Sucesso final (fonte: ${sourceUsed}${finalAnalysisData._meta.chunked ? ', chunked' : ''})! Total: R$ ${finalCalculatedTotal.toFixed(2)}`);
                     totalProcessadasComSucesso++;
                } else {
                      console.error(`  -> Falha final no processamento da menção ID ${mention.id} (Razão: ${finalAnalysisData.error || 'Erro desconhecido'}).`);
                      totalProcessadasComFalha++;
                }

            } catch (error) {
                if (error.message === "ALL_KEYS_RATE_LIMITED") { throw error; }
                console.error(`❌ ERRO INESPERADO no loop principal da menção ID ${mention.id}:`, error.message);
                const errorResult = { 
                    mention_id: mention.id, 
                    municipality_name: mention.municipality_name, 
                    error: `Erro inesperado: ${error.message}` 
                };
                fs.appendFileSync(outputFilePath, JSON.stringify(errorResult) + '\n', 'utf8');
                totalProcessadasComFalha++;
            }

            await delay(DELAY_BETWEEN_MENTIONS);
        }

    } catch (error) {
        if (error.message === "ALL_KEYS_RATE_LIMITED") {
            console.error("\n🚫 PROCESSO INTERROMPIDO: Todas as chaves de API atingiram o limite de taxa. Tente novamente mais tarde.");
        } else {
            console.error("\n💥 Falha fatal e inesperada no processo do coletor:", error);
        }
        tokenizer.free();
        process.exit(1);
    } 

    console.log(`\n🎉 Teste local (TXT) finalizado!`);
    console.log(`   - TOTAL de Sucessos: ${totalProcessadasComSucesso}`);
    console.log(`   - TOTAL de Falhas: ${totalProcessadasComFalha}`);
    console.log(`   - TOTAL de Menções com Chunking: ${totalProcessadasComChunking}`);
    console.log(`💾 Resultados completos salvos em: ${outputFilePath}`);

    tokenizer.free();
}

testTxtLogicLocally().catch(error => {
    if (error.message !== "ALL_KEYS_RATE_LIMITED") {
        console.error("\n💥 Falha fatal (catch final):", error);
    }
    tokenizer.free();
    process.exit(1);
});