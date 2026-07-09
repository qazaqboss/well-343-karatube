# 🛢️ Сайт: Ежедневный мониторинг скважины 343 — Месторождение Каратюбе

---

## ОБЩАЯ КОНЦЕПЦИЯ САЙТА

**Название:** `КаратюбеМонитор` / `Karatube Monitor`
**Подзаголовок:** Ежедневный мониторинг добычи | Скважина 343 | РИР NanoCem UT-9

**Аудитория:** РИР-инженеры, технологи по добыче, руководство месторождения
**Задача:** Профессиональный дашборд ежедневных замеров скважины 343 с историей РИР

**Тон и эстетика:**
- Industrial/Utilitarian с нефтяным характером
- Тёмная тема (ночные смены, промышленный объект)
- Монохром + бирюзовый как единственный яркий акцент
- Шрифты: `Oswald` (заголовки — жёсткий, технический) + `JetBrains Mono` (данные — моноширинный)
- Ощущение: «боевой» мониторинг промышленного объекта, а не красивая веб-страница

---

## ЦВЕТОВАЯ СИСТЕМА

```css
:root {
  /* Основная палитра */
  --color-bg:          #080F18;   /* Почти чёрный — фон страницы */
  --color-surface:     #0D1B2A;   /* Тёмно-синий — карточки */
  --color-surface-2:   #132234;   /* Средний синий — вложенные элементы */
  --color-border:      #1E3A52;   /* Граница карточек */
  --color-border-dim:  #0F2236;   /* Тонкая граница */

  /* Акцентные цвета */
  --color-teal:        #0D9488;   /* Основной акцент — бирюзовый */
  --color-teal-bright: #14B8A6;   /* Ярко-бирюзовый */
  --color-teal-dim:    #0A6E67;   /* Тёмный бирюзовый */
  --color-teal-glow:   rgba(13,148,136,0.15); /* Свечение */

  /* Статусные цвета */
  --color-green:       #22C55E;   /* Хорошие показатели */
  --color-green-dim:   rgba(34,197,94,0.1);
  --color-orange:      #F97316;   /* Внимание / до РИР */
  --color-orange-dim:  rgba(249,115,22,0.1);
  --color-red:         #EF4444;   /* Критично */
  --color-red-dim:     rgba(239,68,68,0.1);
  --color-purple:      #8B5CF6;   /* Форсированный режим */
  --color-yellow:      #F59E0B;   /* Предупреждение */

  /* Текст */
  --color-text:        #E2E8F0;   /* Основной текст */
  --color-text-dim:    #64748B;   /* Вторичный текст */
  --color-text-muted:  #334155;   /* Приглушённый */

  /* Шрифты */
  --font-display:      'Oswald', sans-serif;
  --font-mono:         'JetBrains Mono', monospace;
  --font-body:         'IBM Plex Sans', sans-serif;
}
```

---

## СТРУКТУРА САЙТА (СТРАНИЦЫ)

```
/                    → Главная (дашборд текущего дня)
/history             → История замеров (все дни)
/rir                 → Страница РИР NanoCem UT-9
/analytics           → Аналитика и графики
/well-343            → Паспорт скважины
```

---

## СТРАНИЦА 1: ГЛАВНАЯ — ДАШБОРД ТЕКУЩЕГО ДНЯ

### Структура лейаута:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER: Логотип | КаратюбеМонитор | Навигация | Дата: 30.04.2026 | 14:00  │
├─────────────────────────────────────────────────────────────────────────────┤
│  HERO BANNER: "СКВАЖИНА 343 — СУТОЧНЫЙ ЗАМЕР"                               │
│  [Статус: ✅ РАБОТАЕТ | Режим: 140 об/мин | Горизонт J1-IV]                │
├───────────┬───────────┬───────────┬───────────┬──────────────────────────── │
│  Qн       │  Обв.     │  Qж       │  Qв       │  Ндин                       │
│  14.9     │  37.6%    │  27.3     │  10.3     │  167 м                      │
│  т/сут    │           │  м³/сут   │  м³/сут   │                             │
├───────────┴───────────┴───────────┴───────────┴──────────────────────────── │
│  МИНИ-ГРАФИК (последние 30 дней): Qн и Обв. рядом                          │
├─────────────────────────────────┬───────────────────────────────────────────│
│  СТАТУС РИР NanoCem UT-9        │  ТЕХНИЧЕСКИЙ РЕЖИМ                        │
│  [Дни после РИР: 88]            │  Насос: УШВН 33/900 | 585 м              │
│  [Эффект: СОХРАНЯЕТСЯ ✅]        │  Обороты: 140 об/мин                     │
│  [Пик: 19.03 — 16.4 т/сут]     │  Тех.Qн: 14.2 т/сут | Факт: 14.9 ✅      │
├─────────────────────────────────┴───────────────────────────────────────────│
│  ЛЕНТА СОБЫТИЙ (последние 7 дней с комментариями)                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### HTML-код страницы:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>КаратюбеМонитор — Скважина 343</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>

/* ═══════════════════════════════════
   RESET & BASE
═══════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:         #080F18;
  --surface:    #0D1B2A;
  --surface2:   #132234;
  --border:     #1E3A52;
  --teal:       #0D9488;
  --teal-b:     #14B8A6;
  --teal-glow:  rgba(13,148,136,0.12);
  --green:      #22C55E;
  --orange:     #F97316;
  --red:        #EF4444;
  --purple:     #8B5CF6;
  --yellow:     #F59E0B;
  --text:       #E2E8F0;
  --dim:        #64748B;
  --muted:      #1E3A52;
  --font-h:     'Oswald', sans-serif;
  --font-data:  'JetBrains Mono', monospace;
  --font-body:  'IBM Plex Sans', sans-serif;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  min-height: 100vh;
  line-height: 1.5;
}

/* ═══════════════════════════════════
   HEADER
═══════════════════════════════════ */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--teal);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.logo-text {
  font-family: var(--font-h);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text);
}

.logo-text span { color: var(--teal); }

.nav {
  display: flex;
  gap: 32px;
}

.nav a {
  font-family: var(--font-h);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--dim);
  text-decoration: none;
  transition: color 0.2s;
}

.nav a:hover, .nav a.active { color: var(--teal-b); }

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--green);
  letter-spacing: 1px;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.header-date {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--dim);
  letter-spacing: 1px;
}

