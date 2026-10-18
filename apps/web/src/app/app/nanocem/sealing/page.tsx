import Link from 'next/link';
import { Panel, SectionTitle, StatusDot } from '@subsoil/ui';
import { FUND_META, listWells } from '@/lib/real/build';

export const metadata = { title: 'Герметичность — Subsoil' };

/** Порядок строк: сперва то, что держит, затем спорное, затем отказы. */
const RANK: Record<string, number> = {
  first: 0,
  second: 1,
  confirmed: 2,
  tested: 3,
  fresh: 4,
  wait: 5,
  lost: 6,
  open: 7,
};

const LEVEL: Record<string, 'ok' | 'warn' | 'crit' | 'none'> = {
  first: 'ok',
  second: 'ok',
  confirmed: 'ok',
  tested: 'ok',
  fresh: 'warn',
  wait: 'warn',
  lost: 'crit',
  open: 'crit',
};

export default function SealingPage() {
  const wells = [...listWells()].sort((a, b) => (RANK[a.seal.code] ?? 9) - (RANK[b.seal.code] ?? 9));

  const held = wells.filter((w) => ['first', 'second', 'confirmed', 'tested'].includes(w.seal.code)).length;
  const lost = wells.filter((w) => w.seal.code === 'lost').length;
  const pending = wells.filter((w) => ['fresh', 'wait'].includes(w.seal.code)).length;

  return (
    <>
      <SectionTitle aside={`статусы на ${FUND_META.updated}`}>Герметичность фонда</SectionTitle>

      <Panel style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: 28 }} />
                <th style={TH}>Скважина</th>
                <th style={TH}>Заходов</th>
                <th style={TH}>Итог герметизации</th>
                <th style={TH}>Дата захода</th>
                <th style={TH}>Зона залежи</th>
                <th style={TH}>Сейчас</th>
              </tr>
            </thead>
            <tbody>
              {wells.map((w) => (
                <tr key={w.id}>
                  <td style={{ ...TD, paddingRight: 0 }}>
                    <StatusDot level={LEVEL[w.seal.code] ?? 'none'} />
                  </td>
                  <td style={TD}>
                    <Link href={`/app/field/wells/${w.id}`} style={{ textDecoration: 'none' }}>
                      <span style={{ borderBottom: '1px solid var(--ss-line)' }}>{w.title}</span>
                    </Link>
                  </td>
                  <td style={{ ...TD, color: 'var(--ss-ink-quiet)' }}>{w.seal.entries}</td>
                  <td style={TD}>{w.seal.label}</td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{w.seal.date}</td>
                  <td style={{ ...TD, color: 'var(--ss-ink-quiet)' }}>{w.seal.zone}</td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{w.seal.qobv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Panel style={{ padding: 20 }}>
          <div className="ss-label">Держит</div>
          <div className="ss-nums" style={{ fontSize: 32, fontWeight: 600, marginTop: 8 }}>{held}</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>
            Из них одна — с прямой опрессовкой интервалов до запуска. Это единственная методика,
            которая отделяет «изоляция встала» от «скважина хорошо работает».
          </p>
        </Panel>
        <Panel style={{ padding: 20 }}>
          <div className="ss-label">Эффект утрачен</div>
          <div className="ss-nums" style={{ fontSize: 32, fontWeight: 600, marginTop: 8, color: 'var(--ss-crit)' }}>{lost}</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>
            Краевая скважина: изоляция перфорации закрылась, но вода нашла путь за колонной.
            Сплошной контакт заколонного цемента там всего 30,4 %.
          </p>
        </Panel>
        <Panel style={{ padding: 20 }}>
          <div className="ss-label">Оценки ещё нет</div>
          <div className="ss-nums" style={{ fontSize: 32, fontWeight: 600, marginTop: 8, color: 'var(--ss-warn)' }}>{pending}</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>
            Либо скважина выводится на режим и даёт пусковую воду, либо вывод на режим затянулся
            и итог определится в следующем месяце.
          </p>
        </Panel>
      </div>

      <Panel quiet style={{ padding: 20, maxWidth: 860 }}>
        <div className="ss-label">Что определяет результат</div>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
          Устойчивый результат дали скважины центральной части залежи. Чем ближе к границе, тем хуже:
          на краю эффект не удерживается — вода обходит изолированную перфорацию за колонной.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
          Процент воды в точке сам по себе ничего не говорит об исходе. Отбирать кандидатов нужно
          по положению скважины и состоянию заколонного цемента, а не по уровню обводнённости.
        </p>
      </Panel>
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

const TD = { padding: '10px 12px', borderBottom: '1px solid var(--ss-line)', fontSize: 14 } as const;
