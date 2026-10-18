/**
 * Выгрузка реальных данных фонда для кабинета Subsoil.
 *
 * Источники — те же файлы, что питают текущий сайт:
 *   public/wells.js      статусы и последние замеры (единый источник фонда)
 *   public/field.js      агрегаты по 73 скважинам и наши восемь поимённо
 *   public/well-*.html   суточные журналы в массивах DATA
 *
 * Результат: apps/web/src/lib/data/fund.json. Файл генерируется, правится
 * только через этот скрипт. Поскважинные данные чужих скважин сюда не
 * попадают — из field.js берутся лишь агрегаты, как и на старом сайте.
 *
 * Запуск из корня репозитория: node tools/subsoil-export.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const OUT = join(ROOT, 'apps/web/src/lib/data/fund.json');

// ── wells.js: исполняем в песочнице с заглушкой DOM ─────────────────────────
function readWells() {
  const src = readFileSync(join(PUBLIC, 'wells.js'), 'utf8');
  const sandbox = {
    window: {},
    document: {
      getElementById: () => null,
      querySelectorAll: () => [],
      createElement: () => ({}),
      head: { appendChild() {} },
      body: { getAttribute: () => '' },
      readyState: 'complete',
      addEventListener() {},
      dispatchEvent() {},
    },
    CustomEvent: function () {},
  };
  new Function('window', 'document', 'CustomEvent', src)(
    sandbox.window,
    sandbox.document,
    sandbox.CustomEvent,
  );
  return sandbox.window.WELLS;
}

function readField() {
  const src = readFileSync(join(PUBLIC, 'field.js'), 'utf8');
  return JSON.parse(src.match(/window\.FIELD = (\{.*\});/s)[1]);
}

/**
 * Суточные журналы со страниц скважин.
 *
 * Массив DATA объявлен по-разному (`const DATA = [` на одних страницах,
 * `{ d:"01.01", ... }` с пробелами на других), поэтому разбираем мягко:
 * ищем блок и вытаскиваем поля регулярками, а не парсим как JS.
 */
function readDaily(file) {
  const src = readFileSync(join(PUBLIC, file), 'utf8');
  const start = src.indexOf('DATA = [');
  if (start < 0) return [];
  const end = src.indexOf('\n];', start);
  const block = src.slice(start, end);

  const rows = [];
  for (const line of block.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('{')) continue;
    const pick = (key) => {
      const m = t.match(new RegExp(`\\b${key}\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|[-0-9.]+|null)`));
      if (!m) return null;
      const v = m[1];
      if (v === 'null') return null;
      if (v.startsWith('"')) return JSON.parse(v);
      return Number(v);
    };
    const d = pick('d');
    if (!d) continue;
    rows.push({
      d,
      qzh: pick('qzh'),
      qn: pick('qn'),
      obv: pick('obv'),
      qv: pick('qv'),
      ndin: pick('ndin'),
      phase: pick('phase'),
      ev: pick('ev') || null,
      comment: pick('comment') || '',
    });
  }
  return rows;
}

// ── сборка ──────────────────────────────────────────────────────────────────
const wells = readWells();
const field = readField();

const pages = readdirSync(PUBLIC).filter((f) => /^well-\d+\.html$/.test(f));
const daily = {};
for (const page of pages) {
  const id = page.match(/^well-(\d+)\.html$/)[1];
  daily[id] = readDaily(page);
}

/** Год по дате вида «13.10» — журналы ведутся в пределах одного года. */
const YEAR = Number((wells.updated.match(/(\d{4})$/) || [])[1] ?? new Date().getFullYear());

function toIso(ddmm) {
  const [d, m] = ddmm.split('.');
  return `${YEAR}-${m}-${d}`;
}

const out = {
  /** Пометка источника: данные настоящие, выгружены из файлов сайта. */
  source: 'nanocem.app · public/wells.js + field.js + страницы скважин',
  generatedAt: new Date().toISOString(),
  updated: wells.updated,
  fieldUpdated: field.updated,

  fund: {
    wellsTotal: field.wellsTotal,
    measured: field.measured,
    series: field.series,
    dist: field.dist,
    horizons: field.horizons,
    effect: field.effect,
    ours: field.ours,
  },

  wells: wells.wells.map((w) => ({
    id: w.id,
    title: w.title,
    status: w.status,
    last: w.last,
    stats: w.stats,
    note: w.note,
    seal: w.seal,
    daily: (daily[w.id] ?? []).map((r) => ({ ...r, date: toIso(r.d) })),
  })),
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 0) + '\n', 'utf8');

// ── программа UT-9 со страницы plan.html ────────────────────────────────────
const plan = readFileSync(join(PUBLIC, 'plan.html'), 'utf8');

const scenarios = {};
const scenBlock = plan.slice(plan.indexOf('const SCEN = {'), plan.indexOf('const WELLS = ['));
for (const m of scenBlock.matchAll(
  /(s\d):\s*\{\s*name:'([^']*)',\s*text:'([^']*)',\s*fit:'([^']*)'/gs,
)) {
  scenarios[m[1]] = { name: m[2], text: m[3], fit: m[4] };
}

const wellsStart = plan.indexOf('const WELLS = [');
const wellsBlock = plan.slice(wellsStart, plan.indexOf('\n];', wellsStart));
const candidates = [...wellsBlock.matchAll(
  /\{w:'([^']*)',\s*m:'(\d+)',\s*d:(\d),\s*sc:'(s\d)',\s*obj:'([^']*)'\}/g,
)].map((m) => ({ well: m[1], month: m[2], decade: Number(m[3]), scenario: m[4], object: m[5] }));

const program = {
  months: { '08': 'Август', '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь' },
  decades: ['I', 'II', 'III'],
  scenarios,
  candidates,
  note:
    'Перечень носит аналитический характер и подготовлен ТОО «ЭкоМикс» для планирования ' +
    'поставок цемента NanoCem UT-9. Периоды указаны ориентировочно, с точностью до декады, ' +
    'и подлежат уточнению. Решение о проведении работ, их очерёдности и составе программы ' +
    'принимает недропользователь.',
};
writeFileSync(join(dirname(OUT), 'program.json'), JSON.stringify(program) + '\n', 'utf8');
console.log(`program.json: ${candidates.length} кандидатов, ${Object.keys(scenarios).length} сценария`);

const days = out.wells.reduce((s, w) => s + w.daily.length, 0);
const measured = out.wells.reduce((s, w) => s + w.daily.filter((r) => r.qn !== null).length, 0);
console.log(
  `fund.json: ${out.wells.length} скважин, ${days} суток журнала (с замером ${measured}), ` +
    `фонд ${field.wellsTotal} скважин на ${field.updated}, ${(JSON.stringify(out).length / 1024).toFixed(0)} КБ`,
);