/* ═══════════════════════════════════
   HERO SECTION
═══════════════════════════════════ */
.hero {
  padding: 32px 40px 24px;
  background: linear-gradient(180deg, #0A1520 0%, var(--bg) 100%);
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

/* Фоновый узор — сетка в стиле технического чертежа */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(13,148,136,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13,148,136,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
}

.hero-title-block {}

.hero-label {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--teal);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.hero-title {
  font-family: var(--font-h);
  font-size: 52px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hero-title .num { color: var(--teal); }

.hero-subtitle {
  font-size: 14px;
  color: var(--dim);
  margin-top: 8px;
  font-family: var(--font-data);
  letter-spacing: 1px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(34,197,94,0.08);
  border: 1px solid rgba(34,197,94,0.25);
  border-radius: 4px;
  padding: 10px 16px;
  font-family: var(--font-data);
  font-size: 12px;
  color: var(--green);
  letter-spacing: 1px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
}

/* ═══════════════════════════════════
   KPI CARDS ROW
═══════════════════════════════════ */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding: 24px 40px;
}

.kpi-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px 20px 16px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
}

.kpi-card.teal::before   { background: var(--teal); }
.kpi-card.green::before  { background: var(--green); }
.kpi-card.orange::before { background: var(--orange); }
.kpi-card.red::before    { background: var(--red); }
.kpi-card.purple::before { background: var(--purple); }

.kpi-card:hover {
  border-color: var(--teal);
  transform: translateY(-2px);
}

.kpi-label {
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--dim);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.kpi-value {
  font-family: var(--font-h);
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1px;
}

.kpi-card.teal .kpi-value   { color: var(--teal-b); }
.kpi-card.green .kpi-value  { color: var(--green); }
.kpi-card.orange .kpi-value { color: var(--orange); }
.kpi-card.red .kpi-value    { color: var(--red); }
.kpi-card.purple .kpi-value { color: var(--purple); }

.kpi-unit {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--dim);
  margin-top: 4px;
  letter-spacing: 1px;
}

.kpi-delta {
  position: absolute;
  top: 16px;
  right: 16px;
  font-family: var(--font-data);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
}

.kpi-delta.up   { background: rgba(34,197,94,0.15); color: var(--green); }
.kpi-delta.down { background: rgba(239,68,68,0.15); color: var(--red); }
.kpi-delta.same { background: rgba(100,116,139,0.15); color: var(--dim); }

/* ═══════════════════════════════════
   MAIN CONTENT GRID
═══════════════════════════════════ */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  padding: 0 40px 40px;
}

/* ═══════════════════════════════════
   CHART CARD
═══════════════════════════════════ */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-family: var(--font-h);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text);
}

.card-badge {
  font-family: var(--font-data);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 3px;
  border: 1px solid var(--teal);
  color: var(--teal);
  letter-spacing: 1px;
}

.chart-area {
  padding: 20px;
  height: 280px;
  position: relative;
}

/* ═══════════════════════════════════
   TIMELINE / EVENTS FEED
═══════════════════════════════════ */
.events-feed {
  padding: 16px 20px;
}

.event-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--muted);
  position: relative;
}

.event-item:last-child { border-bottom: none; }

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.event-dot.green  { background: var(--green); }
.event-dot.teal   { background: var(--teal); }
.event-dot.orange { background: var(--orange); }
.event-dot.red    { background: var(--red); }
.event-dot.purple { background: var(--purple); }
.event-dot.dim    { background: var(--dim); }

.event-content {}

.event-date {
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--dim);
  letter-spacing: 1px;
  margin-bottom: 3px;
}

.event-text {
  font-size: 13px;
  color: var(--text);
  line-height: 1.4;
}

.event-tag {
  display: inline-block;
  font-family: var(--font-data);
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 2px;
  margin-top: 4px;
  letter-spacing: 1px;
}

.event-tag.green  { background: rgba(34,197,94,0.1);   color: var(--green); }
.event-tag.teal   { background: rgba(13,148,136,0.1);  color: var(--teal-b); }
.event-tag.orange { background: rgba(249,115,22,0.1);  color: var(--orange); }
.event-tag.red    { background: rgba(239,68,68,0.1);   color: var(--red); }
.event-tag.purple { background: rgba(139,92,246,0.1);  color: var(--purple); }

/* ═══════════════════════════════════
   SIDEBAR: RIR STATUS + TECH MODE
═══════════════════════════════════ */
.sidebar { display: flex; flex-direction: column; gap: 16px; }

.rir-card {
  background: var(--surface);
  border: 1px solid var(--teal);
  border-radius: 8px;
  overflow: hidden;
}

.rir-header {
  background: var(--teal-glow);
  padding: 14px 18px;
  border-bottom: 1px solid rgba(13,148,136,0.2);
  display: flex;
  align-items: center;
  gap: 8px;
}

.rir-header-title {
  font-family: var(--font-h);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--teal-b);
}

.rir-body { padding: 16px 18px; }

.rir-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--muted);
  font-size: 13px;
}

.rir-metric:last-child { border-bottom: none; }
.rir-metric-label { color: var(--dim); font-family: var(--font-data); font-size: 11px; }
.rir-metric-val   { color: var(--text); font-family: var(--font-data); font-size: 12px; font-weight: 600; }
.rir-metric-val.teal   { color: var(--teal-b); }
.rir-metric-val.green  { color: var(--green); }
.rir-metric-val.orange { color: var(--orange); }

.days-counter {
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--muted);
  margin-bottom: 12px;
}

.days-num {
  font-family: var(--font-h);
  font-size: 56px;
  font-weight: 700;
  color: var(--teal);
  line-height: 1;
}

.days-label {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 4px;
}

/* ═══════════════════════════════════
   TECH MODE CARD
═══════════════════════════════════ */
.tech-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.tech-header {
  background: var(--surface2);
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-h);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--dim);
}

.tech-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  border-bottom: 1px solid var(--muted);
  font-size: 12px;
}

.tech-row:last-child { border-bottom: none; }
.tech-key   { color: var(--dim); font-family: var(--font-data); font-size: 10px; letter-spacing: 1px; }
.tech-val   { color: var(--text); font-family: var(--font-data); font-size: 11px; }
.tech-val.ok { color: var(--green); }
.tech-val.warn { color: var(--orange); }

/* ═══════════════════════════════════
   COMPARISON BAR (до/после)
═══════════════════════════════════ */
.compare-section {
  padding: 0 40px 24px;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.compare-col {
  background: var(--surface);
  padding: 24px;
  text-align: center;
}

.compare-col.highlight {
  background: rgba(13,148,136,0.05);
  border-left: 2px solid var(--teal);
  border-right: 2px solid var(--teal);
}

.compare-label {
  font-family: var(--font-data);
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--dim);
  margin-bottom: 12px;
}

.compare-date {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--dim);
  margin-bottom: 16px;
}

.compare-qn {
  font-family: var(--font-h);
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
}

.compare-col:first-child .compare-qn  { color: var(--red); }
.compare-col.highlight .compare-qn    { color: var(--teal-b); }
.compare-col:last-child .compare-qn   { color: var(--green); }

.compare-unit  { font-family: var(--font-data); font-size: 11px; color: var(--dim); margin: 4px 0 12px; }
.compare-obv   { font-family: var(--font-data); font-size: 14px; font-weight: 600; }

