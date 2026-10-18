# 00. Перенос: nanocem.app → Subsoil

Цель: на домене `nanocem.app` открывается Subsoil; OilField Interact с Railway становится модулем внутри него; старые ссылки продолжают работать.

## 1. Целевая схема

```
nanocem.app            → web (Next.js): витрина + /app кабинет
api.nanocem.app        → api (NestJS, бывший OilField Interact)
ofiapi-production.up.railway.app → остаётся как технический адрес api, потом закрыть
```

Всё в одном Railway-проекте **subsoil**: сервисы `web`, `api`, `worker`, `postgres`, `redis` (подробно — `10-railway-deploy.md`).

## 2. Шаги

1. **Заморозить контент** текущего nanocem.app: выгрузить все страницы и данные (фонд, обводнённость, герметичность, программа, этапы, ERP) в репозиторий как исходные JSON/CSV — они станут сидами БД.
2. **Создать Railway-проект `subsoil`** и перенести в него сервис OilField Interact:
   - либо *Move service* в новый проект,
   - либо новый сервис из того же GitHub-репозитория + перенос БД (`pg_dump` → `pg_restore`).
3. **Переименовать** в коде: `OilField Interact` → модуль «Промысел», бренд в шапке → `Subsoil`. Строку «IC Petroleum» вынести в настройки компании (`companies.name`), а не держать в вёрстке.
4. **Добавить сервис `web`** (Next.js) — витрина + кабинет.
5. **Подключить домены** в Railway: `nanocem.app` → `web`, `api.nanocem.app` → `api`. Обновить DNS у регистратора.
6. **Настроить 301-редиректы** (таблица ниже) в `next.config.ts`.
7. **Закрыть публичный доступ** к живым данным: всё, что было открыто на nanocem.app без логина, теперь только в `/app`.
8. **Проверка**: каждая старая ссылка → 301 → новая страница; вход по логину; сводка показывает данные.

## 3. Редиректы старых страниц

| Старый URL | Новый URL | Доступ |
|---|---|---|
| `/index.html` | `/` | публично |
| `/product.html` | `/products/nanocem-ut9` | публично |
| `/stages.html` | `/solutions/subsoil-stages` | публично (без данных клиента) |
| `/water-cut.html` | `/app/field/water-cut` | логин |
| `/sealing.html` | `/app/nanocem/sealing` | логин |
| `/plan.html` | `/app/nanocem/program` | логин |
| `/erp/` | `/app/subsoil` | логин |
| `/erp/#contracts` | `/app/subsoil/contracts` | логин |
| `/erp/#wells` | `/app/field/wells` | логин |
| `/erp/#deadlines` | `/app/subsoil/obligations?status=overdue` | логин |
| `/erp/#calendar` | `/app/subsoil/calendar` | логин |
| `/erp/#reports` | `/app/reports` | логин |
| `/ai` | `/app/ai` | логин |

Пример для `next.config.ts`:

```ts
async redirects() {
  return [
    { source: '/index.html', destination: '/', permanent: true },
    { source: '/product.html', destination: '/products/nanocem-ut9', permanent: true },
    { source: '/stages.html', destination: '/solutions/subsoil-stages', permanent: true },
    { source: '/water-cut.html', destination: '/app/field/water-cut', permanent: true },
    { source: '/sealing.html', destination: '/app/nanocem/sealing', permanent: true },
    { source: '/plan.html', destination: '/app/nanocem/program', permanent: true },
    { source: '/erp', destination: '/app/subsoil', permanent: true },
    { source: '/ai', destination: '/app/ai', permanent: true },
  ];
}
```

Якоря `#contracts` и т. п. сервер не видит — их обрабатывает клиентский скрипт на `/app/subsoil`: читает `location.hash` и переходит на нужную вкладку.

## 4. Риски

- **Данные на старом сайте уже проиндексированы.** После переноса запросить удаление старых URL в Google Search Console и Яндекс.Вебмастере.
- **Разные пароли/пользователи** у OFI и нового кабинета — делать единую таблицу `users` (OFI уже её имеет — расширить, а не создавать новую).
- **Простой при смене DNS** — переключать домен вечером, TTL заранее снизить до 300 с.
