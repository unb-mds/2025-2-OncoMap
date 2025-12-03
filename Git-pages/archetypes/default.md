---
date: '{{ .Date }}'
draft: false
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
subtitulo: '{{ replace .File.ContentBaseName "-" " " | subtitulo }}'
---