.compare-col:first-child .compare-obv  { color: var(--red); }
.compare-col.highlight .compare-obv    { color: var(--teal-b); }
.compare-col:last-child .compare-obv   { color: var(--green); }

/* ═══════════════════════════════════
   FOOTER
═══════════════════════════════════ */
.footer {
  border-top: 1px solid var(--border);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 1px;
}

.footer-logo {
  font-family: var(--font-h);
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--dim);
}

.footer-logo span { color: var(--teal); }

</style>
</head>
<body>

<!-- ═══════ HEADER ═══════ -->
<header class="header">
  <div class="logo">
    <div class="logo-icon">⬡</div>
    <div class="logo-text">Каратюбе<span>Монитор</span></div>
  </div>
  <nav class="nav">
    <a href="/" class="active">ДАШБОРД</a>
    <a href="/history">ИСТОРИЯ</a>
    <a href="/rir">РИР NANOCEM</a>
    <a href="/analytics">АНАЛИТИКА</a>
    <a href="/well-343">ПАСПОРТ</a>
  </nav>
  <div class="header-right">
    <div class="live-badge">
      <div class="live-dot"></div>
      ОНЛАЙН
    </div>
    <div class="header-date">30.04.2026 / 14:00</div>
  </div>
</header>

<!-- ═══════ HERO ═══════ -->
<section class="hero">
  <div class="hero-top">
    <div class="hero-title-block">
      <div class="hero-label">М/Р Каратюбе · Горизонт J1-IV · Суточный замер</div>
      <h1 class="hero-title">СКВАЖИНА <span class="num">343</span></h1>
      <div class="hero-subtitle">УШВН 33/900 · 585 М · ИНТ. ПЕРФ. 629,8–660 М · НКПЗ: 03.02.2026</div>
    </div>
    <div class="status-badge">
      <div class="status-dot"></div>
      ✅ РАБОТАЕТ · 140 ОБ/МИН
    </div>
  </div>
</section>

<!-- ═══════ KPI ROW ═══════ -->
<div class="kpi-row">
  <div class="kpi-card green">
    <div class="kpi-delta up">+12.3 от базы</div>
    <div class="kpi-label">Дебит нефти</div>
    <div class="kpi-value">14.9</div>
    <div class="kpi-unit">Т / СУТ</div>
  </div>
  <div class="kpi-card teal">
    <div class="kpi-delta same">стаб.</div>
    <div class="kpi-label">Обводнённость</div>
    <div class="kpi-value">37.6</div>
    <div class="kpi-unit">% · −51.8 П.П. от пика</div>
  </div>
  <div class="kpi-card teal">
    <div class="kpi-delta up">+7.2 от базы</div>
    <div class="kpi-label">Дебит жидкости</div>
    <div class="kpi-value">27.3</div>
    <div class="kpi-unit">М³ / СУТ</div>
  </div>
  <div class="kpi-card orange">
    <div class="kpi-delta same">стаб.</div>
    <div class="kpi-label">Дебит воды</div>
    <div class="kpi-value">10.3</div>
    <div class="kpi-unit">М³ / СУТ</div>
  </div>
  <div class="kpi-card purple">
    <div class="kpi-label">Ндин / стат</div>
    <div class="kpi-value">167</div>
    <div class="kpi-unit">М</div>
  </div>
</div>

<!-- ═══════ COMPARE STRIP ═══════ -->
<div class="compare-section">
  <div class="compare-grid">
    <div class="compare-col">
      <div class="compare-label">До РИР (базовый)</div>
      <div class="compare-date">28.01.2026</div>
      <div class="compare-qn">1.1</div>
      <div class="compare-unit">т/сут нефти</div>
      <div class="compare-obv">89.4% воды</div>
    </div>
    <div class="compare-col highlight">
      <div class="compare-label">Пиковый эффект</div>
      <div class="compare-date">19.03.2026</div>
      <div class="compare-qn">16.4</div>
      <div class="compare-unit">т/сут нефти</div>
      <div class="compare-obv">27.5% воды</div>
    </div>
    <div class="compare-col">
      <div class="compare-label">Текущий режим</div>
      <div class="compare-date">30.04.2026</div>
      <div class="compare-qn">14.9</div>
      <div class="compare-unit">т/сут нефти</div>
      <div class="compare-obv">37.6% воды</div>
    </div>
  </div>
</div>

