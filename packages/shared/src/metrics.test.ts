import { describe, expect, it } from 'vitest';
import {
  daysUntil,
  delta,
  deltaPct,
  deltaPp,
  jobEffect,
  mean,
  oilFromMeasurement,
  planPct,
  planToDate,
  requirementLevel,
  requirementStatus,
  totalJobEffect,
  totalLiquid,
  totalOil,
  weightedWaterCut,
  worstLevel,
  type Measurement,
} from './metrics';

const m = (liquidM3Day: number, waterCutPct: number, oilDensity = 0.85): Measurement => ({
  liquidM3Day,
  waterCutPct,
  oilDensity,
});

describe('oilFromMeasurement', () => {
  it('считает нефть из жидкости, обводнённости и плотности', () => {
    // 20 м³ × 50% × 0,85 = 8,5 т
    expect(oilFromMeasurement(m(20, 50))).toBeCloseTo(8.5, 6);
  });

  it('при 100% воды даёт ноль, а не отрицательное', () => {
    expect(oilFromMeasurement(m(20, 100))).toBe(0);
  });

  it('обрезает обводнённость выше 100 и ниже 0 — округления в режимных листах', () => {
    expect(oilFromMeasurement(m(20, 100.4))).toBe(0);
    expect(oilFromMeasurement(m(20, -0.2))).toBeCloseTo(17, 6);
  });

  it('нулевая жидкость — ноль нефти', () => {
    expect(oilFromMeasurement(m(0, 90))).toBe(0);
  });

  it('нулевая или отрицательная плотность — null, а не ноль', () => {
    expect(oilFromMeasurement(m(20, 50, 0))).toBeNull();
    expect(oilFromMeasurement(m(20, 50, -1))).toBeNull();
  });

  it('отрицательная жидкость — null', () => {
    expect(oilFromMeasurement(m(-5, 50))).toBeNull();
  });

  it('NaN в любом поле — null', () => {
    expect(oilFromMeasurement(m(NaN, 50))).toBeNull();
    expect(oilFromMeasurement(m(20, NaN))).toBeNull();
    expect(oilFromMeasurement(m(20, 50, NaN))).toBeNull();
  });
});

describe('totalOil / totalLiquid', () => {
  it('суммирует по фонду', () => {
    expect(totalOil([m(20, 50), m(10, 0)])).toBeCloseTo(8.5 + 8.5, 6);
    expect(totalLiquid([m(20, 50), m(10, 0)])).toBe(30);
  });

  it('пустой фонд — null, а не ноль', () => {
    expect(totalOil([])).toBeNull();
    expect(totalLiquid([])).toBeNull();
  });

  it('пропускает негодные замеры, но считает по оставшимся', () => {
    expect(totalOil([m(20, 50), m(NaN, 50)])).toBeCloseTo(8.5, 6);
  });

  it('фонд из одних негодных замеров — null', () => {
    expect(totalOil([m(NaN, 50), m(20, 50, 0)])).toBeNull();
  });
});

describe('weightedWaterCut', () => {
  it('считает по сумме потоков, а не средним по скважинам', () => {
    // 100 м³ при 90% и 1 м³ при 10%: воды 90,1 из 101 → 89,2%,
    // среднее арифметическое дало бы 50% — и это была бы неправда.
    const wells = [m(100, 90), m(1, 10)];
    expect(weightedWaterCut(wells)).toBeCloseTo(89.208, 3);
    expect(mean(wells.map((w) => w.waterCutPct))).toBe(50);
  });

  it('нулевой отбор жидкости — null, а не деление на ноль', () => {
    expect(weightedWaterCut([m(0, 90), m(0, 10)])).toBeNull();
  });

  it('пустой фонд — null', () => {
    expect(weightedWaterCut([])).toBeNull();
  });

  it('безводный фонд — ноль', () => {
    expect(weightedWaterCut([m(10, 0), m(5, 0)])).toBe(0);
  });

  it('обрезает выбросы обводнённости', () => {
    expect(weightedWaterCut([m(10, 120)])).toBe(100);
  });
});

describe('planPct и planToDate', () => {
  it('считает процент выполнения', () => {
    expect(planPct(96, 100)).toBe(96);
  });

  it('нулевой или отсутствующий план — null', () => {
    expect(planPct(96, 0)).toBeNull();
    expect(planPct(96, null)).toBeNull();
    expect(planPct(null, 100)).toBeNull();
  });

  it('делит месячный план по суткам', () => {
    expect(planToDate(3100, 10, 31)).toBeCloseTo(1000, 6);
  });

  it('не выходит за месяц, если суток передали больше', () => {
    expect(planToDate(3100, 40, 31)).toBeCloseTo(3100, 6);
  });

  it('нулевое число суток в месяце — null', () => {
    expect(planToDate(3100, 10, 0)).toBeNull();
  });
});

