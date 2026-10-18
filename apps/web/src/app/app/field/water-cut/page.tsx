import Link from 'next/link';
import { KpiCard, KpiStrip, Panel, SectionTitle, StatusDot } from '@subsoil/ui';
import { num, pct, signed } from '@subsoil/shared';
import { getFundAnalytics } from '@/lib/real/build';

export const metadata = { title: 'Обводнённость фонда — Subsoil' };

export default function WaterCutPage() {
  const f = getFundAnalytics();
  const last = f.series.at(-1);
  const first = f.series[0];

  return (
    <>
      <SectionTitle aside={`фонд на ${f.updated} · ${f.wellsTotal} скважин`}>Обводнённость фонда</SectionTitle>

      <div style={{ marginBottom: 24 }}>
        <KpiStrip>
          <KpiCard label="Обводнённость фонда" value={pct(last?.wc ?? null, 1)} note="по сумме потоков" />
          <KpiCard label="Скважин с замером" value={`${f.measured} / ${f.wellsTotal}`} note="остальные в ремонте" />
          <KpiCard
            label="Сэкономлено воды"
            value={`${num(f.effect.waterSaved, 1)} м³/сут`}
            note={`заходы по ${f.effect.wells.join(', ')}`}
            deltaLevel="ok"
          />
          <KpiCard
            label="Фонд ниже на"
            value={`${num(f.effect.delta, 2)} п.п.`}
            note={`${num(f.effect.wcNow, 2)} % вместо ${num(f.effect.wcAlt, 2)} %`}
            deltaLevel="ok"
          />
          <KpiCard
            label="За период"
            value={signed((last?.wc ?? 0) - (first?.wc ?? 0), 1)}
            note={`${first?.full ?? ''} → ${last?.full ?? ''}`}
            deltaLevel={(last?.wc ?? 0) > (first?.wc ?? 0) ? 'warn' : 'ok'}
          />
        </KpiStrip>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        <div>
          <SectionTitle aside="по месяцам">Динамика фонда</SectionTitle>
          <Panel>
            <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Месяц', 'Скважин', 'Нефть, т/сут', 'Обв., %'].map((h) => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {f.series.map((s) => (
                  <tr key={s.m}>
                    <td style={TD}>{s.full}</td>
                    <td style={NUM}>{s.wells}</td>
                    <td style={NUM}>{num(s.qn, 1)}</td>
                    <td style={NUM}>{num(s.wc, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <div>
          <SectionTitle aside="на последнюю дату">Распределение</SectionTitle>
          <Panel>
            <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Диапазон', 'Скважин', 'Наши'].map((h) => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {f.dist.map((d) => (
                  <tr key={d.label}>
                    <td style={TD}>{d.label}</td>
                    <td style={NUM}>{d.n}</td>
                    <td style={{ ...TD, color: 'var(--ss-ink-quiet)', fontSize: 13 }}>
                      {d.ours.length ? d.ours.join(', ') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <SectionTitle aside="сумма воды к сумме жидкости">По горизонтам</SectionTitle>
          <Panel>
            <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Горизонт', 'Скважин', 'Обв., %'].map((h) => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {f.horizons.map((h) => (
                  <tr key={h.name}>
                    <td style={TD}>{h.name}</td>
                    <td style={NUM}>{h.n}</td>
                    <td style={NUM}>{num(h.wc, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      </div>

      <SectionTitle aside="до и после заходов">Наши скважины</SectionTitle>
      <Panel style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: 28 }} />
                <th style={TH}>Скважина</th>
                <th style={TH}>Горизонт</th>
                <th style={{ ...TH, textAlign: 'right' }}>Qн, т/сут</th>
                <th style={{ ...TH, textAlign: 'right' }}>Qж, м³/сут</th>
                <th style={{ ...TH, textAlign: 'right' }}>Обв., %</th>
              </tr>
            </thead>
            <tbody>
              {f.ours.map((o) => (
                <tr key={o.w}>
                  <td style={{ ...TD, paddingRight: 0 }}>
                    <StatusDot level={o.obv === null ? 'none' : o.obv > 80 ? 'crit' : o.obv > 60 ? 'warn' : 'ok'} />
                  </td>
                  <td style={TD}>
                    <Link href={`/app/field/wells/${o.w}`} style={{ textDecoration: 'none' }}>
                      <span style={{ borderBottom: '1px solid var(--ss-line)' }}>Скважина {o.w}</span>
                    </Link>
                  </td>
                  <td style={{ ...TD, color: 'var(--ss-ink-quiet)' }}>{o.gor}</td>
                  <td style={NUM}>{num(o.qn, 2)}</td>
                  <td style={NUM}>{num(o.qzh, 1)}</td>
                  <td style={NUM}>{num(o.obv, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel quiet style={{ padding: 20, maxWidth: 860 }}>
        <div className="ss-label">Как считается</div>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
          Обводнённость фонда — отношение суммарной добычи воды к суммарной добыче жидкости,
          а не среднее по скважинам: среднее завысило бы вклад малодебитных скважин.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
          Экономия воды считается при одном допущении: отбор жидкости берётся сегодняшний,
          а обводнённость подставляется та, что была до работ. Фактически после изоляции отбор
          тоже менялся, поэтому цифра — оценка порядка величины, а не точный баланс.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10, color: 'var(--ss-ink-quiet)' }}>
          Поскважинные показатели остального фонда не выгружаются: на странице только агрегаты —
          суммы, доли и количества, — и наши скважины поимённо.
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
const NUM = { ...TD, textAlign: 'right', whiteSpace: 'nowrap' } as const;
