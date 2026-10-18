# 06. API

База: `https://api.nanocem.app/v1`. Авторизация — JWT (как в OFI). Все ответы фильтруются по доступу пользователя (`07-roles-access.md`).

Существующие эндпоинты OFI (`/auth`, `/entries`, `/measurements`, `/commands`, `/summary`, `/sync` …) сохраняются под префиксом `/v1/field/*`; на время перехода старые пути проксируются.

## 1. Сводка холдинга

| Метод | Путь | Что отдаёт |
|---|---|---|
| GET | `/holding/summary?scope=holding\|company\|field&id=&date=` | KPI-карточки, «внимание сегодня», таблица активов |
| GET | `/holding/production?scope=&id=&from=&to=&metric=oil\|liquid\|water_cut` | ряд по дням + план |
| GET | `/holding/requirements?scope=&id=&days=30` | обязательства + отчёты, по сроку |
| GET | `/holding/alerts?status=open` | активные алерты |
| GET | `/holding/snapshots/:date` | снимок на 06:00 |

Пример ответа `/holding/summary`:

```json
{
  "asOf": "2026-10-18T06:00:00+05:00",
  "kpi": {
    "oilTDay":    { "value": 124.6, "deltaDay": 3.1, "planPct": 96 },
    "liquidM3Day":{ "value": 1380,  "deltaDay": -12 },
    "waterCutPct":{ "value": 90.2,  "deltaDayPp": 0.4 },
    "fund":       { "working": 46, "total": 52, "stopped": 6 },
    "requirements": { "overdue": 2, "next30d": 9 }
  },
  "attention": [
    { "level": "critical", "code": "obligation_overdue", "text": "2 обязательства просрочены", "link": "/app/subsoil/obligations?status=overdue" }
  ],
  "assets": [
    { "companyId": "…", "fieldId": "…", "name": "Каратюбе J1-IV", "oil": 18.4, "deltaDay": 1.2,
      "waterCut": 91.0, "fund": "8/8", "planPct": 102, "requirementsStatus": "ok", "nextDue": "2026-10-25", "status": "ok" }
  ]
}
```

## 2. Недропользование

| Метод | Путь |
|---|---|
| GET/POST | `/subsoil/contracts` |
| GET/PATCH | `/subsoil/contracts/:id` |
| GET/POST | `/subsoil/obligations?contractId=&status=&from=&to=` |
| PATCH | `/subsoil/obligations/:id` (статус, ответственный, документ) |
| GET | `/subsoil/reporting-rules` |
| GET | `/subsoil/reporting-events?from=&to=` |
| POST | `/subsoil/reporting-events/:id/submit` |
| GET | `/subsoil/calendar?month=2026-10` |

## 3. NanoCem UT-9

| Метод | Путь |
|---|---|
| GET | `/nanocem/overview?scope=&id=` |
| GET/POST | `/nanocem/jobs` |
| GET/PATCH | `/nanocem/jobs/:id` |
| GET | `/nanocem/candidates?fieldId=` (со скорингом) |
| GET | `/nanocem/sealing?fieldId=` |

## 4. Отчёты, документы, AI

| Метод | Путь |
|---|---|
| POST | `/reports` `{ type, scope, period }` → `{ jobId }` |
| GET | `/reports/:jobId` → статус и ссылка на файл |
| POST | `/documents` (multipart) |
| POST | `/ai/chat` `{ messages }` — потоковый ответ (SSE) |

## 5. Реальное время

WebSocket `wss://api.nanocem.app/ws`, каналы:
- `holding:<scopeId>` — обновление KPI и алертов;
- `field:<fieldId>` — новые записи и команды (как в OFI).
