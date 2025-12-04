---
title: "Requisitos Naofuncionais"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Requisitos 

---

## Entendendo o domínio do problema

Para ocorrer o levantamento dos requisitos é necessário que aconteça, antes, um aprofundamento no que consiste o projeto. O querido diário é uma gigante fonte de dados integrada sobre os diários oficiais municipais brasileiros, o que facilita bastante muita coisa, pois, junta a grande quantidade de municípios e sites governamentais, e além disso, junta a grande variedade de formatos desses diários, já que não exite uma regulamentação para uma padronização. 

---

O problema a ser resolvido consite na análise dos investimentos em saúde oncológica nos municípios, para isso é necessário uma organização e padronização para extração dos dados necessários da fonte de dados do "Querido diário". 

---

A análise será em volta de todos os gastos com licitações e contratações do município que tenham ligação direta com a saúde oncológica.

**Detalhamento da análise**

O investimento em saúde oncológica, para o nosso projeto, pode ser segmentado da seguinte forma:

1. **Licitações para Aquisição de Bens e Serviços**:

* **Medicamentos**: Gastos com medicamentos quimioterápicos, imunoterápicos e outros fármacos usados no tratamento do câncer.
* **Equipamentos**: Licitações para compra de equipamentos médicos, como aparelhos de radioterapia, ressonância magnética ou mamógrafos.
* **Materiais de Consumo**: Compra de seringas, sondas e outros materiais hospitalares específicos para pacientes oncológicos.

2. **Contratos de Serviços de Saúde**:

* **Clínicas e Hospitais**: Contratos com instituições privadas para a realização de consultas, exames ou procedimentos de alta complexidade.
* **Profissionais**: Contratação de médicos oncologistas, enfermeiros, fisioterapeutas e outros profissionais especializados para atuar na rede pública.

3. **Investimento em Infraestrutura**:

* **Obras**: Licitações e contratos para construção, reforma ou expansão de unidades de saúde especializadas em oncologia.

--- 

## Levantamento de Requisitos Não Funcionais (RNF)

Os Requisitos Não Funcionais são essenciais para garantir que a aplicação seja confiável, eficiente e útil para os usuários. Para o projeto, os principais RNF estão focados na qualidade, desempenho e usabilidade. Dividindo os RNF em tópicos, teremos:

1. **Requisitos de Usabilidade**

A interface do usuário deve ser intuitiva e de fácil navegação para qualquer pessoa, independentemente de sua familiaridade com dados públicos. O sistema deve permitir que o usuário:

* **Realize buscas de forma simples**, com opções de filtro claras para município, tipo de investimento e período.
* **Visualize os resultados de forma clara**, como em tabelas, gráficos ou mapas, facilitando a interpretação dos dados.
* **Exporte os relatórios** e dados extraídos em formatos comuns, como CSV ou PDF.

2. **Requisitos de Desempenho**

Devido ao grande volume de diários oficiais e à quantidade de informações a serem processadas, o desempenho do sistema é crítico para uma boa experiência do usuário. O sistema deve:

* **Realizar buscas rapidamente**, retornando os resultados em um tempo aceitável (por exemplo, em menos de 5 segundos).
* **Processar e exibir os dados de forma eficiente**, sem travar ou ter lentidão, mesmo ao lidar com múltiplos filtros aplicados simultaneamente.

3. **Requisitos de Confiabilidade**

A confiabilidade garante que os dados extraídos são precisos e consistentes. Uma vez que a base de dados é heterogênea e não padronizada, este requisito é fundamental. O sistema deve:

* **Garantir que a extração dos dados** das licitações e contratos seja precisa, evitando erros na leitura de valores financeiros e de datas.
* **Manter a integridade dos dados**, assegurando que as informações sobre medicamentos, equipamentos, obras, e outros itens estejam corretas e sejam consistentes com os diários oficiais.

4. **Requisitos de Escalabilidade**

A plataforma Querido Diário está em constante expansão e o volume de dados só tende a crescer. Por isso, a arquitetura do sistema precisa ser capaz de lidar com esse aumento. O sistema deve:

* **Permitir a inclusão de novos diários** oficiais sem a necessidade de grandes mudanças estruturais.
* **Suportar um aumento** no número de usuários simultâneos e no volume de buscas.
