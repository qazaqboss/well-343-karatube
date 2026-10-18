# Один сервис Railway отдаёт весь сайт:
#   Next.js — витрина Subsoil и кабинет /app
#   FastAPI — AI-помощник /ai и ERP /erp (прежний сервис, сохранён как есть)
#
# Next проксирует /ai, /erp и /stage-reports на FastAPI внутри контейнера,
# поэтому снаружи адреса не меняются и старые ссылки продолжают работать.

# ── сборка фронтенда ────────────────────────────────────────────────────────
FROM node:22-slim AS web
RUN corepack enable
WORKDIR /build

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile

COPY apps ./apps
COPY packages ./packages
# Кабинет читает выгрузку фонда из репозитория — отдельный API ему не нужен.
ARG NEXT_PUBLIC_API_MODE=local
ENV NEXT_PUBLIC_API_MODE=$NEXT_PUBLIC_API_MODE
RUN pnpm --filter @subsoil/web build

# ── рабочий образ ───────────────────────────────────────────────────────────
FROM node:22-slim AS run
WORKDIR /app

# Python для FastAPI и юникодный шрифт — без него кириллица в PDF не отрисуется.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Исходники Python-сервиса, база знаний и статика старого сайта:
# PDF-отчёты и баннеры остаются доступными по прежним адресам.
COPY server ./server
COPY vault ./vault
COPY public ./public

# Собранный фронтенд вместе с его node_modules.
COPY --from=web /build/apps/web/.next ./apps/web/.next
COPY --from=web /build/apps/web/public ./apps/web/public
COPY --from=web /build/apps/web/package.json ./apps/web/package.json
COPY --from=web /build/apps/web/next.config.ts ./apps/web/next.config.ts
COPY --from=web /build/apps/web/node_modules ./apps/web/node_modules
COPY --from=web /build/node_modules ./node_modules
COPY --from=web /build/packages ./packages

COPY start.sh ./start.sh
RUN chmod +x start.sh

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["./start.sh"]
