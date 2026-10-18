/**
 * Дизайн-токены Subsoil — по 09-design-system.md.
 *
 * Значения продублированы в styles.css как CSS-переменные: компоненты берут
 * цвет оттуда (это даёт тёмную тему без перерисовки), а эти константы нужны
 * коду, который рисует не через CSS — прежде всего графикам ECharts.
 */

export const color = {
  bg: '#FFFFFF',
  panel: '#F4F4F2',
  ink: '#111111',
  inkQuiet: '#6B6B6B',
  line: '#E2E2DE',
  ok: '#2E7D32',
  warn: '#B7791F',
  crit: '#C62828',
  none: '#9E9E9E',
} as const;

export const colorDark = {
  bg: '#111111',
  panel: '#1A1A1A',
  ink: '#F2F2F2',
  inkQuiet: '#9A9A9A',
  line: '#2A2A2A',
  ok: '#2E7D32',
  warn: '#B7791F',
  crit: '#C62828',
  none: '#9E9E9E',
} as const;

export const font = {
  display: '"Oswald", sans-serif',
  body: '"Inter", sans-serif',
} as const;

export const size = { xs: 11, sm: 13, md: 15, lg: 20, xl: 32, hero: 64 } as const;

/** Шаг сетки, px. Все отступы кратны ему. */
export const space = 8;

export const radius = { none: 0, btn: 2 } as const;

export type Level = 'ok' | 'warn' | 'crit' | 'none';

/** Цвет статуса для графиков и SVG, где CSS-переменная недоступна. */
export function levelColor(level: Level, theme: 'light' | 'dark' = 'light'): string {
  const c = theme === 'dark' ? colorDark : color;
  return c[level];
}
