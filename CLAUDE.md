# Teoria Musical no Piano

Site estático (HTML + CSS + JS, sem build). Veja o README para as páginas e os arquivos compartilhados.

## Ao publicar

- Antes de cada commit que vai para `master`, rode `scripts/nova-versao.sh`: ele atualiza `versao.js` e `versao.json`, e quem estiver com o app aberto recebe o aviso “Nova versão disponível”.
- Arquivo novo do site (página, script, estilo): inclua em `FILES`, dentro de `versao.js`, para ele ser renovado ao atualizar.
- Página nova: inclua `style.css`, `theme.js`, `versao.js` (com `defer`) e, se tiver treino, `progresso.js` com `Progress.track()` e `Progress.log()`.
