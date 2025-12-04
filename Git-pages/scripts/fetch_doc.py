import os
import requests
from datetime import date

# --- Configurações ---
REPO = "unb-mds/2025-2-OncoMap"
TOKEN = ""  # Seu Token de Acesso Pessoal (se necessário)
DOCS_PATH = "doc"  # Caminho da pasta 'doc' no repositório (ajustado)
OUTPUT_DIR = "content/doc"  # Onde os arquivos serão salvos na estrutura Hugo

# Apenas arquivos Markdown
ALLOWED_EXTENSIONS = ['.md', '.markdown']

os.makedirs(OUTPUT_DIR, exist_ok=True)
headers = {"Authorization": f"token {TOKEN}"} if TOKEN else {}
today = date.today().isoformat()
total_files_saved = 0

# --- Funções Auxiliares ---

def get_title_from_filename(filename):
    """
    Remove a extensão e formata o nome do arquivo para um título legível.
    Ex: 'documento-inicial.md' -> 'Documento Inicial'
    """
    base = os.path.splitext(filename)[0]
    return base.replace('-', ' ').replace('_', ' ').title()

def fetch_and_save_docs(path):
    """
    Busca recursivamente o conteúdo do caminho no repositório e salva os arquivos.
    """
    global total_files_saved
    
    url = f"https://api.github.com/repos/{REPO}/contents/{path}"
    print(f"Buscando conteúdo em: {url}")
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"❌ Erro ao buscar {path}: {response.status_code}. Verifique se o caminho ou TOKEN estão corretos.")
        return

    contents = response.json()

    for item in contents:
        # 1️⃣ Lidar com Diretórios (Recursão)
        if item["type"] == "dir":
            # Cria a pasta de saída correspondente
            # Remove o prefixo 'doc/' para que o caminho comece a partir de 'content/doc/'
            relative_sub_path = item["path"].replace(DOCS_PATH + '/', '', 1)
            new_output_dir = os.path.join(OUTPUT_DIR, relative_sub_path)
            os.makedirs(new_output_dir, exist_ok=True)
            
            # Chama a função para o subdiretório
            fetch_and_save_docs(item["path"])

        # 2️⃣ Lidar com Arquivos
        elif item["type"] == "file":
            _, ext = os.path.splitext(item["name"])

            if ext.lower() in ALLOWED_EXTENSIONS:
                download_url = item["download_url"]
                
                # Define o caminho de saída
                relative_path = item["path"].replace(DOCS_PATH + '/', '', 1)
                output_filepath = os.path.join(OUTPUT_DIR, relative_path)

                # Busca o conteúdo RAW do arquivo
                file_content_response = requests.get(download_url, headers=headers)
                
                if file_content_response.status_code == 200:
                    try:
                        # Conteúdo do arquivo
                        markdown_content = file_content_response.text
                        
                        # 3️⃣ INJEÇÃO DE FRONT MATTER (Lógica similar ao script de issues)
                        title = get_title_from_filename(item["name"])
                        
                        front_matter = f"""---
title: "{title}"
date: {today}
# type: "documentacao" # Opcional: defina um tipo de conteúdo específico para Hugo
draft: false
---
"""
                        # Combina o front matter com o conteúdo do arquivo
                        final_content = front_matter + "\n" + markdown_content

                        # Salva o conteúdo final no destino
                        with open(output_filepath, "w", encoding="utf-8") as f:
                            f.write(final_content)
                            
                        print(f"  ✔️ Salvo e formatado: {output_filepath}")
                        total_files_saved += 1
                        
                    except Exception as e:
                        print(f"  ❌ Falha ao salvar ou processar {output_filepath}: {e}")
                else:
                    print(f"  ❌ Erro ao baixar conteúdo de {item['name']}: {file_content_response.status_code}")

# --- Execução principal ---
print("Iniciando o download dos arquivos da pasta 'doc'...")
fetch_and_save_docs(DOCS_PATH)

print(f"\n✅ Concluído! {total_files_saved} arquivos de documentação salvos em {OUTPUT_DIR}")