<!-- ═══════ MAIN GRID ═══════ -->
<div class="content-grid">

  <!-- LEFT: Chart + Events -->
  <div style="display:flex;flex-direction:column;gap:16px;">

    <!-- Chart placeholder -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Динамика — последние 30 дней</div>
        <div class="card-badge">Qн + ОБВ.</div>
      </div>
      <div class="chart-area">
        <!-- Chart.js или Recharts монтируется сюда -->
        <canvas id="mainChart"></canvas>
      </div>
    </div>

    <!-- Events feed -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Лента замеров — апрель 2026</div>
        <div class="card-badge">30 ДНЕЙ</div>
      </div>
      <div class="events-feed">

        <div class="event-item">
          <div class="event-dot green"></div>
          <div class="event-content">
            <div class="event-date">30.04.2026 · ДЕНЬ 88 ПОСЛЕ РИР</div>
            <div class="event-text">Qн=14,9 т/сут | Обв.=37,6% | Qж=27,3 м³/сут | Ндин=167 м. Конец апреля — устойчивый рабочий режим. Эффект NanoCem сохраняется.</div>
            <span class="event-tag teal">СТАБИЛЬНЫЙ РЕЖИМ</span>
          </div>
        </div>

        <div class="event-item">
          <div class="event-dot teal"></div>
          <div class="event-content">
            <div class="event-date">27.04.2026</div>
            <div class="event-text">Qн=14,7 т/сут | Обв.=37,5% | После замера. Кратковременное отключение для ремонтных работ. Показатели стабильны.</div>
            <span class="event-tag dim">ЗАМЕР</span>
          </div>
        </div>

        <div class="event-item">
          <div class="event-dot orange"></div>
          <div class="event-content">
            <div class="event-date">25.04.2026</div>
            <div class="event-text">Qн=14,6 т/сут | Обв.=37,5%. Отключение электроэнергии, переход на ДЭС и обратно. Просадка без роста воды.</div>
            <span class="event-tag orange">ОТКЛЮЧЕНИЕ ЭЭ</span>
          </div>
        </div>

        <div class="event-item">
          <div class="event-dot green"></div>
          <div class="event-content">
            <div class="event-date">19.04.2026 · ПОСЛЕ ЗАМЕРА</div>
            <div class="event-text">Qн=15,3 т/сут | Обв.=37,3% — снижение обводнённости. Хороший день. Ндин=179–181 м.</div>
            <span class="event-tag green">УЛУЧШЕНИЕ</span>
          </div>
        </div>

        <div class="event-item">
          <div class="event-dot green"></div>
          <div class="event-content">
            <div class="event-date">13.04.2026 · ПОСЛЕ ЗАМЕРА</div>
            <div class="event-text">Qн вырос с 14,4 до 15,0 т/сут (+0,6 т/сут) БЕЗ роста воды. Обв.=38,0%. Позитивный сигнал сохранения эффекта NanoCem.</div>
            <span class="event-tag green">РОСТ НЕФТИ</span>
          </div>
        </div>

        <div class="event-item">
          <div class="event-dot teal"></div>
          <div class="event-content">
            <div class="event-date">09.04.2026</div>
            <div class="event-text">Обводнённость закрепилась на 38% — третий день без роста. Qн=14,4 т/сут. Конусообразование не развивается.</div>
            <span class="event-tag teal">СТАБИЛИЗАЦИЯ</span>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- RIGHT: Sidebar -->
  <div class="sidebar">

    <!-- RIR Status -->
    <div class="rir-card">
      <div class="rir-header">
        <span>⬡</span>
        <div class="rir-header-title">РИР NanoCem UT-9</div>
      </div>
      <div class="rir-body">
        <div class="days-counter">
          <div class="days-num">88</div>
          <div class="days-label">дней после РИР</div>
        </div>
        <div class="rir-metric">
          <span class="rir-metric-label">ДАТА ПРОВЕДЕНИЯ</span>
          <span class="rir-metric-val">29.01–02.02.26</span>
        </div>
        <div class="rir-metric">
          <span class="rir-metric-label">СОСТАВ</span>
          <span class="rir-metric-val teal">NanoCem UT-9</span>
        </div>
        <div class="rir-metric">
          <span class="rir-metric-label">ПИКОВЫЙ ДЕБИТ</span>
          <span class="rir-metric-val green">16,4 т/сут · 19.03</span>
        </div>
        <div class="rir-metric">
          <span class="rir-metric-label">МИН. ОБВОДНЁННОСТЬ</span>
          <span class="rir-metric-val green">27,5% · 19.03</span>
        </div>
        <div class="rir-metric">
          <span class="rir-metric-label">РОСТ ДЕБИТА</span>
          <span class="rir-metric-val green">×5,7 от базы</span>
        </div>
        <div class="rir-metric">
          <span class="rir-metric-label">СНИЖЕНИЕ ОБВ.</span>
          <span class="rir-metric-val teal">−47–52 п.п.</span>
        </div>
        <div class="rir-metric">
          <span class="rir-metric-label">ЭФФЕКТ</span>
          <span class="rir-metric-val green">✅ СОХРАНЯЕТСЯ</span>
        </div>
      </div>
    </div>

    <!-- Tech mode -->
    <div class="tech-card">
      <div class="tech-header">Технический режим</div>
      <div class="tech-row">
        <span class="tech-key">НАСОС</span>
        <span class="tech-val">УШВН 33/900</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">ГЛУБИНА УСТАНОВКИ</span>
        <span class="tech-val">585 М</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">ОБОРОТЫ (ФАКТ)</span>
        <span class="tech-val ok">140 ОБ/МИН</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">Qн ТЕХ. РЕЖИМ</span>
        <span class="tech-val">14,2 Т/СУТ</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">Qн ФАКТ</span>
        <span class="tech-val ok">14,9 Т/СУТ ↑</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">ОБВ. ТЕХ. РЕЖИМ</span>
        <span class="tech-val">35,7%</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">ОБВ. ФАКТ</span>
        <span class="tech-val warn">37,6% ↑</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">Qж ТЕХ. РЕЖИМ</span>
        <span class="tech-val">25,2 М³/СУТ</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">Qж ФАКТ</span>
        <span class="tech-val ok">27,3 М³/СУТ ↑</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">ГОРИЗОНТ</span>
        <span class="tech-val">J1-IV</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">ИС. ЗАБОЙ</span>
        <span class="tech-val">816 М</span>
      </div>
    </div>

    <!-- Risk monitor -->
    <div class="tech-card">
      <div class="tech-header" style="color: var(--orange);">⚠ Мониторинг рисков</div>
      <div class="tech-row">
        <span class="tech-key">ОБВОДН. СЕЙЧАС</span>
        <span class="tech-val ok">37,6% · ОК</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">ПОРОГ ВНИМАНИЯ</span>
        <span class="tech-val">39–40%</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">КРИТИЧ. ПОРОГ</span>
        <span class="tech-val" style="color:var(--red);">> 40% + Qн < 14,5</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">ТРЕНД</span>
        <span class="tech-val ok">→ СТАБИЛЕН</span>
      </div>
      <div class="tech-row">
        <span class="tech-key">РЕКОМЕНДАЦИЯ</span>
        <span class="tech-val ok">140 ОБ/МИН · ДЕРЖАТЬ</span>
      </div>
    </div>

  </div><!-- /sidebar -->
</div><!-- /content-grid -->

<!-- ═══════ FOOTER ═══════ -->
<footer class="footer">
  <div class="footer-text">М/Р КАРАТЮБЕ · СКВ. 343 · J1-IV · УШВН 33/900 · ДАННЫЕ: СУТОЧНЫЕ РЕЖИМНЫЕ ЛИСТЫ</div>
  <div class="footer-logo">ТОО «ЭкоМикс» · <span>NanoCem UT-9</span></div>
</footer>

</body>
</html>
```

---

## СТРАНИЦА 2: ИСТОРИЯ ЗАМЕРОВ `/history`

### Структура:

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER (общий)                                                   │
├──────────────────────────────────────────────────────────────────┤
│  ФИЛЬТРЫ: [Все периоды ▼] [Фаза: все ▼] [Диапазон дат]         │
│  ЛЕГЕНДА: 🟠 До РИР | 🔴 КРС | 🟢 После РИР | 🟣 Форс. | 🔵 Апр│
├────────────────────────────────────────────────────────────────  │
│  ТАБЛИЦА (96 строк, все дни):                                    │
│  [Дата][Фаза][Событие][Qн][Обв.%][Qж][Qв][∆Qн][∆Обв.][Ндин]   │
│  [Комментарий — разворачивается кликом]                         │
└──────────────────────────────────────────────────────────────────┘
```

### Ключевые элементы таблицы:
- Строки окрашены по фазе (цвет левой полосы 4px)
- Особые строки (пиковые, скачки) — с фоновой подсветкой
- Клик на строку → разворачивается полный комментарий дня
- Сортировка по любому столбцу
- Экспорт в CSV

---

## СТРАНИЦА 3: РИР NanoCem UT-9 `/rir`

### Структура:

