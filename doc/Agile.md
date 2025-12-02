# 5. Documentação de Projeto e Gestão Ágil - OncoMap

Este documento detalha a metodologia de trabalho utilizada pela equipe do **OncoMap**, seguindo princípios ágeis (Scrum/Kanban) para garantir a entrega contínua de valor, a transparência do processo e a qualidade do software.

---

## 5.1. Story Map (Mapeamento da Jornada do Usuário)

O Story Map foi a ferramenta principal para visualizar a jornada do usuário e priorizar o desenvolvimento. A estrutura foi dividida em atividades principais (Backbone) e quebrada em tarefas e histórias.
Story Map pode ser visto mais detalhadamente em: [StoryMap](https://www.figma.com/board/8Jsltq8BOL65CsMoRWFjik/Template-MDS--Copy-?node-id=0-1&p=f)

| Atividade (Backbone) | Tarefa do Usuário | Histórias de Usuário (Exemplos) | Prioridade (Release) |
| :--- | :--- | :--- | :--- |
| **Explorar Dados** | Visualizar o Mapa do Brasil | "Como cidadão, quero ver um mapa para identificar visualmente os estados com maior investimento." | MVP |
| | Filtrar por Região/Estado | "Como pesquisador, quero filtrar os dados por UF para analisar contextos locais específicos." | MVP |
| **Analisar Detalhes** | Ver detalhes do Município | "Como gestor público, quero ver o total investido e a quebra por categorias (medicamentos, obras...) de um município." | MVP |
| | Ler o Diário Oficial | "Como jornalista, quero clicar no link do PDF original para verificar a fonte da informação na íntegra." | V1.0 |
| **Exportar e Validar** | Baixar Relatórios | "Como auditor, quero baixar um PDF formatado com análise textual gerada por IA sobre os gastos." | V2.0 |
| | Validar dados extraídos | "Como sistema, quero cruzar dados extraídos de TXT e PDF para garantir a maior acurácia possível." | V2.0 |

---

## 5.2. Estrutura de Requisitos (Épicos → Features → User Stories)

Abaixo, a decomposição do escopo do projeto em níveis de granularidade.

### **Épico 01: Coleta e Processamento de Dados (Backend)**
* **Feature A: Coletor de Diários Oficiais**
    * *US01:* Como desenvolvedor, quero um script que busque diários na API do "Querido Diário" usando palavras-chave oncológicas para popular a base bruta.
    * *Critério de Aceitação:* O script deve rodar sem erros de rede (403), salvar no Supabase e evitar duplicatas usando `ON CONFLICT`.
* **Feature B: Pipeline de Enriquecimento com IA**
    * *US02:* Como analista de dados, quero que o sistema processe PDFs usando o Gemini para extrair valores monetários e categorizar gastos.
    * *Critério de Aceitação:* O JSON de saída deve conter categorias (medicamentos, equipamentos, serviços de saúde, estadia do paciente, obras de infraestrutura e outros relacionados.) e o valor total somado.
### **Épico 02: Visualização e Transparência (Frontend)**
* **Feature C: Dados em tabelas**
    * *US03:* Como usuário, quero visualizar tabelas que mostrem a distribuição dos gastos por categoria em um município selecionado.
* **Feature D: Relatórios Inteligentes**
    * *US04:* Como usuário, quero clicar em um botão "Gerar Relatório" e receber um PDF formatado com textos explicativos gerados pela IA.

---

## 5.3. Rastreabilidade

Para garantir a organização, utilizamos o GitHub como fonte única da verdade (*Single Source of Truth*). A rastreabilidade é mantida através do seguinte fluxo:

1.  **Issues:** Cada User Story é cadastrada como uma *Issue* no GitHub.
2.  **Labels:** Utilizamos labels para categorizar o tipo de trabalho:
    * `backend`, `frontend`
    * `bug`, `feature`, `documentation`
3.  **Pull Requests (PRs):** Todo PR deve ser explicitamente linkado a uma Issue.
    * *Exemplo:* No corpo do PR, utilizamos a keyword "Closes #12" para fechar automaticamente a Issue correspondente.
4.  **Commits:** Mensagens de commit seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/), facilitando a leitura do histórico e geração de changelogs.
    * `feat: adiciona script de chunking para textos longos`
    * `fix: corrige erro de rate limit na API do Gemini`
    * `docs: atualiza README com instruções de teste`

---

## 5.4. Documentação das Sprints

O projeto foi dividido em Sprints (ciclos de trabalho), com as seguintes cerimônias e artefatos gerados:

### 🔄 Ritos Ágeis
* **Sprint Planning:** Realizada no início de cada ciclo para definir o *Backlog da Sprint*. A equipe estimava a complexidade técnica das tarefas (ex: configurar Docker vs. criar script de teste).
* **Daily/Check-points:** Comunicação assíncrona e reuniões rápidas para alinhar o progresso:
    * "O que fiz ontem (Implementei o Coletor)"
    * "O que farei hoje (Integração com Gemini)"
    * "Impedimentos (Rate limit em API do gemini)"
