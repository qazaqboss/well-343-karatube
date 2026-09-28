#!/usr/bin/env bash
# Пересборка презентаций NanoCem UT-9 в PDF. Запуск из корня репозитория:
#   ./tools/make-deck.sh
# Тексты и структура слайдов — в tools/mkdeck.py, оформление — в tools/deck-base.css.
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="$(command -v chromium || command -v google-chrome)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

python3 "$ROOT/tools/mkdeck.py"

render () {   # render <язык> <имя файла>
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=9000 \
    --print-to-pdf="$ROOT/public/$2" "file://$ROOT/tools/_deck-$1.html" 2>/dev/null
  echo "  public/$2"
}
echo "Рендерю PDF:"
render ru   nanocem-ut9-presentation.pdf
render en   nanocem-ut9-presentation-en.pdf
render ru-m nanocem-ut9-presentation-mobile.pdf
echo "Готово."
