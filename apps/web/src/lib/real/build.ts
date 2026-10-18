/**
 * Ответы API из РЕАЛЬНЫХ данных фонда.
 *
 * Источник — apps/web/src/lib/data/fund.json, выгруженный из файлов сайта
 * скриптом tools/subsoil-export.mjs. Показатели промысла здесь настоящие.
 *
 * Требования (обязательства и отчётность) настоящими пока быть не могут:
 * они живут в ERP на отдельном бэкенде, который ещё не подключён. Поэтому
 * они приходят из демо-набора и помечены как демо — и в API, и на экране.
 */
import {
  delta,
  holdingProductionSchema,
  holdingRequirementsSchema,
  holdingSummarySchema,
  scopeTreeSchema,
  totalJobEffect,
  weightedWaterCut,
  worstLevel,
  type AssetRow,
  type AttentionItem,
  type HoldingProduction,
  type HoldingRequirements,
  type HoldingSummary,
  type Level,
  type Measurement,
  type ProductionMetric,
  type Scope,
  type ScopeTree,
} from '@subsoil/shared';
import fund from '@/lib/data/fund.json';
import { buildRequirements as buildDemoRequirements } from '@/lib/demo/build';

/** Единственная компания и единственное месторождение, пока холдинг один. */
export const HOLDING = { id: 'h-ecomix', name: 'ЭкоМикс' } as const;
export const COMPANY = { id: 'c-ecomix', name: 'ТОО «ЭкоМикс»' } as const;
/**
 * Название месторождения на экранах не раскрывается — только горизонт.
 * Так же сделано на публичном сайте (CLAUDE.md, раздел «Терминология»).
 */
export const FIELD = { id: 'f-j1iv', name: 'Фонд · горизонт J1-IV' } as const;

/**
 * Плотность нефти, т/м³.
 *
 * Выведена из самих журналов: там, где в сутках есть и Qн, и Qж, и
 * обводнённость, отношение Qн / (Qж × (1 − W/100)) даёт 0,874 устойчиво
 * по шести скважинам и 1257 суткам. Нужна, чтобы восстановить Qж по 303
 * и 342 — в их журналах отбор жидкости не записан.
 */
const OIL_DENSITY = 0.874;

type Daily = (typeof fund.wells)[number]['daily'][number];

const asOf = isoFromDdMm(fund.updated);

/** «13.10.2026» → ISO с поясом Актобе на 06:00, как в снимке сводки. */
function isoFromDdMm(s: string): string {
  const [d, m, y] = s.split('.');
  return `${y}-${m}-${d}T06:00:00+05:00`;
}

/** Отбор жидкости: из журнала, а если его там нет — через плотность. */
function liquidOf(r: Daily): number | null {
  if (r.qzh !== null) return r.qzh;
  if (r.qn === null || r.obv === null || r.obv >= 100) return null;
  return r.qn / ((1 - r.obv / 100) * OIL_DENSITY);
}

function measurementOf(r: Daily): Measurement | null {
  const liq = liquidOf(r);
  if (liq === null || r.obv === null) return null;
  return { liquidM3Day: liq, waterCutPct: r.obv, oilDensity: OIL_DENSITY };
}

/** Сутки с замером, по возрастанию даты. */
function measuredDays(wellId: string): Daily[] {
  const w = fund.wells.find((x) => x.id === wellId);
  return (w?.daily ?? []).filter((r) => r.qn !== null);
}

/** Разрыв между сутками, при котором замеры ещё считаются соседними. */
const MAX_GAP_DAYS = 3;

function daysBetween(a: string, b: string): number {
  return Math.abs(Date.parse(a) - Date.parse(b)) / 86_400_000;
}

/**
 * Последний замер и предыдущий — но предыдущий возвращается, только если
 * он действительно вчерашний (с запасом в пару суток на пропуски в листах).
 *
 * Иначе сравнение врёт: 363 запущена 13.10, а до этого стояла четыре месяца,
 * и разница с её последним дорабочим замером — не «изменение за сутки».
 */
function lastTwo(wellId: string): { today: Daily | null; prev: Daily | null } {
  const rows = measuredDays(wellId);
  const today = rows.at(-1) ?? null;
  const before = rows.at(-2) ?? null;
  if (!today || !before) return { today, prev: null };
  return { today, prev: daysBetween(today.date, before.date) <= MAX_GAP_DAYS ? before : null };
}

