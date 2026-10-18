'use client';

import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { color } from '@subsoil/ui/tokens';

export interface WellPoint {
  d: string;
  qn: number | null;
  obv: number | null;
}

/**
 * График по скважине: дебит нефти и обводнённость на двух осях.
 *
 * Дни ремонта (без замера) из ряда исключены — как и на страницах старого
 * сайта: иначе линия рвётся провалом в ноль, которого в пласте не было.
 */
export function WellChart({ points, markers }: { points: WellPoint[]; markers?: { d: string; label: string }[] }) {
  const [show, setShow] = useState<'both' | 'oil' | 'water'>('both');

  const option = useMemo(() => {
    const labels = points.map((p) => p.d);
    const markLine = (markers ?? []).map((m) => ({
      xAxis: m.d,
      label: { formatter: m.label, color: color.inkQuiet, fontSize: 10, rotate: 90, position: 'insideEndTop' },
      lineStyle: { color: color.inkQuiet, type: 'dotted', width: 1 },
    }));

    return {
      grid: { left: 44, right: 44, top: 16, bottom: 28 },
      tooltip: { trigger: 'axis' },
      legend: { show: false },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: color.line } },
        axisTick: { show: false },
        axisLabel: { color: color.inkQuiet, fontSize: 10, maxTicksLimit: 12 },
      },
      yAxis: [
        {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: color.line } },
          axisLabel: { color: color.inkQuiet, fontSize: 10, formatter: '{value} т' },
        },
        {
          type: 'value',
          min: 0,
          max: 100,
          splitLine: { show: false },
          axisLabel: { color: color.inkQuiet, fontSize: 10, formatter: '{value}%' },
        },
      ],
      series: [
        ...(show !== 'water'
          ? [
              {
                name: 'Qн, т/сут',
                type: 'line',
                symbol: 'none',
                yAxisIndex: 0,
                lineStyle: { color: color.ink, width: 1.6 },
                itemStyle: { color: color.ink },
                data: points.map((p) => p.qn),
                markLine: markLine.length ? { silent: true, symbol: 'none', data: markLine } : undefined,
              },
            ]
          : []),
        ...(show !== 'oil'
          ? [
              {
                name: 'Обводнённость, %',
                type: 'line',
                symbol: 'none',
                yAxisIndex: 1,
                lineStyle: { color: color.inkQuiet, width: 1.1, type: 'dashed' },
                itemStyle: { color: color.inkQuiet },
                data: points.map((p) => p.obv),
              },
            ]
          : []),
      ],
    };
  }, [points, markers, show]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {([
          ['both', 'Вместе'],
          ['oil', 'Нефть'],
          ['water', 'Обводнённость'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            className="ss-focus"
            onClick={() => setShow(k)}
            aria-pressed={show === k}
            style={{
              font: 'inherit',
              fontSize: 12,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: 'var(--ss-radius-btn)',
              border: '1px solid var(--ss-line)',
              background: show === k ? 'var(--ss-ink)' : 'transparent',
              color: show === k ? 'var(--ss-bg)' : 'var(--ss-ink-quiet)',
            }}
          >
            {label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ss-ink-quiet)', alignSelf: 'center' }}>
          дни ремонта исключены
        </span>
      </div>
      <ReactECharts option={option} style={{ height: 320 }} notMerge />
    </div>
  );
}
