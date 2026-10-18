#!/usr/bin/env bash
# Запуск контейнера: два процесса в одном сервисе.
#
#   Next.js  — на $PORT, отдаёт витрину Subsoil и кабинет /app
#   FastAPI  — на 127.0.0.1:8080, отдаёт AI-помощника и ERP
#
# Next проксирует на FastAPI пути /ai, /erp и /stage-reports (см. next.config.ts),
# поэтому снаружи это по-прежнему один сайт.
#
# Переменная PORT предназначена Next. Python читает ту же переменную, поэтому
# для него её снимаем и задаём порт явно — иначе оба процесса займут один порт.
set -euo pipefail

PORT="${PORT:-3000}"
API_PORT=8080

echo "→ FastAPI (AI и ERP) на 127.0.0.1:${API_PORT}"
env -u PORT python3 server/subsoil_ai.py --web --port "${API_PORT}" &
API_PID=$!

# Сборки фронтенда может не быть: например, если сервис собран не по Dockerfile,
# а старым способом, где Node вообще не участвует. Тогда отдаём хотя бы прежний
# сайт, а не пустую страницу, — но говорим об этом в логе во весь голос.
if [ ! -d apps/web/.next ]; then
  echo "✗✗✗ apps/web/.next не найден: фронтенд Subsoil не собран." >&2
  echo "✗✗✗ Сервис поднят в прежнем виде, Python отдаёт старый сайт на \$PORT." >&2
  echo "✗✗✗ Проверьте, что Railway собирает сервис по корневому Dockerfile." >&2
  kill -TERM "${API_PID}" 2>/dev/null || true
  wait "${API_PID}" 2>/dev/null || true
  exec python3 server/subsoil_ai.py --web --port "${PORT}"
fi

echo "→ Next.js (витрина и кабинет) на 0.0.0.0:${PORT}"
node apps/web/node_modules/next/dist/bin/next start apps/web --port "${PORT}" --hostname 0.0.0.0 &
WEB_PID=$!

# Если падает любой из двух — валим контейнер целиком: Railway перезапустит.
# Молча работающий сайт без ERP или без витрины хуже честного перезапуска.
shutdown() {
  echo "→ остановка"
  kill -TERM "${API_PID}" "${WEB_PID}" 2>/dev/null || true
  wait "${API_PID}" "${WEB_PID}" 2>/dev/null || true
  exit 0
}
trap shutdown TERM INT

wait -n "${API_PID}" "${WEB_PID}"
echo "✗ один из процессов завершился — останавливаю контейнер" >&2
kill -TERM "${API_PID}" "${WEB_PID}" 2>/dev/null || true
exit 1