/**
 * Заходы UT-9 с задокументированной базой.
 *
 * Значения «до» — те же, что на страницах скважин и в расчёте вклада в фонд
 * (tools/mkfield.py). По 301 дореремонтного замера в сопоставимом режиме нет,
 * по 305 сменён объект — они в оценку эффекта не входят, но в число заходов
 * входят: работы выполнены.
 */
const JOBS: { well: string; date: string; oilBefore: number | null; oilAfter: number | null }[] = [
  { well: '343', date: '2026-01-29', oilBefore: 1.1, oilAfter: 10.4 },
  { well: '342', date: '2026-05-31', oilBefore: 2.32, oilAfter: 8.1 },
  { well: '301', date: '2026-06-06', oilBefore: null, oilAfter: null },
  { well: '311', date: '2026-07-09', oilBefore: 6.31, oilAfter: 3.16 },
  { well: '303', date: '2026-07-13', oilBefore: 1.37, oilAfter: 2.0 },
  { well: '305', date: '2026-07-18', oilBefore: null, oilAfter: null },
  { well: '357', date: '2026-09-24', oilBefore: 1.5, oilAfter: 3.95 },
  { well: '363', date: '2026-10-10', oilBefore: 0.46, oilAfter: null },
];

/** Итог герметизации «успешен» — это коды, где изоляция держит. */
const SUCCESS_CODES = new Set(['first', 'second', 'confirmed', 'tested']);

const SEAL_LEVEL: Record<string, Level> = {
  first: 'ok',
  second: 'ok',
  confirmed: 'ok',
  tested: 'ok',
  fresh: 'warn',
  wait: 'warn',
  lost: 'crit',
  open: 'crit',
};

// ── показатели ──────────────────────────────────────────────────────────────

/**
 * Срез фонда на последний замер.
 *
 * Сами показатели берутся по всем работающим скважинам, а дельта к вчера —
 * только по тем, у которых есть замер и сегодня, и вчера. Иначе смена состава
 * группы (скважина вышла из ремонта) показывалась бы как изменение добычи,
 * хотя в пласте ничего не произошло.
 */
function fundToday() {
  const now: Measurement[] = [];
  const cmpNow: Measurement[] = [];
  const cmpPrev: Measurement[] = [];
  let oil = 0;
  let cmpOil = 0;
  let cmpOilPrev = 0;
  let working = 0;
  let compared = 0;

  for (const w of fund.wells) {
    const { today, prev: yd } = lastTwo(w.id);
    if (!today || today.qn === null) continue;

    oil += today.qn;
    working += 1;
    const m = measurementOf(today);
    if (m) now.push(m);

    if (yd && yd.qn !== null) {
      compared += 1;
      cmpOil += today.qn;
      cmpOilPrev += yd.qn;
      if (m) cmpNow.push(m);
      const mp = measurementOf(yd);
      if (mp) cmpPrev.push(mp);
    }
  }

  const liquid = now.reduce((s, m) => s + m.liquidM3Day, 0);

  return {
    oil,
    liquid,
    waterCut: weightedWaterCut(now),
    working,
    total: fund.wells.length,
    /** Дельты — по сопоставимому составу скважин. */
    deltaOil: compared > 0 ? cmpOil - cmpOilPrev : null,
    deltaLiquid:
      compared > 0
        ? cmpNow.reduce((s, m) => s + m.liquidM3Day, 0) - cmpPrev.reduce((s, m) => s + m.liquidM3Day, 0)
        : null,
    deltaWaterPp:
      compared > 0 ? delta(weightedWaterCut(cmpNow), weightedWaterCut(cmpPrev)) : null,
    compared,
  };
}

function wellRow(w: (typeof fund.wells)[number]): AssetRow {
  const { today, prev } = lastTwo(w.id);
  const oil = today?.qn ?? null;
  const oilPrev = prev?.qn ?? null;
  const sealLevel = SEAL_LEVEL[w.seal.code] ?? 'none';

  return {
    companyId: COMPANY.id,
    companyName: COMPANY.name,
    fieldId: FIELD.id,
    name: w.title,
    href: `/app/field/wells/${w.id}`,
    oil,
    deltaDay: delta(oil, oilPrev),
    waterCut: today?.obv ?? null,
    fund: w.status.label,
    planPct: null,
    requirementsStatus: sealLevel === 'crit' ? 'crit' : sealLevel === 'warn' ? 'warn' : 'ok',
    requirementsNote: w.seal.label,
    nextDue: null,
    status: sealLevel,
  };
}

