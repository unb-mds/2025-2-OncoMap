---
title: "Git E Github"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---

# Git e GitHub

Git é um sistema de controle de versão distribuído amplamente utilizado no desenvolvimento de software. Ele permite rastrear e gerenciar mudanças em projetos, armazenar o histórico de alterações, facilitar o trabalho em equipe e garantir maior segurança ao código.

GitHub é uma plataforma de hospedagem de código-fonte que utiliza o Git como base. Funciona como um espaço na nuvem para armazenar repositórios, possibilitando acessar e compartilhar projetos facilmente. No GitHub, você pode usar diversos recursos que tornam o desenvolvimento colaborativo mais eficiente, como:

* **Pull requests** – para revisão e integração de mudanças de forma organizada.
* **Issues** – para rastreamento de tarefas, bugs e novas funcionalidades.
* **Gerenciamento de branches** – permitindo que times trabalhem em paralelo sem afetar o código principal.

## 1. Como configurar o Git

### 1. Baixando o Git
  
  Para utilizar o Git, primeiro é preciso baixá-lo.
  
  * **Windows**: acesse o [site oficial](https://git-scm.com/download/win) e siga o instalador.
  * **Linux**: abra o terminal e digite o comando:
    ```bash
    sudo apt install git       # Para Debian/Ubuntu
    sudo yum install git       # Para Fedora/CentOS
    ```
  
  Após a instalação, confirme usando o comando:
  
  ```bash
  git --version
  ```
  
  ### 2. Configurando seu Git
  
  Depois de instalar, é necessário configurar seu nome e email (eles aparecerão nos commits). No terminal, digite:
  
  ```bash
  git config --global user.name "Seu Nome"
  git config --global user.email "seu@email.com"
  ```
  Substitua `"Seu Nome"` e `"seu@email.com"` pelas suas informações.
  
  Pronto! Seu Git está configurado.

## 2. Criando e clonando um repositório
  
  ### 1. Criando o repositório
  
  Para iniciar um projeto, crie uma pasta para ele e inicialize um repositório Git:
  
  ```bash
  mkdir nome_do_projeto
  cd nome_do_projeto
  git init
  ```
  
  ### 2. Clonando um repositório
  
  Para clonar um repositório existente, use:
  
  ```bash
  git clone https://github.com/usuario/repositorio.git
  ```
  Troque `https://github.com/usuario/repositorio.git` pelo link do projeto desejado.

## 3. Trabalhando com arquivos
  
  ### 1. Preparando o arquivo
  
  Após trabalhar em um projeto, é comum querer salvar as alterações. Para isso, prepare o arquivo para ser salvo no repositório:
  
  ```bash
  git add nome_do_arquivo
  ```
  Se quiser adicionar todos os arquivos modificados, use:
  
  ```bash
  git add .
  ```
  
  ### 2. Fazendo o commit (salvando mudanças)
  
  Depois de adicionar os arquivos, faça o commit (salve as alterações):
  
  ```bash
  git commit -m "Mensagem explicando as mudanças"
  ```
  Dica: sempre coloque uma mensagem clara e objetiva que explique o que mudou no commit.
  
  ### 3. Extras
  
  * Verifique o status dos arquivos:
  
    ```bash
    git status
    ```
  
  * Veja o histórico de commits:
  
    ```bash
    git log
    ```
  
  * Sincronize seu repositório local com o remoto:
  
  ```bash
  git pull
  git push
  ```

## 4. Como criar/mudar uma Branch

  Uma branch (ramo) no Git é, de forma simples, uma linha de desenvolvimento independente dentro do seu repositório. Usar Branches permite:
    
  * Desenvolver novas funcionalidades sem quebrar a versão estável do projeto.
  * Facilita o trabalho em equipe: cada pessoa pode trabalhar em sua própria branch.
  * Depois, quando a funcionalidade estiver pronta e testada, você pode mesclar (merge) a branch de volta à main.
  
  ### Criando uma Brench
  
  Para inicair uma Brench use o comando:
  
  ```bash
  git checkout -b minha-branch
  ```
  
  ou caso a brench já existir, use:
  
  ```bash
  git checkout nome-da-branch
  ```
  após terminar de fazer as alterações e estiver pronto, junta a `nome-da-branch` na `main`
  
  ```bash
  git checkout main
  git merge feature-login
  ```

## 5. Descartando/desfazendo alterações na brench
  
  ### 1. Descartar alterações não adicionadas ao staging (`git add`)
  
  Se você modificou um arquivo mas não deu `git add`:
  
  ```bash
  git restore nome_arquivo
  ```
  
  para descartar todos os arquivos:
  
  ```bash
  git restore .
  ```
  
  ### 2. Tirar arquivos do staging (`git add` já feito)
  
  Se você já usou `git add`, mas ainda não fez commit:
  
  ```bash
  git reset nome_arquivo
  ```
  
  ou para todo:
  
  ```bash
  git reset
  ```
  
  ### 3. Desfazer commits
  
  Se voce já tiver feito o commit e quiser defazer mas mantendo os arquivos modificado:
  
  ```bash
  git reset --soft HEAD~1
  ```
  
  Removendo todas as alterações:
  
  ```bash
  git reset --hard HEAD~1
  ```

# Links Uteis

https://persistent-dormouse-23f.notion.site/Resumo-Git-e-Github-3d0e8a96af1a49c58e1b56b9a0f808a5

https://comandosgit.github.io/

https://www.datacamp.com/pt/blog/git-commands
