import Link from 'next/link';
import { KpiCard, KpiStrip, Panel, SectionTitle, StatusDot } from '@subsoil/ui';
import { num, signed } from '@subsoil/shared';
import { FUND_META, getFundAnalytics, getJobs } from '@/lib/real/build';

export const metadata = { title: 'NanoCem UT-9 — Subsoil' };

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

export default function NanocemPage() {
  const jobs = getJobs();
  const f = getFundAnalytics();

  const withResult = jobs.filter((j) => j.gain !== null);
  const gain = withResult.reduce((s, j) => s + (j.gain ?? 0), 0);
  const success = jobs.filter((j) => j.seal && ['first', 'second', 'confirmed', 'tested'].includes(j.seal.code));

  return (
    <>
      <SectionTitle aside={`данные на ${FUND_META.updated}`}>Эффект NanoCem UT-9</SectionTitle>

      <div style={{ marginBottom: 24 }}>
        <KpiStrip>
          <KpiCard label="Заходов" value={String(jobs.length)} note="скважин обработано" />
          <KpiCard
            label="Герметично"
            value={`${success.length} из ${jobs.length}`}
            note="по итогу изоляции"
            deltaLevel="ok"
          />
          <KpiCard
            label="Прирост нефти"
            value={`${signed(gain, 1)} т/сут`}
            note={`по ${withResult.length} заходам с результатом`}
            deltaLevel={gain > 0 ? 'ok' : 'warn'}
          />
          <KpiCard
            label="Экономия воды"
            value={`${num(f.effect.waterSaved, 1)} м³/сут`}
            note={`фонд ниже на ${num(f.effect.delta, 2)} п.п.`}
            deltaLevel="ok"
            href="/app/field/water-cut"
          />
          <KpiCard label="Последний заход" value={fmtDate(jobs.at(-1)?.date ?? null)} note="ЦПД" />
        </KpiStrip>
      </div>

      <SectionTitle aside="прирост = 14 суток после минус 14 суток до">Заходы</SectionTitle>
      <Panel style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: 28 }} />
                <th style={TH}>Скважина</th>
                <th style={TH}>Дата</th>
                <th style={{ ...TH, textAlign: 'right' }}>Было, т/сут</th>
                <th style={{ ...TH, textAlign: 'right' }}>Стало, т/сут</th>
                <th style={{ ...TH, textAlign: 'right' }}>Прирост</th>
                <th style={TH}>Итог изоляции</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.well}>
                  <td style={{ ...TD, paddingRight: 0 }}>
                    <StatusDot level={j.seal ? LEVEL[j.seal.code] ?? 'none' : 'none'} />
                  </td>
                  <td style={TD}>
                    <Link href={`/app/field/wells/${j.well}`} style={{ textDecoration: 'none' }}>
                      <span style={{ borderBottom: '1px solid var(--ss-line)' }}>{j.title}</span>
                    </Link>
                  </td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{fmtDate(j.date)}</td>
                  <td style={NUM}>{j.oilBefore === null ? '—' : num(j.oilBefore, 2)}</td>
                  <td style={NUM}>{j.oilAfter === null ? '—' : num(j.oilAfter, 2)}</td>
                  <td
                    style={{
                      ...NUM,
                      color: j.gain === null ? 'var(--ss-ink-quiet)' : j.gain > 0 ? 'var(--ss-ok)' : 'var(--ss-crit)',
                    }}
                  >
                    {j.gain === null ? '—' : signed(j.gain, 2)}
                  </td>
                  <td style={{ ...TD, fontSize: 13 }}>{j.seal?.label ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel quiet style={{ padding: 20, maxWidth: 860 }}>
        <div className="ss-label">Оговорки</div>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
          По <b>301</b> дореремонтного замера в сопоставимом режиме нет, по <b>305</b> сменён объект —
          эти два захода в оценку прироста не входят, но в число выполненных работ входят.
          По <b>363</b> результата ещё нет: скважина запущена и даёт пусковую воду.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
          Срок наблюдения имеет значение: вывод об устойчивости делается не раньше трёх месяцев.
          На 311 промежуточная стабилизация продержалась шесть недель и оказалась не итогом.
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10, color: 'var(--ss-ink-quiet)' }}>
          Разбор герметичности по каждому заходу —{' '}
          <Link href="/app/nanocem/sealing" style={{ borderBottom: '1px solid var(--ss-line)' }}>
            на отдельной странице
          </Link>
          .
        </p>
      </Panel>
    </>
  );
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
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
