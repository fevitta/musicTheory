# Campo Harmônico no Piano

Guia interativo de teoria musical para piano, em uma única página estática (HTML + CSS + JS, sem build).

## O que tem

- **Escalas e tipos:** 12 tônicas; Maior, Menor, Menor harmônica, Menor melódica e os modos gregos (Dórico, Frígio, Lídio, Mixolídio, Lócrio).
- **Teclado:** acorde com dedilhado (ME/MD) e inversões; escala em 1 ou 2 oitavas; pentatônicas, blues e cromática.
- **Campo harmônico:** tríades ou tétrades, com graus coloridos pela função (tônica, subdominante, dominante).
- **Mapa de funções:** sobe (subdominante), repousa (tônica), cai (dominante) — clique nos acordes para montar um caminho.
- **Progressões mais comuns:** tocadas em bloco ou arpejo, com baixo na mão esquerda e condução de vozes na direita.

O som é gerado no navegador (Web Audio API). No iPhone/iPad, desative o modo silencioso para ouvir.

## Rodar localmente

Abra `index.html` no navegador, ou sirva a pasta:

```bash
npx serve .
```

## Deploy

Site estático: na Vercel, importe o repositório com o preset **Other**, sem comando de build e com a raiz como diretório de saída.