function fieldRow(): AssetRow {
  const t = fundToday();
  const worst = worstLevel(fund.wells.map((w) => SEAL_LEVEL[w.seal.code] ?? 'none'));
  const lost = fund.wells.filter((w) => (SEAL_LEVEL[w.seal.code] ?? 'none') === 'crit').length;

  return {
    companyId: COMPANY.id,
    companyName: COMPANY.name,
    fieldId: FIELD.id,
    name: FIELD.name,
    href: `/app/c/${COMPANY.id}/f/${FIELD.id}`,
    oil: t.oil,
    deltaDay: t.deltaOil,
    waterCut: t.waterCut,
    fund: `${t.working}/${t.total}`,
    planPct: null,
    requirementsStatus: worst === 'crit' ? 'crit' : worst === 'warn' ? 'warn' : 'ok',
    requirementsNote: lost > 0 ? `${lost} без эффекта` : 'эффект держится',
    nextDue: null,
    status: worst,
  };
}

/** «Внимание сегодня» по тем же правилам, что в 03-holding-dashboard.md. */
function attention(): AttentionItem[] {
  const items: AttentionItem[] = [];

  const lostWells = fund.wells.filter((w) => w.seal.code === 'lost');
  if (lostWells.length > 0) {
    items.push({
      level: 'critical',
      code: 'ut9_effect_lost',
      text: `Эффект изоляции утрачен: ${lostWells.map((w) => w.id).join(', ')}`,
      link: '/app/nanocem/sealing',
    });
  }

  for (const w of fund.wells) {
    const { today: t, prev } = lastTwo(w.id);
    if (!t || !prev || t.obv === null || prev.obv === null) continue;
    if (t.obv - prev.obv > 5) {
      items.push({
        level: 'warning',
        code: 'water_jump',
        text: `${w.title}: обводнённость выросла на ${(t.obv - prev.obv).toFixed(1)} п.п. за сутки`,
        link: `/app/field/wells/${w.id}`,
      });
    }
  }

  const fresh = fund.wells.filter((w) => w.seal.code === 'fresh');
  for (const w of fresh) {
    items.push({
      level: 'warning',
      code: 'job_pending',
      text: `${w.title}: заход выполнен, оценки ещё нет — идёт вывод на режим`,
      link: `/app/field/wells/${w.id}`,
    });
  }

  const waiting = fund.wells.filter((w) => w.seal.code === 'wait');
  for (const w of waiting) {
    items.push({
      level: 'warning',
      code: 'job_rollback',
      text: `${w.title}: ${w.seal.label.toLowerCase()}`,
      link: `/app/field/wells/${w.id}`,
    });
  }

  // Требования — из демо-набора, пока ERP не подключён.
  const demo = buildDemoRequirements('holding', null, 30);
  if (demo.overdue > 0) {
    items.push({
      level: 'critical',
      code: 'obligation_overdue',
      text: `${demo.overdue} обязательства просрочены (демо-данные)`,
      link: '/app/subsoil/obligations?status=overdue',
    });
  }
  return items.slice(0, 8);
}

const RANK: Record<Level, number> = { crit: 0, warn: 1, ok: 2, none: 3 };

export function buildSummary(scope: Scope, id: string | null): HoldingSummary {
  const t = fundToday();
  const demo = buildDemoRequirements('holding', null, 30);

  const assets = scope === 'field' ? fund.wells.map(wellRow) : [fieldRow()];
  assets.sort((a, b) => RANK[a.status] - RANK[b.status] || (b.oil ?? -1) - (a.oil ?? -1));

  const jobsWithResult = JOBS.filter((j) => j.oilAfter !== null);

  return holdingSummarySchema.parse({
    asOf,
    scope,
    scopeId: id,
    scopeName:
      scope === 'field' ? FIELD.name : scope === 'company' ? COMPANY.name : HOLDING.name,
    kpi: {
      oilTDay: { value: t.oil, deltaDay: t.deltaOil, planPct: null },
      liquidM3Day: { value: t.liquid, deltaDay: t.deltaLiquid },
      waterCutPct: { value: t.waterCut, deltaDayPp: t.deltaWaterPp },
      fund: { working: t.working, total: t.total, stopped: t.total - t.working },
      requirements: { overdue: demo.overdue, next30d: demo.next30d },
    },
    attention: attention(),
    assets,
    nanocem: {
      jobs: JOBS.length,
      successful: fund.wells.filter((w) => SUCCESS_CODES.has(w.seal.code)).length,
      oilGainTDay: totalJobEffect(jobsWithResult),
      lastJobDate: JOBS.map((j) => j.date).sort().at(-1) ?? null,
    },
  });
}

