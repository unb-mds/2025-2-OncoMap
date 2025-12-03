import os
import requests

REPO = "unb-mds/2025-2-OncoMap"
OUTPUT_DIR = "content/sprints"
TOKEN = ""

os.makedirs(OUTPUT_DIR, exist_ok=True)
headers = {"Authorization": f"token {TOKEN}"} if TOKEN else {}

url = f"https://api.github.com/repos/{REPO}/milestones?state=all"
milestones = requests.get(url, headers=headers).json()

# O loop começa aqui
for m in milestones:
    # Tudo abaixo está DENTRO do loop
    title = m["title"]
    sprint_number = m["number"] # Renomeado para clareza
    desc = m["description"] or ""
    due_on = m["due_on"] or "2025-12-31"
    filename = f"{OUTPUT_DIR}/sprint-{sprint_number}.md"

    # NOVO: Calcula o número da ata correspondente (sprint_number - 1)
    ata_number = sprint_number - 1

    url_issues = f"https://api.github.com/repos/{REPO}/issues?milestone={sprint_number}&state=all"
    issues = requests.get(url_issues, headers=headers).json()
    subtitulo_limpo = desc.replace("\"", "\\\"").replace("\n", " ").replace("\r", " ")

    # O 'with open' DEVE estar DENTRO do loop 'for'
    with open(filename, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write(f"title: \"{title}\"\n")
        f.write(f"date: {due_on}\n")
        
        # 2. Adiciona a descrição como o 'subtitulo' no Front Matter
        f.write(f"subtitulo: \"{subtitulo_limpo}\"\n")
        
        if ata_number >= 0:
            ata_ref = f"ata_sprint_{ata_number}"
            f.write(f'ata: "{ata_ref}"\n')
            
        f.write("draft: false\n")
        f.write("---\n\n")
        
        # 3. NÃO escreve mais a descrição no corpo.
        #    (A linha "f.write(f"## Descrição\n{desc}\n\n")" foi removida)
        
        f.write("## Issues\n") # Começa direto com as Issues
        for issue in issues:
            f.write(f"- [{issue['number']} - {issue['title']}](/issues/issue-{issue['number']}/)\n")

# Este print fica FORA do loop
print(f"{len(milestones)} sprints salvas em {OUTPUT_DIR}")