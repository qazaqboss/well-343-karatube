#!/usr/bin/env bash
# Пересборка отчёта о расходе NanoCem UT-9 в PDF. Запуск из корня репозитория:
#   ./tools/make-report.sh
# Содержимое и оформление — в tools/mkreport.py; статусы берутся из public/wells.js.
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="$(command -v chromium || command -v google-chrome)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 "$ROOT/tools/mkreport.py"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=9000 \
  --print-to-pdf="$ROOT/public/nanocem-ut9-report.pdf" "file://$ROOT/tools/_report.html" 2>/dev/null
echo "  public/nanocem-ut9-report.pdf"