/** Ряд добычи: настоящие суточные замеры, план не ведётся — отдаём null. */
export function buildProduction(
  scope: Scope,
  id: string | null,
  metric: ProductionMetric,
  days = 90,
): HoldingProduction {
  const byDate = new Map<string, { oil: number; liq: number; water: number; n: number }>();

  for (const w of fund.wells) {
    for (const r of w.daily) {
      if (r.qn === null) continue;
      const liq = liquidOf(r);
      const acc = byDate.get(r.date) ?? { oil: 0, liq: 0, water: 0, n: 0 };
      acc.oil += r.qn;
      if (liq !== null && r.obv !== null) {
        acc.liq += liq;
        acc.water += (liq * r.obv) / 100;
      }
      acc.n += 1;
      byDate.set(r.date, acc);
    }
  }

  const dates = [...byDate.keys()].sort().slice(-days);
  const points = dates.map((date) => {
    const a = byDate.get(date)!;
    const fact =
      metric === 'oil'
        ? round(a.oil, 2)
        : metric === 'liquid'
          ? round(a.liq, 1)
          : a.liq > 0
            ? round((a.water / a.liq) * 100, 1)
            : null;
    return { date, fact, plan: null };
  });

  const from = points[0]?.date ?? '';
  const markers = JOBS.filter((j) => j.date >= from).map((j) => ({
    date: j.date,
    label: `UT-9 · ${j.well}`,
    kind: 'nanocem_job' as const,
    href: `/app/field/wells/${j.well}`,
  }));

  return holdingProductionSchema.parse({
    scope,
    scopeId: id,
    metric,
    unit: metric === 'oil' ? 'т/сут' : metric === 'liquid' ? 'м³/сут' : '%',
    from,
    to: points.at(-1)?.date ?? '',
    points,
    markers,
  });
}

/** Требования — пока демо: ERP с контрактами ещё не подключён. */
export function buildRequirements(_scope: Scope, _id: string | null, days = 30): HoldingRequirements {
  return holdingRequirementsSchema.parse(buildDemoRequirements('holding', null, days));
}

export function buildScopeTree(): ScopeTree {
  return scopeTreeSchema.parse({
    holding: { id: HOLDING.id, name: HOLDING.name },
    companies: [{ id: COMPANY.id, name: COMPANY.name, fields: [{ id: FIELD.id, name: FIELD.name }] }],
  });
}

// ── данные для страниц фонда ────────────────────────────────────────────────

export interface WellCard {
  id: string;
  title: string;
  statusLabel: string;
  statusDetail: string;
  level: Level;
  seal: { code: string; label: string; date: string; zone: string; note: string; entries: string; qobv: string };
  note: string;
  stats: [string, string][];
  last: { date: string; qn: string; obv: string; qzh: string };
  daily: Daily[];
}

export function listWells(): WellCard[] {
  return fund.wells.map((w) => ({
    id: w.id,
    title: w.title,
    statusLabel: w.status.label,
    statusDetail: w.status.detail,
    level: SEAL_LEVEL[w.seal.code] ?? 'none',
    seal: w.seal,
    note: w.note,
    stats: w.stats as [string, string][],
    last: w.last,
    daily: w.daily,
  }));
}

export function getWell(id: string): WellCard | null {
  return listWells().find((w) => w.id === id) ?? null;
}

/** Агрегаты фонда из field.js: 73 скважины, только суммы и доли. */
export function getFundAnalytics() {
  return {
    updated: fund.fieldUpdated,
    ...fund.fund,
  };
}

export function getJobs() {
  return JOBS.map((j) => {
    const w = fund.wells.find((x) => x.id === j.well);
    return {
      ...j,
      title: w?.title ?? `Скважина ${j.well}`,
      seal: w?.seal ?? null,
      gain: j.oilBefore !== null && j.oilAfter !== null ? j.oilAfter - j.oilBefore : null,
    };
  });
}

export const FUND_META = {
  updated: fund.updated,
  fieldUpdated: fund.fieldUpdated,
  source: fund.source,
  oilDensity: OIL_DENSITY,
};

function round(v: number, digits: number): number {
  const k = 10 ** digits;
  return Math.round(v * k) / k;
}