```
┌──────────────────────────────────────────────────────────────────┐
│  HERO: "РЕМОНТНО-ИЗОЛЯЦИОННЫЕ РАБОТЫ" + ключевые цифры          │
├──────────────────────────────────────────────────────────────────┤
│  ТАЙМЛАЙН ОПЕРАЦИИ (5 этапов горизонтально)                     │
│  [28.01 СТОП] → [29.01–02.02 КРС/РИР] → [03.02 ЗАПУСК]        │
│  → [04.02 СКАЧОК] → [19.02 ЭФФЕКТ] → [19.03 ПИК]              │
├──────────────────────────────────────────────────────────────────┤
│  О ПРОДУКТЕ NanoCem UT-9:                                        │
│  [D97 < 10 мкм] [CaO ≥ 63%] [Класс 3] [СТ ТОО]                │
│  + Сравнение с обычным цементом                                  │
├──────────────────────────────────────────────────────────────────┤
│  МЕХАНИЗМ РАБОТЫ (инфографика конусообразования)                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## СТРАНИЦА 4: АНАЛИТИКА `/analytics`

### Структура:

```
┌──────────────────────────────────────────────────────────────────┐
│  ТРИ ГРАФИКА полная история:                                     │
│  1. Qн (т/сут) — всё время — Chart.js LineChart                 │
│  2. Обводнённость (%) — всё время                               │
│  3. Ежемесячный добыча (бар)                                    │
├──────────────────────────────────────────────────────────────────┤
│  СРАВНЕНИЕ ПЕРИОДОВ (таблица + бар-чарты рядом)                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## СТРАНИЦА 5: ПАСПОРТ СКВАЖИНЫ `/well-343`

### Контент:

```markdown
# Скважина №343 — Технический паспорт

| Параметр                  | Значение                                         |
|---------------------------|--------------------------------------------------|
| Месторождение             | Каратюбе (Актюбинская обл., Казахстан)           |
| ПСН / АГЗУ                | №1                                               |
| Горизонт                  | J1-IV                                            |
| Искусственный забой       | 816 м                                            |
| Интервалы перфорации      | 629,8–634; 640,5–643,5; 645,5–648; 654–660 м    |
| Выкидная линия            | Металл/НКТ Ø89×6,5 мм                           |
| Насос                     | УШВН 33/900                                      |
| Глубина установки насоса  | 585 м                                            |
| Дата спуска насоса (НКПЗ) | 03.02.2026                                       |
| Рабочий режим             | 140 об/мин                                       |
| Тех. режим (Qж)           | 25,2 м³/сут                                      |
| Тех. режим (Qн)           | 14,2 т/сут                                       |
| Тех. режим (Обв.)         | 35,7%                                            |
| Оператор                  | ИК Petroleum                                     |

## История РИР

| Дата РИР         | Метод                | Результат                               |
|------------------|----------------------|-----------------------------------------|
| 29.01–02.02.2026 | Закачка NanoCem UT-9 | Qн ×5,7, обв. с 89% до 27,5% (пик)   |
```

---

## ДАННЫЕ ДЛЯ JAVASCRIPT (JSON)

