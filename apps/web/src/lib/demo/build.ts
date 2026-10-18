/**
 * Сборка ответов API из ДЕМО-данных.
 *
 * Считает теми же формулами, что и будущий сервер: всё из @subsoil/shared,
 * ничего локального. Результат проверяется zod-схемами — если демо разойдётся
 * с контрактом 06-api.md, это упадёт здесь, а не на экране.
 */
import {
  daysUntil,
  delta,
  holdingProductionSchema,
  holdingRequirementsSchema,
  holdingSummarySchema,
  oilFromMeasurement,
  planPct,
  planToDate,
  requirementLevel,
  requirementStatus,
  scopeTreeSchema,
  totalJobEffect,
  totalLiquid,
  totalOil,
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
  type Requirement,
  type Scope,
  type ScopeTree,
} from '@subsoil/shared';
import {
  COMMANDS,
  COMPANIES,
  DEMO_AS_OF,
  FIELDS,
  HOLDING,
  JOBS,
  REQUIREMENTS,
  type DemoField,
} from './data';

const ASOF = new Date(DEMO_AS_OF);

/** Пороги правил «Внимание сегодня» (03-holding-dashboard.md, 2.1). */
const THRESHOLDS = {
  waterJumpPp: 5,
  oilDropPct: -20,
  reportSoonDays: 7,
  contractSoonDays: 90,
  planPct: 90,
  commandStaleHours: 24,
} as const;

const measurementsOf = (f: DemoField): Measurement[] =>
  f.wells
    .filter((w) => w.status === 'working')
    .map((w) => ({ liquidM3Day: w.liquidM3Day, waterCutPct: w.waterCutPct, oilDensity: f.oilDensity }));

const prevMeasurementsOf = (f: DemoField): Measurement[] =>
  f.wells
    .filter((w) => w.prevLiquidM3Day > 0)
    .map((w) => ({ liquidM3Day: w.prevLiquidM3Day, waterCutPct: w.prevWaterCutPct, oilDensity: f.oilDensity }));

function fieldsFor(scope: Scope, id: string | null): DemoField[] {
  if (scope === 'field') return FIELDS.filter((f) => f.id === id);
  if (scope === 'company') return FIELDS.filter((f) => f.companyId === id);
  return FIELDS;
}

function companyName(companyId: string): string {
  return COMPANIES.find((c) => c.id === companyId)?.name ?? 'Компания';
}

/** План на месяц к сегодняшнему дню — для % выполнения. */
function planToToday(fields: readonly DemoField[]): number | null {
  const day = ASOF.getUTCDate();
  const daysInMonth = new Date(Date.UTC(ASOF.getUTCFullYear(), ASOF.getUTCMonth() + 1, 0)).getUTCDate();
  const parts = fields
    .map((f) => planToDate(f.monthPlanT, day, daysInMonth))
    .filter((v): v is number => v !== null);
  if (parts.length === 0) return null;
  return parts.reduce((a, b) => a + b, 0);
}

/**
 * Факт месяца к дате. В демо берём сегодняшний суточный дебит × прошедшие сутки:
 * это заведомо грубо, и ради честности то же допущение названо в подписи
 * к карточке плана на экране.
 */
function factToToday(fields: readonly DemoField[]): number | null {
  const oil = totalOil(fields.flatMap(measurementsOf));
  if (oil === null) return null;
  return oil * ASOF.getUTCDate();
}

function requirementsIn(scope: Scope, id: string | null) {
  return REQUIREMENTS.filter((r) => {
    if (scope === 'company') return r.companyId === id;
    if (scope === 'field') return r.fieldId === id;
    return true;
  }).map((r) => {
    const status = requirementStatus(new Date(r.dueDate), ASOF, {
      doneAt: r.doneAt ? new Date(r.doneAt) : null,
    });
    return { ...r, status, level: requirementLevel(status) };
  });
}

function scopeName(scope: Scope, id: string | null): string {
  if (scope === 'company') return companyName(id ?? '');
  if (scope === 'field') return FIELDS.find((f) => f.id === id)?.name ?? 'Месторождение';
  return HOLDING.name;
}

