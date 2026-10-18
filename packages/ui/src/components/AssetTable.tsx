import { StatusDot, type Level } from './primitives';

export interface AssetTableRow {
  key: string;
  /** Куда ведёт клик по строке — на уровень ниже (03-holding-dashboard.md, 2.3). */
  href: string;
  status: Level;
  name: string;
  subtitle?: string | null;
  oil: string;
  deltaDay: string;
  deltaLevel: Level;
  waterCut: string;
  fund: string;
  planPct: string;
  requirements: string;
  requirementsLevel: Level;
  nextDue: string;
}

const TH: React.CSSProperties = {
  textAlign: 'left',
  fontFamily: 'var(--ss-font-body)',
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--ss-ink-quiet)',
  fontWeight: 500,
  padding: '0 12px 8px',
  borderBottom: '1px solid var(--ss-line)',
  whiteSpace: 'nowrap',
};

const TD: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid var(--ss-line)',
  fontSize: 14,
  verticalAlign: 'middle',
};

const NUM: React.CSSProperties = { ...TD, textAlign: 'right', whiteSpace: 'nowrap' };

/**
 * Таблица активов. Строка — месторождение на уровне холдинга или скважина
 * на уровне месторождения. Сортировка приходит готовой: красные сверху.
 *
 * На узком экране таблица горизонтально прокручивается внутри своей рамки —
 * колонки не схлопываются, потому что цифры в них сравнивают между собой.
 */
export function AssetTable({ rows, nameHeader = 'Компания / месторождение' }: { rows: readonly AssetTableRow[]; nameHeader?: string }) {
  if (rows.length === 0) {
    return (
      <div style={{ padding: 20, color: 'var(--ss-ink-quiet)', fontSize: 13 }}>
        Нет активов на этом уровне.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: 28 }}>
              <span className="sr-only">Статус</span>
            </th>
            <th style={TH}>{nameHeader}</th>
            <th style={{ ...TH, textAlign: 'right' }}>Нефть, т/сут</th>
            <th style={{ ...TH, textAlign: 'right' }}>Δ сут</th>
            <th style={{ ...TH, textAlign: 'right' }}>Вода, %</th>
            <th style={{ ...TH, textAlign: 'right' }}>Фонд</th>
            <th style={{ ...TH, textAlign: 'right' }}>План, %</th>
            <th style={TH}>Требования</th>
            <th style={{ ...TH, textAlign: 'right' }}>Срок</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td style={{ ...TD, paddingRight: 0 }}>
                <StatusDot level={r.status} />
              </td>
              <td style={TD}>
                <a className="ss-focus" href={r.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <span style={{ borderBottom: '1px solid var(--ss-line)' }}>{r.name}</span>
                  {r.subtitle ? (
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--ss-ink-quiet)', marginTop: 2 }}>
                      {r.subtitle}
                    </span>
                  ) : null}
                </a>
              </td>
              <td style={NUM}>{r.oil}</td>
              <td style={{ ...NUM, color: r.deltaLevel === 'none' ? 'var(--ss-ink-quiet)' : `var(--ss-${r.deltaLevel})` }}>
                {r.deltaDay}
              </td>
              <td style={NUM}>{r.waterCut}</td>
              <td style={NUM}>{r.fund}</td>
              <td style={NUM}>{r.planPct}</td>
              <td style={TD}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <StatusDot level={r.requirementsLevel} />
                  {r.requirements}
                </span>
              </td>
              <td style={NUM}>{r.nextDue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
