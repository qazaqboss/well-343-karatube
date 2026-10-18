# 10. Развёртывание на Railway

## 1. Проект `subsoil`

| Сервис | Что | Источник | Домен |
|---|---|---|---|
| `web` | Next.js: витрина + кабинет | репозиторий, `apps/web` | `nanocem.app`, `www.nanocem.app` |
| `api` | NestJS (бывший OFI) | репозиторий, `apps/api` | `api.nanocem.app` (+ старый `ofiapi-production.up.railway.app` на переходный период) |
| `worker` | BullMQ: отчёты, алерты, снимки 06:00, рассылка 07:00 | `apps/worker` | — |
| `postgres` | Railway PostgreSQL | плагин | приватная сеть |
| `redis` | Railway Redis | плагин | приватная сеть |

Сервисы общаются по приватной сети Railway (`*.railway.internal`), наружу открыты только `web` и `api`.

## 2. Перенос OFI в проект

Вариант А — сервис переносится в новый проект средствами Railway (если доступно в вашем тарифе).
Вариант Б — надёжный:
1. В проекте `subsoil` создать `postgres`.
2. `pg_dump` из старой БД OFI → `pg_restore` в новую.
3. Создать сервис `api` из того же GitHub-репозитория, root `apps/api`.
4. Переменные окружения скопировать, `DATABASE_URL` указать на новую БД.
5. Проверить, затем перевести старый адрес на новый сервис или оставить редирект.

## 3. Переменные окружения

`api` / `worker`:
```env
DATABASE_URL=${{postgres.DATABASE_URL}}
REDIS_URL=${{redis.REDIS_URL}}
JWT_PRIVATE_KEY=...
JWT_PUBLIC_KEY=...
S3_ENDPOINT=...
S3_BUCKET=subsoil-files
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
TELEGRAM_BOT_TOKEN=...
OPENAI_API_KEY=...            # или ключ другого провайдера для AI-помощника
DEFAULT_TZ=Asia/Aqtobe
CORS_ORIGINS=https://nanocem.app,https://www.nanocem.app
```

`web`:
```env
NEXT_PUBLIC_API_URL=https://api.nanocem.app/v1
NEXT_PUBLIC_WS_URL=wss://api.nanocem.app/ws
```

## 4. Домены и DNS

1. В Railway: сервис `web` → Settings → Networking → Custom Domain → `nanocem.app` и `www.nanocem.app`; сервис `api` → `api.nanocem.app`.
2. Railway покажет DNS-записи — внести у регистратора/в Cloudflare.
3. Для корневого домена `nanocem.app` нужен CNAME-flattening/ALIAS (есть в Cloudflare). Если регистратор не умеет — перенести DNS в Cloudflare.
4. За сутки до переключения снизить TTL до 300 с.
5. `.app` требует HTTPS — Railway выпускает сертификат сам, проверить, что он выдан, до переключения.

## 5. Где сейчас живёт старый nanocem.app

`TODO:` уточнить хостинг текущего статического сайта. После переключения DNS он перестаёт открываться по домену — сохранить копию файлов в репозиторий (`legacy/nanocem-static/`) для сидов и сверки.

## 6. Расписание (worker)

| Время (Asia/Aqtobe) | Задача |
|---|---|
| каждые 5 мин | пересчёт алертов промысла |
| каждый час | статусы обязательств и отчётов |
| 06:00 | снимок сводки `daily_snapshots` |
| 07:00 | утренняя рассылка руководству |
| 02:00 | резервная копия БД |
