/**
 * Формулы показателей Subsoil.
 *
 * Единственное место, где они живут: веб и API импортируют отсюда (CLAUDE.md, п. 4).
 * Каждая функция терпима к пустым данным и делению на ноль — возвращает null,
 * а не NaN/Infinity, чтобы экран показал «—», а не мусор.
 */

/** Замер по скважине — минимум, нужный для расчёта показателей. */
export interface Measurement {
  /** Дебит жидкости, м³/сут. */
  liquidM3Day: number;
  /** Обводнённость, % (0–100). */
  waterCutPct: number;
  /** Плотность нефти, т/м³ — из справочника месторождения. */
  oilDensity: number;
}

/** Статус обязательства или отчёта. */
export type RequirementStatus = 'done' | 'overdue' | 'due_soon' | 'planned';

/** Светофор строки или объекта. */
export type Level = 'ok' | 'warn' | 'crit' | 'none';

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/**
 * Нефть из замера: Q_oil = Q_liq × (1 − W/100) × ρ.
 *
 * Обводнённость за пределами 0–100 обрезается: в режимных листах встречаются
 * 100,4% и −0,2% от округления, и они не должны давать отрицательную нефть.
 */
export function oilFromMeasurement(m: Measurement): number | null {
  if (!isNum(m.liquidM3Day) || !isNum(m.waterCutPct) || !isNum(m.oilDensity)) return null;
  if (m.liquidM3Day < 0 || m.oilDensity <= 0) return null;
  const w = Math.min(100, Math.max(0, m.waterCutPct));
  return m.liquidM3Day * (1 - w / 100) * m.oilDensity;
}

/** Сумма нефти по замерам. Пустой фонд — null, а не 0: это «нет данных». */
export function totalOil(ms: readonly Measurement[]): number | null {
  const vals = ms.map(oilFromMeasurement).filter(isNum);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0);
}

/** Сумма жидкости по замерам. */
export function totalLiquid(ms: readonly Measurement[]): number | null {
  const vals = ms.map((m) => m.liquidM3Day).filter(isNum).filter((v) => v >= 0);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0);
}

/**
 * Средневзвешенная обводнённость: Σ Q_water / Σ Q_liq × 100.
 *
 * Именно по сумме потоков, а НЕ среднее арифметическое по скважинам:
 * среднее завысило бы вклад малодебитных скважин (03-holding-dashboard.md, 2.2).
 */
export function weightedWaterCut(ms: readonly Measurement[]): number | null {
  let liq = 0;
  let water = 0;
  for (const m of ms) {
    if (!isNum(m.liquidM3Day) || !isNum(m.waterCutPct) || m.liquidM3Day < 0) continue;
    const w = Math.min(100, Math.max(0, m.waterCutPct));
    liq += m.liquidM3Day;
    water += (m.liquidM3Day * w) / 100;
  }
  if (liq <= 0) return null;
  return (water / liq) * 100;
}

/**
 * Процент выполнения плана к дате.
 *
 * `planToDate` — не месячный план целиком, а его часть, приходящаяся на
 * прошедшие сутки месяца. Нулевой план даёт null: «плана нет», а не «0%».
 */
export function planPct(factToDate: number | null, planToDate: number | null): number | null {
  if (!isNum(factToDate) || !isNum(planToDate) || planToDate <= 0) return null;
  return (factToDate / planToDate) * 100;
}

/** Часть месячного плана, приходящаяся на первые `days` суток месяца. */
export function planToDate(monthPlan: number | null, days: number, daysInMonth: number): number | null {
  if (!isNum(monthPlan) || monthPlan < 0) return null;
  if (!isNum(days) || !isNum(daysInMonth) || daysInMonth <= 0 || days <= 0) return null;
  return (monthPlan / daysInMonth) * Math.min(days, daysInMonth);
}

/** Абсолютная дельта к предыдущему значению (сегодня − вчера). */
export function delta(today: number | null, yesterday: number | null): number | null {
  if (!isNum(today) || !isNum(yesterday)) return null;
  return today - yesterday;
}

/**
 * Дельта обводнённости в процентных пунктах.
 *
 * Отдельная функция не ради арифметики, а ради единицы измерения: в интерфейсе
 * это «п.п.», и путать её с процентами нельзя.
 */
export function deltaPp(today: number | null, yesterday: number | null): number | null {
  return delta(today, yesterday);
}

/** Относительное изменение в процентах; нулевая база — null. */
export function deltaPct(today: number | null, yesterday: number | null): number | null {
  if (!isNum(today) || !isNum(yesterday) || yesterday === 0) return null;
  return ((today - yesterday) / Math.abs(yesterday)) * 100;
}

/** Календарных суток между датами (без учёта времени). */
export function daysUntil(due: Date, today: Date): number {
  const d = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
  const t = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((d - t) / 86_400_000);
}

/**
 * Статус требования: done → overdue → due_soon (≤ 30 дней) → planned.
 *
 * Выполненное остаётся выполненным, даже если срок давно прошёл.
 */
export function requirementStatus(
  dueDate: Date,
  today: Date,
  opts: { doneAt?: Date | null; dueSoonDays?: number } = {},
): RequirementStatus {
  if (opts.doneAt) return 'done';
  const left = daysUntil(dueDate, today);
  if (left < 0) return 'overdue';
  return left <= (opts.dueSoonDays ?? 30) ? 'due_soon' : 'planned';
}

/** Светофор по статусу требования. */
export function requirementLevel(status: RequirementStatus): Level {
  if (status === 'overdue') return 'crit';
  if (status === 'due_soon') return 'warn';
  if (status === 'done') return 'ok';
  return 'none';
}

/** Худший из уровней — для точки статуса в строке таблицы. */
export function worstLevel(levels: readonly Level[]): Level {
  if (levels.includes('crit')) return 'crit';
  if (levels.includes('warn')) return 'warn';
  if (levels.includes('ok')) return 'ok';
  return 'none';
}

/**
 * Эффект захода UT-9: средний дебит 14 суток после минус 14 суток до
 * (03-holding-dashboard.md, 2.5).
 */
export function jobEffect(oilBefore: number | null, oilAfter: number | null): number | null {
  if (!isNum(oilBefore) || !isNum(oilAfter)) return null;
  return oilAfter - oilBefore;
}

/** Суммарный прирост по заходам; заходы без результата пропускаются. */
export function totalJobEffect(
  jobs: readonly { oilBefore: number | null; oilAfter: number | null }[],
): number | null {
  const vals = jobs.map((j) => jobEffect(j.oilBefore, j.oilAfter)).filter(isNum);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0);
}

/** Среднее арифметическое; пустой список — null. */
export function mean(values: readonly number[]): number | null {
  const vals = values.filter(isNum);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