* **Sprint Review & Retrospectiva:** Ao fim de grandes entregas (ex: finalização do Backend), o grupo analisava o que funcionou e o que precisava melhorar.
    * *Lição Aprendida:* "O uso de `pdf-parse` local foi muito superior ao uso do texto pré-processado da API externa."
    * *Melhoria:* "Precisamos dividir a carga de trabalho entre múltiplas chaves de API para evitar gargalos."

---

## 5.5. 📊 Métricas Analisadas (Engineering Metrics)

Como a gestão das tarefas foi realizada de forma simplificada, o time focou em métricas de engenharia e fluxo de código extraídas diretamente do repositório para medir a produtividade e a qualidade.

#### 1. Cobertura de Testes (Code Coverage)
Esta foi a principal métrica de qualidade técnica (KPI) do projeto. O objetivo era garantir que a lógica crítica do backend estivesse protegida contra regressões.
* **Ferramenta:** Jest.
* **Meta Inicial:** > 90% nos Controllers e Utils.
* **Resultado Final:**
    * `regionMap.js`: **100%**
    * `statsController.js`: **100%**
    * `reportController.js`: **~86%**
    * **Média Geral (Backend Core):** **>90%**

#### 2. Vazão de Entregas (Throughput via PRs)
Medimos a produtividade do time através da quantidade de *Pull Requests* (PRs) integrados à branch `main` por Sprint/Semana.
* **Padrão observado:** Sprints iniciais focaram em poucos PRs grandes (Setup). Sprints finais tiveram alto volume de PRs menores e mais focados (Correções e Ajustes de IA), indicando uma melhoria na quebra de tarefas.
* **Total de PRs Merged:** [Inserir Número Total de PRs fechados no projeto]

#### 3. Distribuição de Commits (Frequency)
Acompanhamos a frequência de commits ("Pulse") na aba *Insights* do GitHub para garantir que o trabalho fosse contínuo e não acumulado apenas nas vésperas das entregas.
* **Pico de Atividade:** [Mês/Semana de maior trabalho, ex: Setembro/2025].
* **Colaboração:** O gráfico de contribuidores demonstrou a atuação ativa de [3] membros no backend e [3] no frontend.

---

## 5.6. Políticas de Branch (Git Flow Adaptado)

Adotamos uma estratégia baseada em **Feature Branch Workflow** para manter a estabilidade da branch principal.

* **`main`**: Código em produção. Deve estar sempre estável, testado e pronto para deploy.
* **`develop` (ou `dev`)**: Branch de integração. Onde as funcionalidades se encontram para testes conjuntos antes de ir para a main.
* **`feature/*`**: Branches temporárias criadas a partir da `dev` para cada nova funcionalidade.
    * Exemplo: `feature/implementar-pdf-parse`, `feature/criar-rotas-stats`.
* **`fix/*`**: Branches para correção de bugs urgentes ou não.
    * Exemplo: `fix/erro-403-github-actions`, `fix/ajuste-porta-docker`.

**Regra de Proteção:** Nenhum commit é feito diretamente na `main`. Todo código deve passar por um Pull Request (PR), passar pelos testes automatizados (CI) e ser revisado por pelo menos um outro membro do grupo.

---

## 5.7. Checklist de Pull Request (PR)

Para garantir a qualidade do código integrado, todo PR deve seguir estritamente o template abaixo antes de ser aceito (Merge).

```markdown
## 📌 Descrição
Descreva brevemente o que foi feito neste PR. Seja claro e conciso.

## 🔗 Issue Relacionada
Relacione esta PR com a issue que ela resolve ou à qual se refere.
Closes # [Número da Issue]

## ✅ Tipo de Mudança
Selecione o tipo de mudança que esta PR introduz. Marque com um 'x' dentro dos colchetes, como `[x]`.

* [ ] **Correção de bug** (Uma mudança que corrige um problema)
* [ ] **Nova funcionalidade** (Uma mudança que adiciona novas funcionalidades)
* [ ] **Refatoração** (Uma mudança no código que não corrige um bug nem adiciona funcionalidade)
* [ ] **Documentação** (Uma mudança que afeta apenas a documentação)

## 🔍 Checklist
Verifique os itens abaixo antes de finalizar a PR. Marque com um 'x' dentro dos colchetes, como `[x]`.

* [ ] **Testes criados/atualizados**
* [ ] **Documentação atualizada** (se necessário)
* [ ] **PR revisada e pronta para merge**

## 📝 Notas Adicionais (Opcional)
Se houver passos específicos para testar ou revisar esta PR, detalhe-os aqui (ex: como reproduzir o bug corrigido, quais rotas testar, configurações necessárias, etc.).
