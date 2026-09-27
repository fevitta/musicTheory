#!/bin/sh
# Marca uma nova versão do site (rode antes de publicar). Atualiza versao.js e versao.json com a data e hora (UTC),
# para que quem estiver com o app aberto veja o aviso "Nova versão disponível".
set -e
cd "$(dirname "$0")/.."
V=$(date -u +%Y.%m.%d.%H%M)
sed -i.bak "s/const VERSION='[^']*'/const VERSION='$V'/" versao.js && rm -f versao.js.bak
printf '{"version":"%s"}\n' "$V" > versao.json
echo "Versão $V"
