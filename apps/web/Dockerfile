# Сборка сервиса web (витрина Subsoil + кабинет) для Railway.
#
# Не подключён ни к одному сервису: текущий nanocem.app собирается корневым
# Dockerfile и отдаёт старый статический сайт. Переключение домена — отдельное
# решение, см. subsoil/00-migration.md.
#
# Сборка из корня репозитория:
#   docker build -f apps/web/Dockerfile -t subsoil-web .

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# ── зависимости ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile

# ── сборка ──────────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY . .
# Источник данных кабинета задаётся на сборке: это публичная переменная Next.
ARG NEXT_PUBLIC_API_MODE=local
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_MODE=$NEXT_PUBLIC_API_MODE
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm --filter @subsoil/web build

# ── запуск ──────────────────────────────────────────────────────────────────
FROM base AS run
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["pnpm", "--filter", "@subsoil/web", "start", "--port", "3000", "--hostname", "0.0.0.0"]
