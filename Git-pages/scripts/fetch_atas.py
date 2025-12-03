import os
import requests
import re # NOVO: Importa a biblioteca de expressões regulares
from datetime import date

# Configurações
REPO = "unb-mds/2025-2-OncoMap"
BRANCH = "main"
FOLDER = "ATA DE REUNIÕES"
OUTPUT_DIR = "content/atas"
TOKEN = ""

os.makedirs(OUTPUT_DIR, exist_ok=True)
headers = {"Authorization": f"token {TOKEN}"} if TOKEN else {}

url = f"https://api.github.com/repos/{REPO}/contents/{FOLDER}?ref={BRANCH}"
response = requests.get(url, headers=headers)
files = response.json()

if not isinstance(files, list):
    print(f"Erro ao buscar arquivos: {files.get('message', 'Resposta inesperada da API')}")
    exit()

for f in files:
    if f["name"].endswith(".md"):
        original_filename = f["name"]
        download_url = f["download_url"]

        # NOVO: Extrai o número do nome do arquivo original (ex: "Sprint 1.md" -> "1")
        match = re.search(r'\d+', original_filename)
        if not match:
            print(f"Aviso: Não foi possível encontrar um número no arquivo '{original_filename}'. Pulando.")
            continue
        
        sprint_number = match.group(0)
        
        # NOVO: Cria o nome padronizado para o arquivo e para a referência
        ata_ref = f"ata_sprint_{sprint_number}"
        new_filename = f"{ata_ref}.md"

        content = requests.get(download_url, headers=headers).text
        today = date.today().isoformat()
        
        # MUDANÇA: Usa a nova referência no front matter
        front_matter = f"""---
title: "Ata da {original_filename.replace('.md', '')}"
date: {today}
sprint: "{ata_ref}"
type: "ata"
---

"""
        # MUDANÇA: Salva o arquivo com o novo nome padronizado
        with open(os.path.join(OUTPUT_DIR, new_filename), "w", encoding="utf-8") as out_file:
            out_file.write(front_matter + content)

print(f"✅ Todas as atas foram baixadas para {OUTPUT_DIR} com nomes padronizados!")