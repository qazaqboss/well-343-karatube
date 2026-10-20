'use client';

/**
 * Журнал суточных замеров по скважине — весь, с начала года.
 *
 * Раньше в кабинете стояло `slice(-30)`: тридцать последних суток. Для фонда,
 * где смысл в том, как скважина вела себя до ремонта и после, тридцати суток
 * мало — на старых страницах журнал всегда показывали целиком, по возрастанию
 * дат, с фильтрами по фазам и счётчиком показанных записей. Здесь то же самое.
 *
 * Порядок — от января к последним суткам: так видно ход года, а не только хвост.
 * Длинная таблица прокручивается внутри себя, шапка остаётся на месте.
 */
import { useMemo, useState } from 'react';

export interface JournalRow {
  d: string;
  phase: string | null;
  qn: number | null;
  obv: number | null;
  qzh: number | null;
  /** Местами в источнике это «172/160» — два уровня в одной клетке. Не число. */
  ndin: number | string | null;
  comment: string | null;
}

/**
 * Подписи фаз.
 *
 * Коды взяты из данных, а названия сверены по комментариям тех же суток —
 * не придуманы. Набор фаз у скважин разный: у одних есть форсирование,
 * у других — ОЗЦ или ГИС, поэтому кнопки строятся по тому, что реально есть.
 */
const PHASE_LABEL: Record<string, string> = {
  before: 'До РИР',
  krs: 'КРС / РИР',
  ozc: 'ОЗЦ',
  after: 'После РИР',
  forced: 'Форсирование',
  stable: 'Стабильный режим',
  work: 'В работе',
  restart: 'Запуск после ремонта',
  trs: 'ТРС',
  otrs: 'Остановка ОТРС',
  gis: 'ГИС и исследования',
  decline: 'Падение дебита',
  crash: 'Обвал дебита',
  idle: 'Простой',
};

/** Порядок кнопок — по ходу жизни скважины, а не по алфавиту. */
const PHASE_ORDER = Object.keys(PHASE_LABEL);

const label = (p: string | null) => (p ? (PHASE_LABEL[p] ?? p) : '—');

export function WellJournal({ rows }: { rows: readonly JournalRow[] }) {
  const [phase, setPhase] = useState<string>('all');

  const phases = useMemo(() => {
    const present = new Set(rows.map((r) => r.phase).filter((p): p is string => Boolean(p)));
    return PHASE_ORDER.filter((p) => present.has(p));
  }, [rows]);

  const shown = phase === 'all' ? rows : rows.filter((r) => r.phase === phase);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <FilterButton active={phase === 'all'} onClick={() => setPhase('all')}>
          Все дни
        </FilterButton>
        {phases.map((p) => (
          <FilterButton key={p} active={phase === p} onClick={() => setPhase(p)}>
            {PHASE_LABEL[p]}
          </FilterButton>
        ))}
      </div>

      <div className="ss-nums" style={{ fontSize: 12, color: 'var(--ss-ink-quiet)', marginBottom: 12 }}>
        Показано суток: {shown.length} из {rows.length}
        {rows.length > 0 ? ` · ${rows[0]!.d} — ${rows[rows.length - 1]!.d}` : ''}
      </div>

      <div style={{ overflow: 'auto', maxHeight: '70vh', border: '1px solid var(--ss-line)' }}>
        <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr>
              {['Дата', 'Фаза', 'Qн, т', 'Обв., %', 'Qж, м³', 'Ндин, м', 'Комментарий'].map((h, i) => (
                <th key={h} style={{ ...TH, textAlign: i >= 2 && i <= 5 ? 'right' : 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.d}>
                <td style={{ ...TD, whiteSpace: 'nowrap' }}>{r.d}</td>
                <td style={{ ...TD, color: 'var(--ss-ink-quiet)', fontSize: 12, whiteSpace: 'nowrap' }}>
                  {label(r.phase)}
                </td>
                <td style={NUM}>{fmt(r.qn, 2)}</td>
                <td style={NUM}>{fmt(r.obv, 1)}</td>
                <td style={NUM}>{fmt(r.qzh, 1)}</td>
                <td style={NUM}>{level(r.ndin)}</td>
                <td style={{ ...TD, fontSize: 13, color: 'var(--ss-ink-quiet)', minWidth: 280 }}>{r.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="ss-focus"
      onClick={onClick}
      style={{
        font: 'inherit',
        fontSize: 12,
        padding: '6px 12px',
        cursor: 'pointer',
        border: '1px solid var(--ss-line)',
        background: active ? 'var(--ss-ink)' : 'var(--ss-bg)',
        color: active ? 'var(--ss-bg)' : 'var(--ss-ink)',
      }}
    >
      {children}
    </button>
  );
}

/**
 * Уровень показываем как записан.
 *
 * В части суток в источнике стоит «172/160» — динамический и статический
 * уровень разом. Привести это к числу значит выбросить половину замера,
 * поэтому строку оставляем как есть.
 */
function level(v: number | string | null): string {
  if (v === null || v === undefined || v === '') return '—';
  return typeof v === 'number' ? String(v) : v;
}

/** Прочерк, а не ноль: в эти сутки замера не было, и это разные вещи. */
function fmt(v: number | null, digits: number): string {
  if (v === null || v === undefined) return '—';
  return v.toFixed(digits).replace('.', ',');
}

const TH = {
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--ss-ink-quiet)',
  fontWeight: 500,
  padding: '10px 12px',
  borderBottom: '1px solid var(--ss-line)',
  whiteSpace: 'nowrap',
  // Шапка держится при прокрутке: иначе на 286 строках непонятно, где какая колонка.
  position: 'sticky',
  top: 0,
  background: 'var(--ss-bg)',
  zIndex: 1,
} as const;

const TD = { padding: '9px 12px', borderBottom: '1px solid var(--ss-line)', fontSize: 14 } as const;
const NUM = { ...TD, textAlign: 'right', whiteSpace: 'nowrap' } as const;
