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

  - Aceita `?tonic=G&mode=maior` na URL para abrir direto em um tom.
- **`descobrir-tom.html`:** Descobrir o Tom e Transpor.
  - Lê acordes soltos ou a cifra inteira com letra (só as linhas de acordes são lidas).
  - Tonalidade provável, com alternativas, armadura de clave e tom relativo.
  - Função de cada acorde, incluindo dominantes secundárias, empréstimo modal e diminutos de passagem.
  - Transposição para qualquer tom, mantendo os acordes alinhados sobre a letra.
- **`leitura-partitura.html`:** Leitura de Partitura.
  - Exercícios: nota no teclado, nomear a nota, escrever na pauta, ditado (ouvir e achar), intervalos, acordes (tríades do campo) e sequência (melodia de 6 notas, sem parar).
  - Clave de Sol, de Fá ou pauta dupla; tom e escala (Maior, Menor, Menor harmônica, Menor melódica), com armadura de clave; na pauta ou com linhas suplementares; notas cromáticas opcionais.
  - Rodada fixa (30 notas ou 15 intervalos/acordes) ou contra o relógio (60 s, com recorde salvo no navegador).
  - Errou, tenta de novo; depois de 3 erros a resposta é marcada. As notas erradas ficam salvas para o botão "Revisar as que errei".
  - Responde pelo teclado da tela ou por piano MIDI.
- **`ritmo.html`:** Ritmo e Figuras.
  - Tocar o ritmo: o metrônomo conta um compasso e você toca no botão, na barra de espaço ou no piano MIDI; mostra cada nota no tempo, quase ou perdida, e se você tende a adiantar ou atrasar.
  - Ouvir e escolher: ouça o ritmo e escolha entre quatro partituras.
  - Valores das figuras: quantos tempos vale, qual o nome e qual figura completa o compasso; tabela de figuras e pausas.
  - Compasso 2/4, 3/4 ou 4/4; três níveis (até semínima, colcheias, semicolcheias e pontuadas); andamento ajustável.
- **`primeira-vista.html`:** Leitura à Primeira Vista.
  - Melodias geradas na hora (2 ou 4 compassos), com notas da escala e ritmo, começando e terminando na tônica.
  - Modo “Esperar por mim” (espera a nota certa, sem relógio) ou “No tempo” (contagem, metrônomo e conferência de altura e tempo de cada nota).
  - Clave de Sol ou Fá; tom maior ou menor; 5 notas, uma oitava ou a pauta toda; três níveis de ritmo; 2/4, 3/4 ou 4/4; andamento ajustável.
- **`treino-ouvido.html`:** Treino de Ouvido.
  - Intervalos (subindo, descendo ou juntos) e tipos de acorde (tríades e tétrades, com inversões), com comparação depois da resposta.
  - Graus da escala: a cadência define o tom, a nota toca e depois resolve na tônica.
  - Progressões: quatro acordes no tom para identificar os graus.
  - Ditado melódico: ouça de 3 a 6 notas e toque de volta no teclado ou no piano MIDI.

Em breve: tocar e conferir (escalas e acordes pelo piano via MIDI).

## Arquivos compartilhados

- **`style.css`:** cores (claro/escuro), tipografia e controles comuns (chips, botões, etiquetas de função). Toda página nova deve incluí-lo.
- **`music.js`:** nomes e grafia de notas, áudio (Web Audio, com clique de metrônomo), teclado em SVG (simples e tocável) e piano MIDI, expostos em `window.Music`.
- **`theme.js`:** seletor de tema Auto/Claro/Escuro. Inclua no `<head>` (sem `defer`) e coloque `<div class="seg theme" id="theme"></div>` onde o seletor deve aparecer.

O som é gerado no navegador (Web Audio API). No iPhone/iPad, desative o modo silencioso para ouvir.

## Rodar localmente

Sirva a pasta (abrir o arquivo direto também funciona na maioria dos navegadores):

```bash
npx serve .
```

## Deploy

Site estático: GitHub Pages (Settings → Pages → branch `master`, pasta raiz) ou Vercel (preset **Other**, sem comando de build, raiz como diretório de saída).