```javascript
// data/well343.js — все замеры для Chart.js

const WELL_343_DATA = [
  // { date, qn, obv, qzh, qv, ndin, phase, event, comment }
  { date:"15.01.2026", qn:2.6,  obv:85.4, qzh:20.1, qv:null, ndin:43,  phase:"before", event:"", comment:"Базовый период. Скважина работает в штатном режиме. Дебит нефти 2,6 т/сут, обводнённость 85,4%." },
  { date:"16.01.2026", qn:2.6,  obv:85.4, qzh:20.1, qv:null, ndin:43,  phase:"before", event:"", comment:"Показатели без изменений." },
  { date:"17.01.2026", qn:2.6,  obv:85.4, qzh:20.1, qv:null, ndin:43,  phase:"before", event:"", comment:"Стабильный режим. Потенциал скважины не реализован." },
  { date:"18.01.2026", qn:2.6,  obv:85.4, qzh:20.1, qv:null, ndin:43,  phase:"before", event:"", comment:"Показатели без изменений." },
  { date:"19.01.2026", qn:2.6,  obv:85.4, qzh:20.1, qv:null, ndin:43,  phase:"before", event:"", comment:"Показатели без изменений." },
  { date:"20.01.2026", qn:2.6,  obv:85.4, qzh:20.1, qv:null, ndin:43,  phase:"before", event:"", comment:"Конец первой недели наблюдений." },
  { date:"21.01.2026", qn:2.3,  obv:86.0, qzh:19.2, qv:null, ndin:43,  phase:"before", event:"warning", comment:"Начало негативного тренда. Дебит снизился до 2,3 т/сут, обводнённость выросла до 86,0%." },
  { date:"22.01.2026", qn:2.3,  obv:86.0, qzh:19.2, qv:null, ndin:43,  phase:"before", event:"", comment:"Второй день снижения. Тренд подтверждается." },
  { date:"23.01.2026", qn:2.3,  obv:86.0, qzh:19.2, qv:null, ndin:43,  phase:"before", event:"", comment:"Третий день снижения." },
  { date:"24.01.2026", qn:2.3,  obv:86.5, qzh:19.2, qv:null, ndin:43,  phase:"before", event:"", comment:"Обводнённость выросла до 86,5% — новый максимум." },
  { date:"25.01.2026", qn:2.6,  obv:84.0, qzh:20.1, qv:null, ndin:43,  phase:"before", event:"", comment:"Краткосрочное улучшение. Нестабильность пласта." },
  { date:"26.01.2026", qn:2.6,  obv:84.0, qzh:20.1, qv:null, ndin:43,  phase:"before", event:"", comment:"Показатели держатся." },
  { date:"27.01.2026", qn:1.7,  obv:89.4, qzh:18.6, qv:null, ndin:43,  phase:"before", event:"critical", comment:"КРИТИЧЕСКОЕ ПАДЕНИЕ. Дебит 1,7 т/сут, обводнённость 89,4% — рекордный максимум." },
  { date:"28.01.2026", qn:1.1,  obv:89.4, qzh:11.4, qv:null, ndin:43,  phase:"before", event:"stop", comment:"МИНИМАЛЬНЫЙ ДЕБИТ 1,1 т/сут. Остановка после замера в 15:00." },
  { date:"29.01.2026", qn:null, obv:null, qzh:null, qv:null, ndin:null, phase:"krs", event:"krs", comment:"КРС. День 1. Подготовка ствола." },
  { date:"30.01.2026", qn:null, obv:null, qzh:null, qv:null, ndin:null, phase:"krs", event:"krs", comment:"КРС. День 2." },
  { date:"31.01.2026", qn:null, obv:null, qzh:null, qv:null, ndin:null, phase:"krs", event:"krs", comment:"КРС. День 3. Подготовка к закачке NanoCem." },
  { date:"01.02.2026", qn:null, obv:null, qzh:null, qv:null, ndin:null, phase:"krs", event:"rir", comment:"РИР. Закачка NanoCem UT-9 (D97<10 мкм) в интервалы перфорации." },
  { date:"02.02.2026", qn:null, obv:null, qzh:null, qv:null, ndin:null, phase:"krs", event:"rir", comment:"Технологическая выдержка. Цемент набирает прочность." },
  { date:"03.02.2026", qn:2.1,  obv:83.0, qzh:14.2, qv:null, ndin:150, phase:"after", event:"start", comment:"Запуск. Пробы: №1-93%, №2-82%, №3-74%. Дебит 2,1 т/сут, обв. 83%." },
  { date:"04.02.2026", qn:6.2,  obv:66.8, qzh:21.2, qv:null, ndin:160, phase:"after", event:"jump", comment:"ПЕРЕЛОМ. Перевод на выкидную линию. 2,1→6,2 т/сут (+4,1). Обв. 83%→66,8% за сутки." },
  { date:"05.02.2026", qn:6.2,  obv:66.7, qzh:21.2, qv:null, ndin:177, phase:"after", event:"", comment:"Стабилизация. Обороты 120 об/мин." },
  { date:"06.02.2026", qn:6.5,  obv:65.0, qzh:21.3, qv:null, ndin:197, phase:"after", event:"", comment:"Плавный рост до 6,5 т/сут." },
  { date:"07.02.2026", qn:6.5,  obv:64.7, qzh:21.2, qv:null, ndin:197, phase:"after", event:"", comment:"После замера." },
  { date:"08.02.2026", qn:6.6,  obv:64.7, qzh:21.3, qv:null, ndin:197, phase:"after", event:"", comment:"Незначительный рост." },
  { date:"09.02.2026", qn:6.6,  obv:64.7, qzh:21.4, qv:null, ndin:216, phase:"after", event:"", comment:"Стабильный режим 120 об/мин." },
  { date:"10.02.2026", qn:7.0,  obv:62.8, qzh:21.5, qv:null, ndin:216, phase:"after", event:"rise", comment:"Рост до 7,0 т/сут. Обв. снизилась до 62,8%. После замера." },
  { date:"11.02.2026", qn:6.9,  obv:62.8, qzh:21.2, qv:null, ndin:216, phase:"after", event:"", comment:"Небольшая коррекция." },
  { date:"12.02.2026", qn:6.9,  obv:62.8, qzh:21.3, qv:null, ndin:216, phase:"after", event:"", comment:"Стабильно." },
  { date:"13.02.2026", qn:6.9,  obv:62.8, qzh:21.2, qv:null, ndin:216, phase:"after", event:"", comment:"Стабильно." },
  { date:"14.02.2026", qn:6.9,  obv:62.8, qzh:21.3, qv:null, ndin:216, phase:"after", event:"", comment:"После замера. Плато 62,8%." },
  { date:"15.02.2026", qn:6.9,  obv:62.9, qzh:21.4, qv:null, ndin:248, phase:"after", event:"", comment:"Незначительные колебания." },
  { date:"16.02.2026", qn:6.9,  obv:62.9, qzh:21.4, qv:null, ndin:248, phase:"after", event:"", comment:"Стабильно." },
  { date:"17.02.2026", qn:6.9,  obv:62.9, qzh:21.4, qv:null, ndin:248, phase:"after", event:"", comment:"После замера." },
  { date:"18.02.2026", qn:6.9,  obv:62.9, qzh:21.4, qv:null, ndin:248, phase:"after", event:"", comment:"Последний день перед скачком." },
  { date:"19.02.2026", qn:11.5, obv:38.4, qzh:21.4, qv:null, ndin:189, phase:"after", event:"bigjump", comment:"РЕЗКИЙ ПЕРЕЛОМ. 6,9→11,5 т/сут. Обв. 62,9%→38,4% (−24,5 п.п. за сутки). Окончание схватывания NanoCem." },
  { date:"20.02.2026", qn:11.5, obv:38.4, qzh:21.4, qv:null, ndin:189, phase:"after", event:"", comment:"Подтверждение. Стабилен." },
  { date:"21.02.2026", qn:11.5, obv:38.4, qzh:21.4, qv:null, ndin:189, phase:"after", event:"", comment:"Третий день. Дата отбивки." },
  { date:"22.02.2026", qn:11.5, obv:38.4, qzh:21.4, qv:null, ndin:189, phase:"after", event:"", comment:"Стабильно." },
  { date:"23.02.2026", qn:12.3, obv:34.5, qzh:21.4, qv:null, ndin:189, phase:"after", event:"rise", comment:"Дальнейший рост до 12,3 т/сут. Обв. 34,5%." },
  { date:"24.02.2026", qn:13.3, obv:34.5, qzh:23.2, qv:null, ndin:189, phase:"after", event:"", comment:"После замера. Дебит 13,3 т/сут." },
  { date:"25.02.2026", qn:13.3, obv:34.5, qzh:23.2, qv:null, ndin:189, phase:"after", event:"", comment:"Стабильно." },
  { date:"26.02.2026", qn:13.3, obv:34.5, qzh:23.2, qv:null, ndin:189, phase:"after", event:"", comment:"Стабильно." },
  { date:"27.02.2026", qn:13.3, obv:34.5, qzh:23.2, qv:null, ndin:189, phase:"after", event:"", comment:"Стабильно." },
  { date:"28.02.2026", qn:13.3, obv:35.6, qzh:23.7, qv:null, ndin:189, phase:"after", event:"", comment:"Незначительный рост обв. Конец февраля." },
  { date:"01.03.2026", qn:13.3, obv:35.6, qzh:23.7, qv:null, ndin:240, phase:"after", event:"", comment:"Март. Стабильно." },
  { date:"02.03.2026", qn:13.3, obv:35.6, qzh:23.7, qv:null, ndin:240, phase:"after", event:"", comment:"Стабильно." },
  { date:"03.03.2026", qn:13.9, obv:35.0, qzh:24.4, qv:null, ndin:240, phase:"after", event:"rise", comment:"После замера. Рост до 13,9 т/сут, обв. 35,0%." },
  { date:"05.03.2026", qn:14.0, obv:35.1, qzh:24.7, qv:null, ndin:239, phase:"after", event:"", comment:"14,0 т/сут. Стабильная работа." },
  { date:"06.03.2026", qn:14.0, obv:35.1, qzh:24.6, qv:null, ndin:239, phase:"after", event:"", comment:"После замера." },
  { date:"07.03.2026", qn:14.0, obv:35.1, qzh:24.6, qv:null, ndin:239, phase:"after", event:"", comment:"Стабильно." },
  { date:"08.03.2026", qn:14.1, obv:35.1, qzh:24.8, qv:null, ndin:239, phase:"after", event:"", comment:"Незначительный рост." },
  { date:"09.03.2026", qn:14.1, obv:35.1, qzh:24.8, qv:null, ndin:273, phase:"after", event:"", comment:"После замера." },
  { date:"10.03.2026", qn:14.3, obv:35.0, qzh:25.2, qv:null, ndin:273, phase:"after", event:"", comment:"14,3 т/сут." },
  { date:"11.03.2026", qn:14.3, obv:35.0, qzh:25.2, qv:null, ndin:273, phase:"after", event:"", comment:"Стабильно." },
  { date:"12.03.2026", qn:14.3, obv:35.0, qzh:25.2, qv:null, ndin:273, phase:"after", event:"", comment:"Стабильно." },
  { date:"13.03.2026", qn:14.3, obv:34.9, qzh:25.2, qv:null, ndin:273, phase:"after", event:"", comment:"После замера. Обв. 34,9%." },
  { date:"14.03.2026", qn:14.3, obv:34.9, qzh:25.2, qv:null, ndin:175, phase:"after", event:"", comment:"Стабильно." },
  { date:"15.03.2026", qn:14.3, obv:34.9, qzh:25.2, qv:null, ndin:175, phase:"after", event:"", comment:"Конец плато. Завтра — форсирование." },
  { date:"16.03.2026", qn:14.9, obv:33.2, qzh:25.5, qv:null, ndin:175, phase:"forced", event:"rpm", comment:"УВЕЛИЧЕНИЕ ОБОРОТОВ 120→140 об/мин. Дебит 14,9 т/сут, обв. 33,2%." },
  { date:"17.03.2026", qn:15.6, obv:31.9, qzh:26.2, qv:null, ndin:187, phase:"forced", event:"", comment:"Рост после форсирования. 15,6 т/сут, 31,9%." },
  { date:"18.03.2026", qn:15.9, obv:29.8, qzh:25.9, qv:null, ndin:187, phase:"forced", event:"", comment:"Впервые ниже 30%. 15,9 т/сут, 29,8%." },
  { date:"19.03.2026", qn:16.4, obv:27.5, qzh:26.2, qv:null, ndin:187, phase:"forced", event:"peak", comment:"🏆 ПИК. 16,4 т/сут — исторический максимум. 27,5% — исторический минимум." },
  { date:"20.03.2026", qn:16.3, obv:27.5, qzh:25.8, qv:null, ndin:187, phase:"forced", event:"", comment:"Начало стабилизации." },
  { date:"21.03.2026", qn:16.0, obv:27.5, qzh:25.3, qv:null, ndin:187, phase:"forced", event:"", comment:"Плато." },
  { date:"22.03.2026", qn:16.0, obv:27.5, qzh:25.2, qv:null, ndin:190, phase:"forced", event:"", comment:"После замера." },
  { date:"23.03.2026", qn:16.0, obv:27.5, qzh:25.2, qv:null, ndin:190, phase:"forced", event:"", comment:"Стабильно." },
  { date:"24.03.2026", qn:16.0, obv:27.5, qzh:25.2, qv:null, ndin:190, phase:"forced", event:"", comment:"Стабильно." },
  { date:"25.03.2026", qn:16.0, obv:28.4, qzh:25.6, qv:null, ndin:190, phase:"forced", event:"cone", comment:"ПЕРВЫЙ ПРИЗНАК КОНУСООБРАЗОВАНИЯ. Обв. выросла до 28,4% (+0,9 п.п.)." },
  { date:"26.03.2026", qn:16.0, obv:28.4, qzh:25.6, qv:null, ndin:190, phase:"forced", event:"", comment:"Подтверждается." },
  { date:"27.03.2026", qn:15.6, obv:30.2, qzh:25.6, qv:null, ndin:190, phase:"forced", event:"warn", comment:"Дебит снизился до 15,6 т/сут. Обв. 30,2%. Конус развивается." },
  { date:"28.03.2026", qn:15.3, obv:32.0, qzh:25.8, qv:null, ndin:190, phase:"forced", event:"", comment:"После замера. Обв. 32,0%." },
  { date:"29.03.2026", qn:15.3, obv:32.0, qzh:25.8, qv:null, ndin:190, phase:"forced", event:"", comment:"Стабильно." },
  { date:"30.03.2026", qn:14.9, obv:34.0, qzh:25.8, qv:null, ndin:190, phase:"forced", event:"", comment:"Дебит 14,9 т/сут. Обв. 34,0%." },
  { date:"31.03.2026", qn:14.9, obv:34.0, qzh:25.8, qv:null, ndin:190, phase:"forced", event:"", comment:"Конец марта." },
  { date:"01.04.2026", qn:14.2, obv:35.7, qzh:25.3, qv:9.1,  ndin:190, phase:"stable", event:"", comment:"После замера. 14,2 т/сут, 35,7%." },
  { date:"02.04.2026", qn:14.2, obv:36.0, qzh:25.3, qv:9.1,  ndin:190, phase:"stable", event:"", comment:"Обв. 36,0%." },
  { date:"03.04.2026", qn:14.3, obv:36.0, qzh:25.5, qv:9.2,  ndin:190, phase:"stable", event:"", comment:"Стабильно." },
  { date:"04.04.2026", qn:14.3, obv:37.2, qzh:26.1, qv:9.7,  ndin:182, phase:"stable", event:"", comment:"После замера. 37,2%. Рост воды замедляется." },
  { date:"05.04.2026", qn:14.3, obv:37.2, qzh:26.1, qv:9.7,  ndin:182, phase:"stable", event:"", comment:"Стабильно." },
  { date:"06.04.2026", qn:14.3, obv:37.2, qzh:26.1, qv:9.7,  ndin:182, phase:"stable", event:"", comment:"Стабильно." },
  { date:"07.04.2026", qn:14.4, obv:38.0, qzh:26.6, qv:10.1, ndin:182, phase:"stable", event:"control", comment:"После замера. Обв. 38% — контрольный уровень. При росте >40% — усилить мониторинг." },
  { date:"08.04.2026", qn:14.4, obv:38.0, qzh:26.6, qv:10.1, ndin:182, phase:"stable", event:"", comment:"Подтверждается. Роста нет." },
  { date:"09.04.2026", qn:14.4, obv:38.0, qzh:26.6, qv:10.1, ndin:182, phase:"stable", event:"stabilized", comment:"СТАБИЛИЗАЦИЯ ПОДТВЕРЖДЕНА. Три дня без роста обв. Конусообразование не развивается." },
  { date:"10.04.2026", qn:14.4, obv:38.0, qzh:26.6, qv:10.1, ndin:181, phase:"stable", event:"", comment:"Режим без ухудшения." },
  { date:"11.04.2026", qn:14.4, obv:38.0, qzh:26.6, qv:10.1, ndin:181, phase:"stable", event:"", comment:"Стабильное плато." },
  { date:"12.04.2026", qn:14.4, obv:38.0, qzh:26.6, qv:10.1, ndin:181, phase:"stable", event:"", comment:"Четвёртый день — вода не растёт." },
  { date:"13.04.2026", qn:15.0, obv:38.0, qzh:27.6, qv:10.5, ndin:181, phase:"stable", event:"oilrise", comment:"РОСТ НЕФТИ БЕЗ РОСТА ВОДЫ. 14,4→15,0 т/сут. Обв. 38,0% — без изменений." },
  { date:"14.04.2026", qn:15.0, obv:38.0, qzh:27.6, qv:10.5, ndin:181, phase:"stable", event:"", comment:"Закрепление режима." },
  { date:"15.04.2026", qn:15.0, obv:38.0, qzh:27.6, qv:10.5, ndin:181, phase:"stable", event:"", comment:"Стабильная работа." },
  { date:"16.04.2026", qn:15.0, obv:38.0, qzh:27.7, qv:10.5, ndin:181, phase:"stable", event:"", comment:"Режим держится." },
  { date:"17.04.2026", qn:14.9, obv:38.0, qzh:27.5, qv:10.5, ndin:181, phase:"stable", event:"power", comment:"Отключение/переключение электроснабжения. Просадка до 14,9 т/сут. Обв. не изменилась." },
  { date:"18.04.2026", qn:15.2, obv:37.5, qzh:27.8, qv:10.4, ndin:181, phase:"stable", event:"improve", comment:"УЛУЧШЕНИЕ. Нефть 15,2 т/сут, обв. снизилась до 37,5%." },
  { date:"19.04.2026", qn:15.3, obv:37.3, qzh:27.9, qv:10.4, ndin:179, phase:"stable", event:"improve", comment:"Хороший режим. 15,3 т/сут, 37,3%. После замера — подтверждён." },
  { date:"20.04.2026", qn:15.3, obv:37.3, qzh:27.9, qv:10.4, ndin:179, phase:"stable", event:"", comment:"После замера подтверждён." },
  { date:"21.04.2026", qn:15.2, obv:37.3, qzh:27.8, qv:10.4, ndin:179, phase:"stable", event:"", comment:"Плато сохраняется." },
  { date:"22.04.2026", qn:14.9, obv:37.6, qzh:27.3, qv:10.3, ndin:167, phase:"stable", event:"", comment:"Небольшое снижение. Стабильная работа." },
  { date:"23.04.2026", qn:15.1, obv:37.5, qzh:27.7, qv:10.4, ndin:174, phase:"stable", event:"", comment:"Хороший день. Нефть >15 т/сут." },
  { date:"24.04.2026", qn:14.8, obv:37.5, qzh:27.1, qv:10.2, ndin:174, phase:"stable", event:"", comment:"После замера. Лёгкая просадка без роста воды." },
  { date:"25.04.2026", qn:14.6, obv:37.5, qzh:26.7, qv:10.0, ndin:174, phase:"stable", event:"power", comment:"Отключение электроэнергии, переход на ДЭС и обратно." },
  { date:"26.04.2026", qn:14.7, obv:37.5, qzh:27.0, qv:10.1, ndin:174, phase:"stable", event:"", comment:"Восстановление после отключения." },
  { date:"27.04.2026", qn:14.7, obv:37.5, qzh:26.9, qv:10.1, ndin:174, phase:"stable", event:"", comment:"После замера. Кратковременное отключение для ремонтных работ." },
  { date:"28.04.2026", qn:14.9, obv:37.5, qzh:27.2, qv:10.2, ndin:167, phase:"stable", event:"", comment:"Вернулась к уровню ~15 т/сут." },
  { date:"29.04.2026", qn:14.9, obv:37.6, qzh:27.3, qv:10.3, ndin:167, phase:"stable", event:"", comment:"Стабильное плато." },
  { date:"30.04.2026", qn:14.9, obv:37.6, qzh:27.3, qv:10.3, ndin:167, phase:"stable", event:"", comment:"КОНЕЦ ПЕРИОДА. Устойчивый рабочий режим. Эффект NanoCem сохраняется через 88 дней." },
];

// Константы для расчётов
const BASE_QN  = 2.6;   // базовый дебит до РИР
const BASE_OBV = 85.4;  // базовая обводнённость до РИР
const PEAK_QN  = 16.4;  // пиковый дебит (19.03)
const PEAK_OBV = 27.5;  // минимальная обводнённость (19.03)

// Цвета фаз для Chart.js
const PHASE_COLORS = {
  before: "#F97316",
  krs:    "#64748B",
  after:  "#0D9488",
  forced: "#8B5CF6",
  stable: "#22C55E",
};
```

