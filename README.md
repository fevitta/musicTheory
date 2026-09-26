# Teoria Musical no Piano

Guias interativos de teoria musical para quem estuda piano. Site estático (HTML + CSS + JS, sem build).

## Páginas

- **`index.html`:** home, com links para cada guia.
- **`campo-harmonico.html`:** Campo Harmônico no Piano.
  - **Escalas e tipos:** 12 tônicas; Maior, Menor, Menor harmônica, Menor melódica e os modos gregos (Dórico, Frígio, Lídio, Mixolídio, Lócrio).
  - **Teclado:** acorde com dedilhado (ME/MD) e inversões; escala em 1 ou 2 oitavas; pentatônicas, blues e cromática.
  - **Campo harmônico:** tríades ou tétrades, com graus coloridos pela função (tônica, subdominante, dominante).
  - **Mapa de funções:** sobe (subdominante), repousa (tônica), cai (dominante). Clique nos acordes para montar um caminho.
  - **Progressões mais comuns:** tocadas em bloco ou arpejo, com baixo na mão esquerda e condução de vozes na direita.

Em breve: descobrir o tom e transpor, treino de ouvido, tocar e conferir (piano via MIDI).

## Arquivos compartilhados

- **`style.css`:** cores (claro/escuro), tipografia e controles comuns. Toda página nova deve incluí-lo.
- **`theme.js`:** seletor de tema Auto/Claro/Escuro. Inclua no `<head>` (sem `defer`) e coloque `<div class="seg theme" id="theme"></div>` onde o seletor deve aparecer.

O som é gerado no navegador (Web Audio API). No iPhone/iPad, desative o modo silencioso para ouvir.

## Rodar localmente

Sirva a pasta (abrir o arquivo direto também funciona na maioria dos navegadores):

```bash
npx serve .
```

## Deploy

Site estático: GitHub Pages (Settings → Pages → branch `master`, pasta raiz) ou Vercel (preset **Other**, sem comando de build, raiz como diretório de saída).
