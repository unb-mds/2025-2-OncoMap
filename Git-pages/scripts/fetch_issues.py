import os
import requests
from datetime import date

# Configurações
REPO = "unb-mds/2025-2-OncoMap"
TOKEN = ""  # se privado
OUTPUT_DIR = "content/issues"

os.makedirs(OUTPUT_DIR, exist_ok=True)
headers = {"Authorization": f"token {TOKEN}"} if TOKEN else {}

all_issues = []
page = 1

# 1️⃣ Pegar todas as issues com paginação
while True:
    url = f"https://api.github.com/repos/{REPO}/issues?state=all&per_page=100&page={page}"
    response = requests.get(url, headers=headers)
    issues = response.json()
    if not issues:
        break
    all_issues.extend(issues)
    page += 1

# 2️⃣ Filtrar PRs (não queremos)
all_issues = [i for i in all_issues if "pull_request" not in i]

# 3️⃣ Gerar arquivos .md
for issue in all_issues:
    number = issue["number"]
    title = issue["title"]
    body = issue["body"] or ""
    milestone = issue["milestone"]["title"] if issue.get("milestone") else "Nenhuma"
    today = date.today().isoformat()

    front_matter = f"""---
title: "{title}"
date: {today}
milestone: "{milestone}"
type: "issue"
draft: false
---
"""

    with open(os.path.join(OUTPUT_DIR, f"issue-{number}.md"), "w", encoding="utf-8") as f:
        f.write(front_matter + "\n" + body)

print(f"✅ {len(all_issues)} issues salvas em {OUTPUT_DIR}")