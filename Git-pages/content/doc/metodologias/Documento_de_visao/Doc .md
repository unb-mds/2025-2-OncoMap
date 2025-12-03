---
title: "Doc "
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

1. Introdução

Objetivo: Apresentar o projeto de forma clara, objetiva e concisa.

O que incluir

Tema: Uma frase curta que define o assunto do projeto.
Ex.: “Sistema de gerenciamento de tarefas acadêmicas.”

Objetivo do projeto:

Geral: declaração sucinta do propósito.

Específicos: lista de metas mensuráveis (ex.: permitir cadastro de usuários; gerar relatórios semanais).

Delimitação do problema (escopo):

Dentro do projeto: funcionalidades principais que serão entregues.

Fora do projeto: explicitamente o que não será contemplado nesta fase.

Justificativa: Motivação acadêmica ou prática (por que este projeto é relevante? impacto esperado?).

Método de trabalho: Processo de desenvolvimento (ex.: Ágil - Scrum, RUP, Kanban), linguagens, framework(s), ferramentas de modelagem.

Organização do documento: Breve descrição dos capítulos e anexos deste documento.

Glossário: Indicação de onde estão os termos importantes (ver seção Glossário
).

2. Descrição geral do sistema

Visão de alto nível: contexto, público-alvo e regras de negócio.

Pontos essenciais

Descrição do problema: Quem é afetado? Qual o impacto atual? Qual solução proposta?
Ex.: Estudantes perdem prazos; proposta: sistema com notificações e painel de prazos.

Principais envolvidos:

Usuários: tipos e características (ex.: Administrador — gerencia usuários; Aluno — cria e acompanha tarefas).

Desenvolvedores/Stakeholders: PO (Product Owner), Desenvolvedores, Testadores, Analistas.

Regras de negócio:

Restrições (ex.: somente docentes aprovados podem publicar provas).

Volumes esperados (nº de usuários simultâneos).

Tolerância a falhas, SLAs (ex.: disponibilidade 99,9%).

3. Requisitos do sistema

Requisitos são a base do projeto — escreva de forma clara para facilitar implementação e testes.

3.1 Requisitos funcionais

Liste as funções que o sistema deve executar. Recomenda-se padronizar cada item.

Template de requisito funcional (use uma tabela ou seção por requisito):

RF-001 — Nome do Caso de Uso
- Descrição: Breve resumo do que faz.
- Atores: [Ex.: Aluno, Administrador]
- Pré-condições: [o que precisa existir]
- Fluxo principal: 
  1. Ação A
  2. Ação B
- Pós-condições: [estado do sistema após conclusão]
- Exceções / Fluxos alternativos: [erros, caminhos secundários]
- Observações: [regras especiais, restrições]

3.2 Requisitos não-funcionais

Segurança: exemplo — autenticação via OAuth 2.0; criptografia de dados sensíveis.

Desempenho: latência máxima aceitável (ex.: resposta API ≤ 200 ms).

Disponibilidade: ex.: 99,9% uptime.

Escalabilidade: tipo de dimensionamento esperado.

Usabilidade: métricas (ex.: tarefa X deve ser completada em ≤ 3 passos).

Portabilidade: navegadores/plataformas suportadas.

Para cada RNF, especifique métrica/valor (ex.: latência ≤ 200 ms; disponibilidade 99,9%).

3.3 Protótipo / Interface

Protótipos de telas com objetivo de cada tela, navegação e regras de validação.

Formato sugerido: imagens ou links (Figma/Adobe XD) + descrição de cada componente.

Regras de validação e restrições de campo (ex.: senha mínimo 8 caracteres; formatos de data).

3.4 Métricas e cronograma

Estimativas: pontos de função / story points / horas por tarefa.

Cronograma: usar tabela ou diagrama (Gantt). Exemplo de tabela resumida:

Tarefa	Responsável	Início	Fim	Esforço (dias)
Levantamento de requisitos	PO/Analista	2025-09-01	2025-09-07	5
Protótipos	UX	2025-09-08	2025-09-14	5
Implementação Módulo A	Dev	2025-09-15	2025-09-30	12
4. Análise e design

Transformar requisitos em solução técnica documentada.

4.1 Arquitetura do sistema

Topologia (ex.: 3-tiers, microservices).