describe('дельты', () => {
  it('абсолютная дельта и дельта в пунктах', () => {
    expect(delta(124.6, 121.5)).toBeCloseTo(3.1, 6);
    expect(deltaPp(90.2, 89.8)).toBeCloseTo(0.4, 6);
  });

  it('относительная дельта в процентах', () => {
    expect(deltaPct(120, 100)).toBeCloseTo(20, 6);
    expect(deltaPct(80, 100)).toBeCloseTo(-20, 6);
  });

  it('нулевая вчерашняя база — null, а не бесконечность', () => {
    expect(deltaPct(5, 0)).toBeNull();
  });

  it('нет вчерашнего значения — null', () => {
    expect(delta(10, null)).toBeNull();
    expect(deltaPct(10, null)).toBeNull();
  });
});

describe('статусы требований', () => {
  const today = new Date('2026-10-18T00:00:00Z');

  it('считает календарные сутки до срока', () => {
    expect(daysUntil(new Date('2026-10-25T00:00:00Z'), today)).toBe(7);
    expect(daysUntil(new Date('2026-10-18T23:00:00Z'), today)).toBe(0);
    expect(daysUntil(new Date('2026-10-10T00:00:00Z'), today)).toBe(-8);
  });

  it('просрочено, если срок прошёл и не выполнено', () => {
    expect(requirementStatus(new Date('2026-10-10T00:00:00Z'), today)).toBe('overdue');
  });

  it('выполненное остаётся выполненным даже после срока', () => {
    const s = requirementStatus(new Date('2026-10-10T00:00:00Z'), today, {
      doneAt: new Date('2026-10-09T00:00:00Z'),
    });
    expect(s).toBe('done');
  });

  it('срок сегодня — ещё не просрочено', () => {
    expect(requirementStatus(new Date('2026-10-18T00:00:00Z'), today)).toBe('due_soon');
  });

  it('тридцатый день — ещё due_soon, тридцать первый — planned', () => {
    expect(requirementStatus(new Date('2026-11-17T00:00:00Z'), today)).toBe('due_soon');
    expect(requirementStatus(new Date('2026-11-18T00:00:00Z'), today)).toBe('planned');
  });

  it('порог «скоро» настраивается', () => {
    expect(requirementStatus(new Date('2026-10-25T00:00:00Z'), today, { dueSoonDays: 3 })).toBe('planned');
  });

  it('переводит статус в светофор', () => {
    expect(requirementLevel('overdue')).toBe('crit');
    expect(requirementLevel('due_soon')).toBe('warn');
    expect(requirementLevel('done')).toBe('ok');
    expect(requirementLevel('planned')).toBe('none');
  });
});

describe('worstLevel', () => {
  it('критичное перебивает всё', () => {
    expect(worstLevel(['ok', 'warn', 'crit'])).toBe('crit');
  });

  it('внимание перебивает норму', () => {
    expect(worstLevel(['ok', 'warn'])).toBe('warn');
  });

  it('пустой список — нет данных', () => {
    expect(worstLevel([])).toBe('none');
  });
});

describe('эффект заходов UT-9', () => {
  it('прирост = после минус до', () => {
    expect(jobEffect(1.5, 3.95)).toBeCloseTo(2.45, 6);
  });

  it('отрицательный эффект не прячется', () => {
    expect(jobEffect(6.31, 2.25)).toBeCloseTo(-4.06, 6);
  });

  it('заход без результата не учитывается в сумме', () => {
    const jobs = [
      { oilBefore: 1.5, oilAfter: 3.95 },
      { oilBefore: 0.46, oilAfter: null },
    ];
    expect(totalJobEffect(jobs)).toBeCloseTo(2.45, 6);
  });

  it('если результата нет ни у одного захода — null', () => {
    expect(totalJobEffect([{ oilBefore: 1, oilAfter: null }])).toBeNull();
    expect(totalJobEffect([])).toBeNull();
  });
});

describe('mean', () => {
  it('считает среднее', () => {
    expect(mean([1, 2, 3])).toBe(2);
  });

  it('пустой список — null', () => {
    expect(mean([])).toBeNull();
  });
});
