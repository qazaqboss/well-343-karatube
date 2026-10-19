/**
 * Схема сводки для главной страницы.
 *
 * Это не скриншот и не выдуманные цифры: намеренно схематичный рисунок —
 * полоса показателей, график и таблица активов. Публиковать настоящий экран
 * нельзя (на нём данные клиента), а рисовать правдоподобные фальшивые числа
 * нечестно: их начнут читать как настоящие.
 */
export function DashboardSketch() {
  const line = 'var(--ss-line)';
  const ink = 'var(--ss-ink)';
  const quiet = 'var(--ss-ink-quiet)';

  /** Ряд добычи — не данные, а форма кривой: рост, провал, восстановление. */
  const curve = [
    38, 36, 39, 41, 40, 44, 46, 43, 47, 50, 48, 52, 55, 53, 57, 60, 58, 62, 59, 64,
    61, 66, 63, 68, 71, 69, 73, 70, 74, 77,
  ];
  // Кривую вписываем в рамку графика (y от 64 до 114), а не масштабируем
  // на глаз: иначе линия вылезает за блок на любых других значениях.
  const lo = Math.min(...curve);
  const hi = Math.max(...curve);
  const pts = curve
    .map((v, i) => {
      const x = 20 + (i * 300) / (curve.length - 1);
      const y = 114 - ((v - lo) / (hi - lo)) * 50;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox="0 0 340 210"
      width="100%"
      role="img"
      aria-label="Схема сводки: показатели, график добычи и таблица активов"
      style={{ display: 'block', maxWidth: 460 }}
    >
      {/* полоса показателей */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={20 + i * 76} y={14} width={72} height={34} fill="none" stroke={line} />
          <rect x={27 + i * 76} y={21} width={28} height={4} fill={line} />
          <rect x={27 + i * 76} y={30} width={i === 0 ? 40 : 30} height={9} fill={i === 0 ? ink : quiet} opacity={i === 0 ? 1 : 0.45} />
        </g>
      ))}

      {/* график */}
      <rect x={20} y={58} width={300} height={62} fill="none" stroke={line} />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={20} y1={72 + i * 16} x2={320} y2={72 + i * 16} stroke={line} strokeDasharray="2 4" />
      ))}
      <polyline points={pts} fill="none" stroke={ink} strokeWidth={1.6} />
      <line x1={232} y1={58} x2={232} y2={120} stroke={quiet} strokeDasharray="3 3" />
      <text x={236} y={68} fontSize={6} fill={quiet} fontFamily="Inter, sans-serif">
        UT-9
      </text>

      {/* таблица активов */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line x1={20} y1={136 + i * 18} x2={320} y2={136 + i * 18} stroke={line} />
          <circle
            cx={27}
            cy={145 + i * 18}
            r={3}
            fill={i === 0 ? 'var(--ss-crit)' : i === 1 ? 'var(--ss-warn)' : 'var(--ss-ok)'}
          />
          <rect x={38} y={142 + i * 18} width={74} height={5} fill={quiet} opacity={0.5} />
          <rect x={150} y={142 + i * 18} width={30} height={5} fill={quiet} opacity={0.35} />
          <rect x={200} y={142 + i * 18} width={26} height={5} fill={quiet} opacity={0.35} />
          <rect x={250} y={142 + i * 18} width={22} height={5} fill={quiet} opacity={0.35} />
          <rect x={290} y={142 + i * 18} width={30} height={5} fill={quiet} opacity={0.35} />
        </g>
      ))}
      <line x1={20} y1={208} x2={320} y2={208} stroke={line} />
    </svg>
  );
}