Componentes: front-end, API, banco de dados, mensageria.

Hardware mínimo e configuração de rede (se aplicável).

4.2 Modelo de domínio

Diagrama conceitual / diagrama de classes inicial: entidades, atributos e relacionamentos.

4.3 Diagramas de interação

Diagrama de sequência: validação de comportamentos ao longo do tempo.

Diagrama de colaboração/comunicação: links entre objetos e mensagens.

4.4 Diagrama de classes (final)

Todas as classes detalhadas com atributos e métodos. Relações: associação, agregação, herança etc.

4.5 Diagrama de atividades

Fluxos de trabalho, decisões, concorrência e sincronização (útil para processos complexos).

4.6 Diagrama de estados

Para entidades com ciclos de vida complexos (ex.: pedido — criado → pago → enviado → entregue).

4.7 Diagrama de componentes

Organização física dos componentes de software e dependências entre eles.

4.8 Modelo de dados

Modelo lógico (ER) com normalização.

Criação física: scripts SQL, índices e constraints.

Dicionário de dados: tabela com nome, coluna, tipo, descrição, restrições e valores padrão.

Exemplo de dicionário (resumo):

Tabela	Coluna	Tipo	Descrição	Restrições
usuario	id	UUID	Identificador do usuário	PK, not null
usuario	email	varchar(255)	E-mail do usuário	unique, not null
4.9 Ambiente de desenvolvimento

Linguagens, frameworks, SGBD, IDEs, ferramentas CI/CD, versão mínima das dependências.

4.10 Sistemas e componentes externos

Integrações com APIs externas, serviços de pagamento, bibliotecas terceiras e contratos de API.

5. Implementação

Boas práticas e mapeamento do design para código.

Recomendações

Cabeçalhos claros: em funções (descrição, autor, data).

Nomes padronizados: convenção clara (camelCase / snake_case).

Comentários úteis: explicar por que, não somente o que.

Tratamento de erros: centralizado e com logs.

Padrões de projeto: usar quando apropriado (Factory, Repository, Adapter).

Encapsulamento de dados: usar repositórios ou DAO.

Revisões de código: PRs, code review checklist.

Integração contínua: pipeline com lint, testes e builds.

6. Testes

Plano para validar que o produto atende aos requisitos.

6.1 Plano de testes (mínimo)

Para cada teste inclua:

Nº do teste: TEST-001

Descrição: o que se testa

Pré-condições: ambiente, dados iniciais

Passos: passos claros e reproduzíveis

Resultado esperado: critérios objetivos

Critério de aceitação: aprovado/reprovado

Tipos de teste

Unitários

Integração

Sistema

Usabilidade

Performance (carga / stress / volume)

Segurança

Instalação / Implantação

6.2 Execução do plano

Registro dos resultados com: nº do teste, resultado obtido, executor, ambiente, comentários e evidências (prints, logs).

Manter um repositório de evidências (ex.: pasta /evidences/tests/).

7. Implantação

Como levar o sistema para produção.

Itens essenciais

Diagrama de implantação: servidores, containers, balanceadores.

Manual de instalação passo a passo: pré-requisitos, scripts, configuração, variáveis de ambiente.

Procedimentos de rollback: passos claros para reverter versão (script de rollback + checagens).

Plano de contingência: como agir em caso de falhas críticas.

8. Manual do usuário

Guia prático para usuários finais com instruções passo a passo.

Conteúdo sugerido:

Introdução ao sistema

Requisitos do sistema (hardware / software)

Tela principal e descrição das funcionalidades

Fluxos comuns (ex.: cadastrar tarefa, gerar relatório)

Resolução de problemas comuns (FAQ)

Contatos de suporte / SLA de atendimento

Use imagens/prints e pequenos vídeos quando for útil.

9. Conclusões e considerações finais

Resultado esperado do projeto.

Limitações identificadas.

Melhorias e trabalhos futuros sugeridos.

Avaliação do atendimento aos objetivos iniciais (checklist de sucesso).

10. Referências

Drive com material de apoio:

https://drive.google.com/drive/folders/1GMGh38wmcre1ksEaF_D3QHBz4T-eze9X

Vídeo de referência:

https://www.youtube.com/watch?v=l9rdjLqmIVc
