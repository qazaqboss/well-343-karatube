# 05. Модель данных (PostgreSQL)

Таблицы OilField Interact (`users`, `fields`, `wells`, `entries`, `measurements`, `regimes`, `commands`, `audit_log` и др.) сохраняются. Ниже — что **добавляется** для холдинга и как связывается.

## 1. Схема связей

```
holdings 1─* companies 1─* fields 1─* wells 1─* measurements
                 │            │          └─* nanocem_jobs
                 │            ├─* production_plans
                 │            └─* contracts 1─* obligations
                 │                        └─* reporting_events
                 └─* user_company_access *─1 users
alert_rules · alerts · daily_snapshots · documents
```

## 2. Новые таблицы

```sql
-- Иерархия холдинга
CREATE TABLE holdings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL
);

CREATE TABLE companies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holding_id  uuid NOT NULL REFERENCES holdings(id),
  name        text NOT NULL,          -- «ТОО «ЭкоМикс»», «IC Petroleum» …
  bin         text,                   -- БИН
  role        text NOT NULL           -- 'subsoil_user' | 'service' | 'supplier'
);

ALTER TABLE fields ADD COLUMN company_id uuid REFERENCES companies(id);
ALTER TABLE fields ADD COLUMN oil_density numeric(5,3);   -- т/м³, для Q нефти

-- План добычи
CREATE TABLE production_plans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id    uuid NOT NULL REFERENCES fields(id),
  month       date NOT NULL,          -- первое число месяца
  oil_t       numeric(12,2) NOT NULL, -- план нефти за месяц, т
  liquid_m3   numeric(12,2),
  UNIQUE (field_id, month)
);

-- Контракты и лицензии
CREATE TABLE contracts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL REFERENCES companies(id),
  field_id      uuid REFERENCES fields(id),
  number        text NOT NULL,        -- напр. 5169-УВС
  kind          text NOT NULL,        -- 'contract' | 'license'
  signed_on     date,
  valid_to      date,
  stage         smallint,             -- 1..7 этап недропользования
  mineral       text                  -- УВС, ТПИ, уран …
);

-- Обязательства
CREATE TABLE obligations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id   uuid NOT NULL REFERENCES contracts(id),
  title         text NOT NULL,
  category      text NOT NULL,        -- 'work_program' | 'local_content' | 'social' | 'training' | 'liquidation_fund' | 'env' | 'other'
  amount        numeric(14,2),
  currency      text DEFAULT 'KZT',
  due_date      date NOT NULL,
  owner_id      uuid REFERENCES users(id),
  status        text NOT NULL DEFAULT 'planned', -- planned | due_soon | overdue | done
  done_at       timestamptz,
  document_id   uuid REFERENCES documents(id)
);

-- Карта отчётности (шаблоны) и конкретные сроки
CREATE TABLE reporting_rules (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  authority     text NOT NULL,        -- орган
  form          text NOT NULL,        -- форма отчёта
  trigger       text NOT NULL,        -- 'daily' | 'monthly' | 'quarterly' | 'annual' | 'event'
  due_rule      text NOT NULL,        -- напр. 'day:25 of next quarter month 1'
  portal        text,
  applies_to    text                  -- фильтр: тип полезного ископаемого / этап
);

CREATE TABLE reporting_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id       uuid NOT NULL REFERENCES reporting_rules(id),
  contract_id   uuid NOT NULL REFERENCES contracts(id),
  period        text NOT NULL,        -- '2026-Q3', '2026-10'
  due_date      date NOT NULL,
  status        text NOT NULL DEFAULT 'planned',
  submitted_at  timestamptz,
  document_id   uuid REFERENCES documents(id)
);

-- Заходы NanoCem UT-9
CREATE TABLE nanocem_jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  well_id       uuid NOT NULL REFERENCES wells(id),
  job_date      date NOT NULL,
  interval_top  numeric(8,2),
  interval_bot  numeric(8,2),
  volume_m3     numeric(8,2),
  scenario      text,
  oil_before    numeric(8,2),         -- средн. 14 сут до, т/сут
  oil_after     numeric(8,2),         -- средн. 14 сут после, т/сут
  result        text                  -- 'success' | 'partial' | 'fail' | 'pending'
);

-- Документы
CREATE TABLE documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL REFERENCES companies(id),
  title         text NOT NULL,
  s3_key        text NOT NULL,
  uploaded_by   uuid REFERENCES users(id),
  uploaded_at   timestamptz DEFAULT now()
);

-- Правила и события «Внимание сегодня»
CREATE TABLE alert_rules (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code      text UNIQUE NOT NULL,     -- 'obligation_overdue', 'water_jump' …
  level     text NOT NULL,            -- 'critical' | 'warning'
  params    jsonb NOT NULL            -- пороги: {"pp": 5}
);

CREATE TABLE alerts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id     uuid NOT NULL REFERENCES alert_rules(id),
  company_id  uuid NOT NULL REFERENCES companies(id),
  object_type text NOT NULL,          -- 'well' | 'obligation' | 'contract' | 'command'
  object_id   uuid NOT NULL,
  message     text NOT NULL,
  created_at  timestamptz DEFAULT now(),
  closed_at   timestamptz
);

-- Утренние снимки сводки
CREATE TABLE daily_snapshots (
  day         date NOT NULL,
  scope_type  text NOT NULL,          -- 'holding' | 'company' | 'field'
  scope_id    uuid NOT NULL,
  data        jsonb NOT NULL,         -- KPI на 06:00
  PRIMARY KEY (day, scope_type, scope_id)
);

-- Доступ
CREATE TABLE user_company_access (
  user_id     uuid REFERENCES users(id),
  company_id  uuid REFERENCES companies(id),
  field_ids   uuid[],                 -- NULL = все месторождения компании
  PRIMARY KEY (user_id, company_id)
);
```

## 3. Представления для сводки

```sql
-- Последний замер по каждой скважине
CREATE VIEW v_well_last AS
SELECT DISTINCT ON (m.well_id)
  m.well_id, w.field_id, m.measured_at,
  m.q_liquid, m.water_cut,
  m.q_liquid * (1 - m.water_cut/100) * f.oil_density AS q_oil
FROM measurements m
JOIN wells w  ON w.id = m.well_id
JOIN fields f ON f.id = w.field_id
ORDER BY m.well_id, m.measured_at DESC;

-- KPI по месторождению
CREATE VIEW v_field_kpi AS
SELECT field_id,
  SUM(q_oil)    AS oil_t_day,
  SUM(q_liquid) AS liquid_m3_day,
  100 * SUM(q_liquid * water_cut/100) / NULLIF(SUM(q_liquid),0) AS water_cut_pct
FROM v_well_last
GROUP BY field_id;
```

Названия колонок `measurements` (`q_liquid`, `water_cut`, `measured_at`) — сверить с фактической схемой OFI; при расхождении поправить view, а не таблицу.

## 4. Сиды из старого nanocem.app

| Данные со старого сайта | Таблица |
|---|---|
| Фонд скважин, последние замеры | `wells`, `measurements` |
| Заходы UT-9 (дебит до/после) | `nanocem_jobs` |
| Портфель кандидатов | `nanocem_candidates` (`TODO:` добавить при переносе программы) |
| Контракты, обязательства, дедлайны из `/erp/` | `contracts`, `obligations` |
| 7 этапов | `stages` (справочник) |
