import type { ReactNode } from 'react';
import { levelVar, type Level } from './primitives';

export interface KpiCardProps {
  /** Подпись капсом: «НЕФТЬ, Т/СУТ». */
  label: string;
  /** Готовое к показу значение — форматирует вызывающая сторона. */
  value: string;
  /** Дельта к вчера, уже со знаком: «+3,1». */
  delta?: string | null;
  /**
   * Смысл дельты, а не её знак: рост обводнённости — это warn, хотя число плюсовое
   * (09-design-system.md). Поэтому уровень задаётся снаружи.
   */
  deltaLevel?: Level;
  /** Вторая строка под значением: «96 % плана». */
  note?: string | null;
  /** Куда ведёт клик — каждое число на сводке кликабельно (01-concept.md, п. 4). */
  href?: string;
  children?: ReactNode;
}

const ARROW: Record<string, string> = { up: '▲', down: '▼' };

function arrowFor(delta: string): string | null {
  if (delta.startsWith('+')) return ARROW.up ?? null;
  if (delta.startsWith('−') || delta.startsWith('-')) return ARROW.down ?? null;
  return null;
}

export function KpiCard({ label, value, delta, deltaLevel = 'none', note, href, children }: KpiCardProps) {
  const inner = (
    <>
      <div className="ss-label">{label}</div>
      <div
        className="ss-nums"
        style={{ fontFamily: 'var(--ss-font-body)', fontSize: 32, fontWeight: 600, lineHeight: 1.1, marginTop: 10 }}
      >
        {value}
      </div>
      {delta ? (
        <div
          className="ss-nums"
          style={{ fontSize: 13, marginTop: 8, color: deltaLevel === 'none' ? 'var(--ss-ink-quiet)' : levelVar(deltaLevel) }}
        >
          {arrowFor(delta) ? <span aria-hidden="true">{arrowFor(delta)} </span> : null}
          {delta}
        </div>
      ) : null}
      {note ? (
        <div className="ss-nums" style={{ fontSize: 13, marginTop: 4, color: 'var(--ss-ink-quiet)' }}>
          {note}
        </div>
      ) : null}
      {children}
    </>
  );

  const style = {
    display: 'block',
    padding: 20,
    borderRight: '1px solid var(--ss-line)',
    textDecoration: 'none',
    color: 'inherit',
    background: 'var(--ss-bg)',
    height: '100%',
  } as const;

  if (href) {
    return (
      <a className="ss-focus" href={href} style={style}>
        {inner}
      </a>
    );
  }
  return <div style={style}>{inner}</div>;
}

/** Полоса KPI: на широком экране в ряд, на телефоне — по две. */
export function KpiStrip({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        border: '1px solid var(--ss-line)',
        borderRight: 'none',
      }}
    >
      {children}
    </div>
  );
}