// ── Внимание сегодня ────────────────────────────────────────────────────────

function buildAttention(scope: Scope, id: string | null): AttentionItem[] {
  const fields = fieldsFor(scope, id);
  const reqs = requirementsIn(scope, id);
  const items: AttentionItem[] = [];

  const overdue = reqs.filter((r) => r.status === 'overdue');
  if (overdue.length > 0) {
    items.push({
      level: 'critical',
      code: 'obligation_overdue',
      text: `${overdue.length} ${plural(overdue.length, 'обязательство просрочено', 'обязательства просрочены', 'обязательств просрочено')}`,
      link: '/app/subsoil/obligations?status=overdue',
    });
  }

  const soon = reqs.filter(
    (r) => r.status === 'due_soon' && daysUntil(new Date(r.dueDate), ASOF) <= THRESHOLDS.reportSoonDays,
  );
  for (const r of soon.slice(0, 2)) {
    const left = daysUntil(new Date(r.dueDate), ASOF);
    items.push({
      level: 'warning',
      code: 'report_due_soon',
      text: `${r.title} — срок ${fmtDay(r.dueDate)} (${left} дн.)`,
      link: `/app/subsoil/obligations?id=${r.id}`,
    });
  }

  // Рост обводнённости по скважине за сутки.
  const jumps = fields.flatMap((f) =>
    f.wells
      .filter((w) => w.status === 'working' && w.prevLiquidM3Day > 0)
      .filter((w) => w.waterCutPct - w.prevWaterCutPct > THRESHOLDS.waterJumpPp)
      .map((w) => ({ field: f, well: w })),
  );
  if (jumps.length > 0) {
    items.push({
      level: 'warning',
      code: 'water_jump',
      text: `${jumps.length} ${plural(jumps.length, 'скважина', 'скважины', 'скважин')} с ростом воды более ${THRESHOLDS.waterJumpPp} п.п. за сутки`,
      link: '/app/field/water-cut',
    });
  }

  const stopped = fields.flatMap((f) => f.wells.filter((w) => w.status === 'stopped'));
  if (stopped.length > 0) {
    items.push({
      level: 'warning',
      code: 'well_stopped',
      text: `${stopped.length} ${plural(stopped.length, 'скважина в простое', 'скважины в простое', 'скважин в простое')} более суток`,
      link: '/app/field/wells?status=stopped',
    });
  }

  const staleCommands = COMMANDS.filter((c) => c.status !== 'done').filter(
    (c) => (ASOF.getTime() - new Date(c.createdAt).getTime()) / 3_600_000 > THRESHOLDS.commandStaleHours,
  );
  if (staleCommands.length > 0) {
    items.push({
      level: 'warning',
      code: 'command_stale',
      text: `${staleCommands.length} ${plural(staleCommands.length, 'команда не исполнена', 'команды не исполнены', 'команд не исполнено')} более 24 ч`,
      link: '/app/field/commands',
    });
  }

  return items.slice(0, 8);
}

// ── Строки таблицы активов ──────────────────────────────────────────────────

