---
title: "Linux"
date: 2025-12-02
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---



# Linux e Ubuntu

Linux é um sistema operacional de código aberto baseado no kernel Linux. Ele é amplamente usado em servidores, dispositivos móveis (como o Android) e também em desktops. Sua principal característica é a estabilidade, segurança e flexibilidade.

O **Ubuntu** é uma das distribuições Linux mais populares, sendo amigável para iniciantes e muito utilizada em ambientes de desenvolvimento. Ele é baseado no Debian e conta com suporte da Canonical, oferecendo atualizações regulares e uma vasta comunidade.

---

## 1. Instalando o Ubuntu

Existem várias formas de instalar o Ubuntu:

1. **Máquina física** – usando um pendrive bootável.
2. **Máquina virtual** – usando softwares como VirtualBox ou VMware.
3. **WSL (Windows Subsystem for Linux)** – instalar Ubuntu dentro do Windows.

Para criar um pendrive bootável, você pode usar:

* **Rufus (Windows)**
* **Etcher (Linux/Windows/Mac)**

Após a instalação, ao inicializar, você verá a interface gráfica (GNOME) ou poderá trabalhar direto no **terminal**.

---

## 2. Estrutura de diretórios do Linux

Diferente do Windows, que organiza arquivos em "C:", "D:", etc., no Linux tudo está dentro de `/`. Alguns diretórios importantes:

* `/home` → pasta pessoal dos usuários.
* `/etc` → arquivos de configuração do sistema.
* `/bin` e `/sbin` → programas essenciais.
* `/usr` → programas e bibliotecas de usuários.
* `/var` → arquivos variáveis (logs, cache, etc.).
* `/tmp` → arquivos temporários.

---

## 3. Principais comandos do Ubuntu

O terminal é essencial no Linux. Alguns comandos básicos:

### Navegação no sistema de arquivos

```bash
pwd          # mostra o diretório atual
ls           # lista arquivos e pastas
ls -la       # lista detalhada (inclui arquivos ocultos)
cd pasta     # entra em uma pasta
cd ..        # volta um diretório
```

### Manipulação de arquivos e pastas

```bash
mkdir nome_pasta      # cria uma pasta
rmdir nome_pasta      # remove pasta vazia
rm -r nome_pasta      # remove pasta e conteúdo
touch arquivo.txt     # cria um arquivo vazio
cp origem destino     # copia arquivos/pastas
mv origem destino     # move ou renomeia arquivos
rm arquivo.txt        # apaga arquivo
```

### Usuários e permissões

```bash
whoami                # mostra usuário atual
sudo comando          # executa comando como administrador
chmod 755 arquivo     # altera permissões
chown usuario arquivo # muda o dono de um arquivo
```

### Processos e sistema

```bash
ps aux                # lista processos em execução
kill -9 PID           # encerra um processo
top                   # mostra consumo de recursos em tempo real
htop                  # versão melhorada do top (instalar: sudo apt install htop)
```

---

## 4. Gerenciamento de pacotes no Ubuntu

O Ubuntu utiliza o **APT (Advanced Package Tool)** para instalar e gerenciar softwares.

### Comandos básicos do apt

```bash
sudo apt update                     # atualiza lista de pacotes
sudo apt upgrade                    # atualiza pacotes instalados
sudo apt install nome_do_pacote     # instala um programa
sudo apt remove nome_do_pacote      # remove um programa
sudo apt autoremove                 # remove pacotes desnecessários
```

Exemplo:

```bash
sudo apt install curl
```

---

## 5. Arquivos importantes de configuração

* `.bashrc` – configurações do terminal (atalhos, variáveis de ambiente).
* `/etc/hosts` – mapeamento de IPs e nomes de host.
* `/etc/passwd` – informações dos usuários.
* `/etc/fstab` – montagem automática de discos.

---

## 6. Usando o Ubuntu para desenvolvimento

O Ubuntu é muito usado em ambientes de programação. Alguns pacotes úteis:

```bash
sudo apt install git
sudo apt install build-essential   # compiladores e ferramentas C/C++
sudo apt install python3 python3-pip
sudo apt install nodejs npm
sudo apt install docker.io
```

---

## 7. Comandos úteis do dia a dia

```bash
clear              # limpa a tela
history            # mostra histórico de comandos
man comando        # mostra manual de um comando
echo "texto"       # imprime texto no terminal
cat arquivo.txt    # mostra conteúdo de um arquivo
grep palavra arquivo.txt   # procura palavra em arquivo
find / -name "nome"        # busca arquivo por nome
```

---

## 8. Links úteis

* [Documentação oficial Ubuntu](https://ubuntu.com/tutorials)
* [Cheat sheet de comandos Linux](https://www.guru99.com/linux-commands-cheat-sheet.html)
* [Curso Linux Fundamentos - Guia Foca](https://www.guiafoca.org/)
* [Link vídeo de instalação do ubuntu](https://www.youtube.com/watch?v=QrsDuBwgF9Y&t=590s)


---

