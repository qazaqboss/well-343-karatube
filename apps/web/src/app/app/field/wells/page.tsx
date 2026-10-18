import Link from 'next/link';
import { Panel, SectionTitle, StatusDot } from '@subsoil/ui';
import { day } from '@subsoil/shared';
import { FUND_META, listWells } from '@/lib/real/build';

export const metadata = { title: 'Фонд скважин — Subsoil' };

export default function WellsPage() {
  const wells = listWells();

  return (
    <>
      <SectionTitle aside={`данные на ${day(FUND_META.updated.split('.').reverse().join('-'))}`}>
        Фонд скважин
      </SectionTitle>

      <Panel style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: 28 }} />
                <th style={TH}>Скважина</th>
                <th style={{ ...TH, textAlign: 'right' }}>Qн, т/сут</th>
                <th style={{ ...TH, textAlign: 'right' }}>Обв., %</th>
                <th style={{ ...TH, textAlign: 'right' }}>Qж, м³/сут</th>
                <th style={TH}>Статус</th>
                <th style={TH}>Итог изоляции</th>
              </tr>
            </thead>
            <tbody>
              {wells.map((w) => (
                <tr key={w.id}>
                  <td style={{ ...TD, paddingRight: 0 }}>
                    <StatusDot level={w.level} />
                  </td>
                  <td style={TD}>
                    <Link href={`/app/field/wells/${w.id}`} style={{ textDecoration: 'none' }}>
                      <span style={{ borderBottom: '1px solid var(--ss-line)' }}>{w.title}</span>
                    </Link>
                  </td>
                  <td style={NUM}>{w.last.qn}</td>
                  <td style={NUM}>{w.last.obv}</td>
                  <td style={NUM}>{w.last.qzh}</td>
                  <td style={{ ...TD, color: 'var(--ss-ink-quiet)' }}>
                    {w.statusLabel}
                    <span style={{ display: 'block', fontSize: 12 }}>{w.statusDetail}</span>
                  </td>
                  <td style={{ ...TD, fontSize: 13 }}>{w.seal.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <p style={{ fontSize: 12, color: 'var(--ss-ink-quiet)', lineHeight: 1.6, maxWidth: 760 }}>
        Восемь скважин с заходами NanoCem UT-9. Показатели — из суточных режимных листов,
        последний замер на {FUND_META.updated}. Остальной фонд месторождения виден только
        агрегатами на странице{' '}
        <Link href="/app/field/water-cut" style={{ borderBottom: '1px solid var(--ss-line)' }}>
          обводнённости
        </Link>
        : поскважинные данные чужих скважин не выгружаются.
      </p>
    </>
  );
}

const TH = {
  textAlign: 'left',
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--ss-ink-quiet)',
  fontWeight: 500,
  padding: '0 12px 8px',
  borderBottom: '1px solid var(--ss-line)',
  whiteSpace: 'nowrap',
} as const;

const TD = { padding: 12, borderBottom: '1px solid var(--ss-line)', fontSize: 14 } as const;
const NUM = { ...TD, textAlign: 'right', whiteSpace: 'nowrap' } as const;