function fieldRow(f: DemoField): AssetRow {
  const now = measurementsOf(f);
  const prev = prevMeasurementsOf(f);
  const oil = totalOil(now);
  const oilPrev = totalOil(prev);
  const wc = weightedWaterCut(now);
  const working = f.wells.filter((w) => w.status === 'working').length;

  const reqs = requirementsIn('field', f.id);
  const overdue = reqs.filter((r) => r.status === 'overdue').length;
  const soon = reqs.filter((r) => r.status === 'due_soon').length;
  const next = reqs
    .filter((r) => r.status !== 'done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  const reqLevel: Level = overdue > 0 ? 'crit' : soon > 0 ? 'warn' : 'ok';
  const pp = planPct(factToToday([f]), planToToday([f]));
  const planLevel: Level = pp === null ? 'none' : pp < THRESHOLDS.planPct ? 'warn' : 'ok';
  const stoppedLevel: Level = f.wells.some((w) => w.status === 'stopped') ? 'warn' : 'ok';

  return {
    companyId: f.companyId,
    companyName: companyName(f.companyId),
    fieldId: f.id,
    name: f.name,
    href: `/app/c/${f.companyId}/f/${f.id}`,
    oil,
    deltaDay: delta(oil, oilPrev),
    waterCut: wc,
    fund: `${working}/${f.wells.length}`,
    planPct: pp,
    requirementsStatus: reqLevel === 'crit' ? 'crit' : reqLevel === 'warn' ? 'warn' : 'ok',
    requirementsNote: overdue > 0 ? `${overdue} просроч.` : soon > 0 ? `${soon} в 30 дн.` : 'ок',
    nextDue: next?.dueDate ?? null,
    status: worstLevel([reqLevel, planLevel, stoppedLevel]),
  };
}

/** Строка-скважина для уровня месторождения. */
function wellRows(f: DemoField): AssetRow[] {
  return f.wells.map((w) => {
    const m: Measurement = { liquidM3Day: w.liquidM3Day, waterCutPct: w.waterCutPct, oilDensity: f.oilDensity };
    const prev: Measurement = { liquidM3Day: w.prevLiquidM3Day, waterCutPct: w.prevWaterCutPct, oilDensity: f.oilDensity };
    const oil = w.status === 'working' ? oilFromMeasurement(m) : null;
    const oilPrev = w.prevLiquidM3Day > 0 ? oilFromMeasurement(prev) : null;
    const jump = w.status === 'working' && w.prevLiquidM3Day > 0 && w.waterCutPct - w.prevWaterCutPct > THRESHOLDS.waterJumpPp;
    const status: Level = w.status === 'stopped' ? 'crit' : jump ? 'warn' : 'ok';

    return {
      companyId: f.companyId,
      companyName: companyName(f.companyId),
      fieldId: f.id,
      name: w.name,
      href: `/app/field/wells/${w.id}`,
      oil,
      deltaDay: delta(oil, oilPrev),
      waterCut: w.status === 'working' ? w.waterCutPct : null,
      fund: w.status === 'working' ? 'в работе' : 'простой',
      planPct: null,
      requirementsStatus: 'ok' as const,
      requirementsNote: w.note ?? '—',
      nextDue: null,
      status,
    };
  });
}

const RANK: Record<Level, number> = { crit: 0, warn: 1, ok: 2, none: 3 };

// ── Ответы API ──────────────────────────────────────────────────────────────

export function buildSummary(scope: Scope, id: string | null): HoldingSummary {
  const fields = fieldsFor(scope, id);
  const now = fields.flatMap(measurementsOf);
  const prev = fields.flatMap(prevMeasurementsOf);

  const oil = totalOil(now);
  const liquid = totalLiquid(now);
  const wc = weightedWaterCut(now);

  const wells = fields.flatMap((f) => f.wells);
  const working = wells.filter((w) => w.status === 'working').length;

  const reqs = requirementsIn(scope, id);
  const jobs = JOBS.filter((j) => fields.some((f) => f.id === j.fieldId));

  const assets =
    scope === 'field' && fields[0]
      ? wellRows(fields[0])
      : fields.map(fieldRow);

  assets.sort((a, b) => RANK[a.status] - RANK[b.status] || (b.oil ?? -1) - (a.oil ?? -1));

  const payload: HoldingSummary = {
    asOf: DEMO_AS_OF,
    scope,
    scopeId: id,
    scopeName: scopeName(scope, id),
    kpi: {
      oilTDay: {
        value: oil,
        deltaDay: delta(oil, totalOil(prev)),
        planPct: planPct(factToToday(fields), planToToday(fields)),
      },
      liquidM3Day: { value: liquid, deltaDay: delta(liquid, totalLiquid(prev)) },
      waterCutPct: { value: wc, deltaDayPp: delta(wc, weightedWaterCut(prev)) },
      fund: { working, total: wells.length, stopped: wells.length - working },
      requirements: {
        overdue: reqs.filter((r) => r.status === 'overdue').length,
        next30d: reqs.filter((r) => r.status === 'due_soon').length,
      },
    },
    attention: buildAttention(scope, id),
    assets,
    nanocem: {
      jobs: jobs.length,
      successful: jobs.filter((j) => j.result === 'success').length,
      oilGainTDay: totalJobEffect(jobs),
      lastJobDate: jobs.map((j) => j.jobDate).sort().at(-1) ?? null,
    },
  };

  return holdingSummarySchema.parse(payload);
}

/**
 * Ряд добычи за 90 дней.
 *
 * Детерминированный псевдослучайный шум: график не должен прыгать при каждом
 * рендере, иначе невозможно сравнить два скриншота.
 */
export function buildProduction(
  scope: Scope,
  id: string | null,
  metric: ProductionMetric,
  days = 90,
): HoldingProduction {
  const fields = fieldsFor(scope, id);
  const base =
    metric === 'oil'
      ? totalOil(fields.flatMap(measurementsOf))
      : metric === 'liquid'
        ? totalLiquid(fields.flatMap(measurementsOf))
        : weightedWaterCut(fields.flatMap(measurementsOf));

  const daysInMonth = new Date(Date.UTC(ASOF.getUTCFullYear(), ASOF.getUTCMonth() + 1, 0)).getUTCDate();
  const planDay =
    metric === 'oil'
      ? fields.reduce((s, f) => s + f.monthPlanT, 0) / daysInMonth
      : null;

  const points: { date: string; fact: number | null; plan: number | null }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(ASOF.getTime() - i * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    let fact: number | null = null;
    if (base !== null) {
      // Плавный тренд + мелкая рябь, оба от номера дня — значит воспроизводимы.
      const t = (days - i) / days;
      const trend = metric === 'water_cut' ? 1 + 0.03 * t : 0.82 + 0.18 * t;
      const ripple = 1 + 0.015 * Math.sin(i * 1.7);
      fact = round(base * trend * ripple, metric === 'water_cut' ? 1 : 2);
    }
    points.push({ date: iso, fact, plan: planDay === null ? null : round(planDay, 2) });
  }

  const markers = JOBS.filter((j) => fields.some((f) => f.id === j.fieldId))
    .filter((j) => j.jobDate >= (points[0]?.date ?? ''))
    .map((j) => ({
      date: j.jobDate,
      label: `UT-9 · ${j.wellName}`,
      kind: 'nanocem_job' as const,
      href: `/app/nanocem/jobs/${j.id}`,
    }));

  return holdingProductionSchema.parse({
    scope,
    scopeId: id,
    metric,
    unit: metric === 'oil' ? 'т/сут' : metric === 'liquid' ? 'м³/сут' : '%',
    from: points[0]?.date ?? '',
    to: points.at(-1)?.date ?? '',
    points,
    markers,
  });
}

export function buildRequirements(scope: Scope, id: string | null, days = 30): HoldingRequirements {
  const all = requirementsIn(scope, id);
  const items: Requirement[] = all
    .filter((r) => {
      if (r.status === 'overdue') return true;
      if (r.status === 'done') return false;
      return daysUntil(new Date(r.dueDate), ASOF) <= days;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((r) => ({
      id: r.id,
      kind: r.kind,
      dueDate: r.dueDate,
      companyId: r.companyId,
      companyName: companyName(r.companyId),
      fieldId: r.fieldId,
      contractId: r.contractId,
      contractNumber: r.contractNumber,
      title: r.title,
      authority: r.authority,
      owner: r.owner,
      status: r.status,
      href: `/app/subsoil/obligations?id=${r.id}`,
    }));

  return holdingRequirementsSchema.parse({
    scope,
    scopeId: id,
    days,
    overdue: all.filter((r) => r.status === 'overdue').length,
    next30d: all.filter((r) => r.status === 'due_soon').length,
    items,
  });
}

export function buildScopeTree(): ScopeTree {
  return scopeTreeSchema.parse({
    holding: { id: HOLDING.id, name: HOLDING.name },
    companies: COMPANIES.map((c) => ({
      id: c.id,
      name: c.name,
      fields: FIELDS.filter((f) => f.companyId === c.id).map((f) => ({ id: f.id, name: f.name })),
    })),
  });
}

// ── мелочи ──────────────────────────────────────────────────────────────────

function round(v: number, digits: number): number {
  const k = 10 ** digits;
  return Math.round(v * k) / k;
}

function fmtDay(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}
