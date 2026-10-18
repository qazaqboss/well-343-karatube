'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { HoldingProduction, ProductionMetric, Scope } from '@subsoil/shared';
import { num } from '@subsoil/shared';
import { color } from '@subsoil/ui/tokens';
import { api } from '@/lib/api';

const METRICS: { key: ProductionMetric; label: string }[] = [
  { key: 'oil', label: 'Нефть' },
  { key: 'liquid', label: 'Жидкость' },
  { key: 'water_cut', label: 'Обводнённость' },
];

/**
 * График добычи за 90 дней: факт линией, план пунктиром, заходы UT-9 — метками.
 *
 * Без заливок и градиентов (09-design-system.md, п. 4). Переключатель метрики
 * перезапрашивает ряд, а не прячет серию: у метрик разные единицы и масштаб.
 */
export function ProductionChart({ scope, id }: { scope: Scope; id: string | null }) {
  const [metric, setMetric] = useState<ProductionMetric>('oil');
  const [data, setData] = useState<HoldingProduction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setError(null);
    api
      .getProduction({ scope, id, metric, days: 90 })
      .then((d) => alive && setData(d))
      .catch((e: unknown) => alive && setError(e instanceof Error ? e.message : 'не удалось загрузить ряд'));
    return () => {
      alive = false;
    };
  }, [scope, id, metric]);

  const option = useMemo(() => {
    if (!data) return null;
    const dates = data.points.map((p) => p.date);
    const markLine = data.markers.map((mk) => ({
      xAxis: mk.date,
      label: { formatter: mk.label, color: color.inkQuiet, fontSize: 10, rotate: 90, position: 'insideEndTop' },
      lineStyle: { color: color.inkQuiet, type: 'dotted', width: 1 },
    }));

    return {
      grid: { left: 48, right: 16, top: 16, bottom: 28 },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (v: number) => `${num(v, metric === 'liquid' ? 0 : 1)} ${data.unit}`,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: color.line } },
        axisLabel: { color: color.inkQuiet, fontSize: 10, formatter: (v: string) => v.slice(8) + '.' + v.slice(5, 7) },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        scale: metric !== 'water_cut',
        splitLine: { lineStyle: { color: color.line } },
        axisLabel: { color: color.inkQuiet, fontSize: 10 },
      },
      series: [
        {
          name: 'Факт',
          type: 'line',
          smooth: false,
          symbol: 'none',
          lineStyle: { color: color.ink, width: 1.6 },
          itemStyle: { color: color.ink },
          data: data.points.map((p) => p.fact),
          markLine: markLine.length ? { silent: true, symbol: 'none', data: markLine } : undefined,
        },
        ...(data.points.some((p) => p.plan !== null)
          ? [
              {
                name: 'План',
                type: 'line',
                symbol: 'none',
                lineStyle: { color: color.inkQuiet, width: 1.2, type: 'dashed' },
                itemStyle: { color: color.inkQuiet },
                data: data.points.map((p) => p.plan),
              },
            ]
          : []),
      ],
    };
  }, [data, metric]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            className="ss-focus"
            onClick={() => setMetric(m.key)}
            aria-pressed={metric === m.key}
            style={{
              font: 'inherit',
              fontSize: 12,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: 'var(--ss-radius-btn)',
              border: '1px solid var(--ss-line)',
              background: metric === m.key ? 'var(--ss-ink)' : 'transparent',
              color: metric === m.key ? 'var(--ss-bg)' : 'var(--ss-ink-quiet)',
            }}
          >
            {m.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ss-ink-quiet)', alignSelf: 'center' }}>
          факт — линия, план — пунктир, метки — заходы UT-9
        </span>
      </div>

      {error ? (
        <div style={{ padding: 24, fontSize: 13, color: 'var(--ss-crit)' }}>Ряд не загрузился: {error}</div>
      ) : option ? (
        <ReactECharts option={option} style={{ height: 300 }} notMerge />
      ) : (
        <div style={{ height: 300, display: 'grid', placeItems: 'center', color: 'var(--ss-ink-quiet)', fontSize: 13 }}>
          Загружаю ряд…
        </div>
      )}
    </div>
  );
}
