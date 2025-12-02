// backend/src/testscripts/test_gemini.js
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/database');
const axios = require('axios');
const pdfParse = require('pdf-parse');
require('dotenv').config();

// --- Caminho do Arquivo de Saída ---
const outputFilePath = path.resolve(__dirname, 'sample_llm_output.json');

// --- Configurações ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Corrigido: Usando gemini-1.5-pro (que sabemos que funciona e tem janela grande)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- Constantes ---
const MAX_RETRIES = 3;
// Mantendo o delay longo para o modelo Pro free tier (~2 RPM)
const DELAY_BETWEEN_REQUESTS = 31000; // 31 segundos

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Prompt (cole seu prompt completo aqui) ---
function getGeminiPrompt(textContent) {
  // Certifique-se de que seu prompt completo esteja aqui
  return `
      **Tarefa:** VOCÊ É UM ANALISTA FINANCEIRO ESPECIALIZADO EM ORÇAMENTO PÚBLICO DE SAÚDE ONCOLÓGICA. Analise CUIDADOSAMENTE o seguinte texto extraído de um Diário Oficial Municipal brasileiro. Seu objetivo é:
      1. Identificar, extrair e somar TODOS os valores monetários (em Reais) que representem gastos ou investimentos DIRETAMENTE relacionados à área de ONCOLOGIA.
      2. Categorizar esses valores somados conforme as regras abaixo.
      3. Extrair informações contextuais RELEVANTES sobre esses gastos oncológicos, se claramente presentes.

      **Formatos de Valor a Procurar (Exemplos):** R$ 1.234,56, Valor: 1.234,56, custo total de 1.234,56, etc.

      **Formato OBRIGATÓRIO da Resposta:**
      Sua resposta deve ser **EXCLUSIVAMENTE um objeto JSON válido**, sem nenhum texto antes ou depois, e sem usar markdown (como \`\`\`json). A estrutura base é MANDATÓRIA, mas campos adicionais podem ser incluídos se relevantes.

      {
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
      3.  **Categorização:** Siga as definições:
          * "medicamentos": Compra/fornecimento de quimioterápicos, imunoterápicos.
          * "equipamentos": Aquisição, aluguel, manutenção de equipamentos oncológicos.
          * "estadia_paciente": Custo de internação, diária de leito oncológico.
          * "obras_infraestrutura": Construção, reforma de instalações oncológicas.
          * "servicos_saude": Contratação de serviços/exames oncológicos (radioterapia, quimioterapia).
          * "outros_relacionados": Gastos oncológicos que não se encaixam acima.
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

// --- Função extractJsonFromString (cole sua função aqui) ---
function extractJsonFromString(text) {
    if (!text) return null;
    // Tenta encontrar o JSON de forma mais robusta, incluindo limpeza de markdown
    const match = text.match(/\{[\s\S]*\}/);
    let potentialJson = null;
    if (match) {
        potentialJson = match[0].trim();
    } else {
        // Se não encontrar '{...}', tenta limpar markdown como último recurso
        potentialJson = text.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    // Tenta parsear o JSON potencial encontrado
    if (potentialJson && potentialJson.startsWith('{') && potentialJson.endsWith('}')) {
       try {
           JSON.parse(potentialJson);
           return potentialJson; // Retorna somente se for JSON válido
       } catch (e) {
           console.warn("   -> Aviso: Texto extraído parecia JSON, mas falhou no parse:", e.message);
       }
    }
    return null; // Não encontrou JSON válido
}


/**
 * Processa o texto COMPLETO de um PDF com a API do Gemini.
 */
async function processPdfWithGemini(textContent, mentionId) {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        console.log(`    -> Enviando texto completo para Gemini (Tentativa ${attempt + 1})...`);
        const prompt = getGeminiPrompt(textContent);

        // Adicionando configuração para garantir saída JSON
        const generationConfig = {
             responseMimeType: "application/json",
        };

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig
        });

        let rawResponseText = '';
        // Tenta extrair o texto da resposta (pode variar um pouco na estrutura)
        try {
            rawResponseText = result.response.text();
        } catch {
             if (result.response && result.response.candidates && result.response.candidates[0].content.parts[0].text) {
                rawResponseText = result.response.candidates[0].content.parts[0].text;
             } else {
                 console.error("   -> Estrutura de resposta inesperada da API Gemini:", JSON.stringify(result.response, null, 2));
                 throw new Error("Formato de resposta inesperado da API.");
             }
        }
        console.log(`    -> Resposta bruta recebida.`);

        const jsonString = extractJsonFromString(rawResponseText);

        if (jsonString) {
          try {
            const analysis = JSON.parse(jsonString);
            // Validação mínima da estrutura esperada
            if (typeof analysis.total_gasto_oncologico === 'number' && Array.isArray(analysis.detalhes_extraidos)) {
                 console.log(`    -> JSON válido extraído e validado.`);
                 return analysis; // Retorna o objeto JSON completo
            } else {
                 console.warn(`    -> Aviso: JSON extraído não possui a estrutura esperada (total_gasto_oncologico ou detalhes_extraidos ausente/inválido).`);
                 return null;
            }
          } catch (parseError) {
            console.error(`    -> ❌ Erro ao analisar JSON (ID ${mentionId}): ${parseError.message}. Resposta bruta: ${rawResponseText}`);
            return null;
          }
        } else {
          console.error(`    -> ❌ Não foi possível extrair JSON da resposta (ID ${mentionId}). Resposta bruta: ${rawResponseText}`);
          return null;
        }

      } catch (error) {
        let isRateLimitError = false;
        // Verifica diferentes formas de erro de Rate Limit
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            isRateLimitError = true;
        } else if (error.message && (error.message.toLowerCase().includes('resource_exhausted') || error.message.toLowerCase().includes('rate limit'))) {
             isRateLimitError = true;
        }

        if (isRateLimitError) {
          attempt++;
          // Aumenta o tempo de espera a cada tentativa
          const waitTimeSeconds = Math.pow(2, attempt) * 5 + Math.random() * 2; // Adiciona jitter
          console.warn(`    -> 🚦 Rate limit (Tentativa ${attempt}/${MAX_RETRIES}). Esperando ${waitTimeSeconds.toFixed(1)}s...`);
          await delay(waitTimeSeconds * 1000);
          // Não retorna null aqui, o loop while vai tentar novamente
        } else {
          // Erro fatal (não é rate limit)
          console.error(`    -> ❌ ERRO FATAL no processamento LLM (ID ${mentionId}):`, error.message);
          if (error.response && error.response.data) {
              console.error('       Detalhes API:', JSON.stringify(error.response.data, null, 2));
          } else if (error.cause) { // Para erros da biblioteca GoogleGenerativeAI
               console.error('       Causa do erro:', error.cause);
          }
          return null; // Falha irrecuperável para esta menção
        }
      }
    } // Fim do while
    console.error(`    -> ❌ Excedido número máximo de retries (${MAX_RETRIES}) para Rate Limit (ID ${mentionId}).`);
    return null; // Falha após retries
}


/**
 * Função Principal de Teste - COMPLETA E CORRIGIDA
 */
async function testGeminiWithPdf() {
  console.log('✅ Iniciando teste com Gemini (1.5 Pro) - Processando IDs específicos...');

  // --- Query SQL para IDs específicos ---
  const mentionsToTest = await db.query(
    `SELECT id, municipality_name, source_url
     FROM mentions
     WHERE id IN (6827, 6936, 6930, 6706, 7349)` // IDs específicos
  );

  if (mentionsToTest.rows.length === 0) {
    console.log('Nenhuma das menções especificadas foi encontrada para testar.');
    return;
  }

  console.log(`ℹ️  Encontradas ${mentionsToTest.rows.length} menções. Processando PDFs e salvando em ${path.basename(outputFilePath)}`);

  // --- Limpa/Cria o arquivo de saída ---
  try {
      fs.writeFileSync(outputFilePath, '', 'utf8');
      console.log(`   -> Arquivo de saída ${path.basename(outputFilePath)} limpo/criado.`);
  } catch (initError) {
      console.error(`❌ ERRO CRÍTICO ao inicializar arquivo de saída: ${initError.message}. Abortando.`);
      return;
  }
  // --- FIM DA LIMPEZA ---

  const allResults = []; // Para o resumo final no console
  let successCount = 0;
  let failureCount = 0;

  for (const [index, mention] of mentionsToTest.rows.entries()) {

    console.log(`\n--- [${index + 1}/${mentionsToTest.rows.length}] Processando Menção ID: ${mention.id} (${mention.municipality_name}) ---`);
    let pdfText = '';
    let finalJsonResult = {};
    let analysisResult = null; // Guarda o resultado da LLM

    // --- Verificação Robusta da URL ---
    const urlParaBaixar = mention.source_url ? mention.source_url.trim() : null;
    console.log(`   Verificando URL: "${urlParaBaixar}" (Tipo: ${typeof urlParaBaixar})`);

    if (!urlParaBaixar || urlParaBaixar === '') {
        console.warn(`  -> Aviso: source_url está NULO ou VAZIO para Menção ID ${mention.id}. Pulando.`);
        finalJsonResult = { mention_id: mention.id, municipality_name: mention.municipality_name, error: "Source URL nula ou vazia." };
        // failureCount será incrementado no bloco de salvar
    } else {
        // --- FIM DA VERIFICAÇÃO ---

        // 1. Baixar e Parsear o PDF
        try {
          console.log(`  -> Baixando PDF de: ${urlParaBaixar}`);
          const response = await axios.get(urlParaBaixar, { responseType: 'arraybuffer' });
          const pdfBuffer = response.data;
          console.log(`  -> PDF baixado. Extraindo texto...`);
          const data = await pdfParse(pdfBuffer);
          pdfText = data.text;
          console.log(`  -> Texto extraído (${pdfText.length} caracteres).`);
        } catch (error) {
          console.error(`❌ Erro ao baixar ou parsear PDF para menção ID ${mention.id}:`, error.message);
          finalJsonResult = { mention_id: mention.id, municipality_name: mention.municipality_name, error: `Erro download/parse PDF: ${error.message}` };
          pdfText = null; // Garante que não prossiga
        }

        // Pula análise LLM se o texto for vazio ou se houve erro no passo anterior
        if (!pdfText || pdfText.trim() === '') {
            if (!finalJsonResult.error) { // Só loga/marca se não houve erro de download/parse
                console.warn(`  -> Aviso: Texto extraído do PDF está vazio para Menção ID ${mention.id}. Pulando análise LLM.`);
                finalJsonResult = { mention_id: mention.id, municipality_name: mention.municipality_name, error: "Texto extraído do PDF estava vazio." };
            }
        } else {
            // 2. Processamento com LLM (Só executa se pdfText for válido)
            analysisResult = await processPdfWithGemini(pdfText, mention.id);

            // 3. Monta o JSON Final
            if (analysisResult && typeof analysisResult === 'object' && analysisResult !== null && typeof analysisResult.total_gasto_oncologico === 'number') {
              finalJsonResult = {
                mention_id: mention.id,
                municipality_name: mention.municipality_name,
                ...analysisResult,
                _meta: { source: "pdf", approx_total_chars: pdfText.length }
              };
              // successCount será incrementado no bloco de salvar
            } else {
              finalJsonResult = {
                mention_id: mention.id,
                municipality_name: mention.municipality_name,
                error: "Falha no processamento da LLM ou resultado inválido/malformado.",
                raw_llm_response: analysisResult, // Inclui a resposta bruta se possível
                _meta: { source: "pdf", approx_total_chars: pdfText.length }
              };
              // failureCount será incrementado no bloco de salvar
            }
        }
    } // Fim do 'else' da verificação da URL

    // --- Salva no Arquivo (SEMPRE tenta salvar) ---
    try {
        const jsonLine = JSON.stringify(finalJsonResult);
        fs.appendFileSync(outputFilePath, jsonLine + '\n', 'utf8');
        allResults.push(finalJsonResult); // Guarda na memória para o resumo

        // Loga e conta sucesso/falha APÓS salvar com sucesso
        if (!finalJsonResult.error && typeof finalJsonResult.total_gasto_oncologico === 'number') {
             console.log(`  -> SUCESSO! Total: R$ ${finalJsonResult.total_gasto_oncologico.toFixed(2)}. Salvo em ${path.basename(outputFilePath)}`);
             successCount++; // Conta sucesso AQUI
        } else {
             // Garante que tenha uma mensagem de erro se não for sucesso
             if (!finalJsonResult.error) {
                 finalJsonResult.error = "Resultado da LLM não continha 'total_gasto_oncologico' numérico após salvamento.";
             }
             console.error(`  -> FALHA no processamento da menção ID ${mention.id}. Erro: ${finalJsonResult.error}. Salvo em ${path.basename(outputFilePath)}.`);
             failureCount++; // Conta falha AQUI
        }
    } catch (writeError) {
        console.error(`❌ ERRO CRÍTICO AO TENTAR SALVAR resultado para menção ID ${mention.id} no arquivo:`, writeError.message);
        // Se falhou ao salvar, garante que seja contado como falha e registra o erro
        if (!finalJsonResult.error) failureCount++;
        finalJsonResult.error = `Erro crítico ao salvar no arquivo: ${writeError.message}`;
        allResults.push(finalJsonResult);
    }
    // --- FIM DO SALVAMENTO ---

    await delay(DELAY_BETWEEN_REQUESTS); // Pausa entre menções
  } // Fim do loop FOR

  console.log('\n🎉 Teste finalizado!');
  console.log('--- Resumo dos Resultados (também salvos no arquivo) ---');
  console.log(`   - Total de menções processadas (ou tentadas): ${allResults.length}`);
  // Usamos os contadores que foram incrementados corretamente
  console.log(`   - Sucessos: ${successCount}`);
  console.log(`   - Falhas: ${failureCount}`);
  console.log(`   - Resultados completos salvos em: ${outputFilePath}`);
}

testGeminiWithPdf().catch(console.error); // Chama a função principal