---

## ТЕХНИЧЕСКИЙ СТЕК РЕКОМЕНДАЦИИ

```
Frontend: HTML5 + CSS3 + Vanilla JS (без фреймворка — быстро)
ИЛИ: React + Tailwind CSS + Recharts

Графики: Chart.js 4.x
  - LineChart: Qн и обводнённость (двойная ось Y)
  - BarChart: месячная добыча
  - AnnotationPlugin: маркер пика, маркер РИР

Шрифты (Google Fonts):
  - Oswald (заголовки)
  - JetBrains Mono (данные/числа)
  - IBM Plex Sans (текст)

Иконки: нет — только символы Unicode (⬡ ▼ → ✅ ⚠️)
Анимации: CSS-only (@keyframes pulse для live-dot)
```

---

## КЛЮЧЕВЫЕ КОМПОНЕНТЫ ДЛЯ РАЗРАБОТКИ

### 1. Компонент KpiCard
```javascript
// props: label, value, unit, delta, deltaDirection, color
<KpiCard label="Дебит нефти" value="14.9" unit="т/сут"
         delta="+12.3 от базы" deltaDir="up" color="green" />
```

### 2. Компонент DailyRow (таблица истории)
```javascript
// props: dateObj из WELL_343_DATA[]
// Клик → expand comment
// Цвет полосы слева = phase
```

### 3. Компонент MainChart
```javascript
// Chart.js, двойная ось
// Левая: Qн (teal, 0–18)
// Правая: Обв.% (red, 0–100)
// Вертикальная серая зона: 28.01–03.02 (КРС)
// Вертикальная оранжевая линия: 16.03 (обороты)
// Зелёный маркер: 19.03 (пик)
// Базовые пунктиры: Qн=2.6, Обв=85.4
```

### 4. Компонент RirStatusCard
```javascript
// Счётчик дней после РИР
// Вычисляется динамически от 03.02.2026
// Метрики: пик, мин.обв., рост, снижение
```

---

*Документ подготовлен для разработки сайта ежедневного мониторинга*
*Скважина 343 | М/Р Каратюбе | 15.01.2026 – 30.04.2026*
*ТОО «ЭкоМикс» | NanoCem UT-9*