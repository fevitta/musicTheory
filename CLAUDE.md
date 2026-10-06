# Teoria Musical no Piano

Site estático (HTML + CSS + JS, sem build). Veja o README para as páginas e os arquivos compartilhados.

## Ao publicar

- Antes de cada commit que vai para `master`, rode `scripts/nova-versao.sh`: ele atualiza `versao.js` e `versao.json`, e quem estiver com o app aberto recebe o aviso “Nova versão disponível”.
- Arquivo novo do site (página, script, estilo): inclua em `FILES`, dentro de `versao.js`, para ele ser renovado ao atualizar.
- Sorteios de exercício: use `Music.bagFor` (monte: cada item sai uma vez antes de repetir, e o monte continua entre rodadas) ou `Music.fresh` (espaços grandes, como ritmos e melodias), nunca um `Math.random` solto.
- Página nova: inclua `style.css`, `theme.js`, `versao.js` (com `defer`) e, se tiver treino, `progresso.js` com `Progress.track()` e `Progress.log()`.
