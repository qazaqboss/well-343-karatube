import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KpiCard, KpiStrip, Panel, SectionTitle, StatusDot } from '@subsoil/ui';
import { getJobs, getWell, listWells } from '@/lib/real/build';
import { WellChart } from '@/components/well-chart';

export function generateStaticParams() {
  return listWells().map((w) => ({ wellId: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ wellId: string }> }) {
  const { wellId } = await params;
  return { title: `Скважина ${wellId} — Subsoil` };
}

export default async function WellPage({ params }: { params: Promise<{ wellId: string }> }) {
  const { wellId } = await params;
  const well = getWell(wellId);
  if (!well) notFound();

  const measured = well.daily.filter((r) => r.qn !== null);
  const points = measured.map((r) => ({ d: r.d, qn: r.qn, obv: r.obv }));
  const job = getJobs().find((j) => j.well === well.id);

  // Ключевые события журнала — те сутки, где проставлено ev.
  const events = well.daily.filter((r) => r.ev).slice(-8).reverse();

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <Link href="/app/field/wells" className="ss-label" style={{ textDecoration: 'none' }}>
          ← Фонд скважин
        </Link>
      </div>

      <SectionTitle aside={`${well.statusLabel} · ${well.statusDetail}`}>{well.title}</SectionTitle>

      <div style={{ marginBottom: 24 }}>
        <KpiStrip>
          <KpiCard label="Qн · последний замер" value={well.last.qn} note={`т/сут · ${well.last.date}`} />
          <KpiCard label="Обводнённость" value={`${well.last.obv} %`} note="последний замер" />
          <KpiCard label="Qж" value={well.last.qzh} note="м³/сут" />
          <KpiCard
            label="Итог изоляции"
            value={well.seal.entries}
            note={well.seal.label}
            deltaLevel={well.level}
          />
          <KpiCard label="Суток с замером" value={String(measured.length)} note={`всего ${well.daily.length}`} />
        </KpiStrip>
      </div>

      <SectionTitle>Динамика</SectionTitle>
      <Panel style={{ padding: 16, marginBottom: 24 }}>
        <WellChart points={points} markers={job ? [{ d: shortDate(job.date), label: 'ЦПД UT-9' }] : []} />
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
        <div>
          <SectionTitle>Что происходит</SectionTitle>
          <Panel style={{ padding: 20 }}>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{well.note}</p>
          </Panel>
        </div>

        <div>
          <SectionTitle>Заход NanoCem UT-9</SectionTitle>
          <Panel style={{ padding: 20 }}>
            <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
              <Row label="Итог" value={well.seal.label} level={well.level} />
              <Row label="Дата захода" value={well.seal.date} />
              <Row label="Заходов" value={well.seal.entries} />
              <Row label="Зона залежи" value={well.seal.zone} />
              <Row label="Показатель" value={well.seal.qobv} />
              {job?.gain !== null && job?.gain !== undefined ? (
                <Row
                  label="Прирост к базе"
                  value={`${job.gain > 0 ? '+' : '−'}${Math.abs(job.gain).toFixed(2).replace('.', ',')} т/сут`}
                  level={job.gain > 0 ? 'ok' : 'crit'}
                />
              ) : null}
            </dl>
            <p style={{ fontSize: 12, color: 'var(--ss-ink-quiet)', marginTop: 14, lineHeight: 1.6 }}>
              {well.seal.note}
            </p>
          </Panel>
        </div>
      </div>

      <SectionTitle aside={`${events.length} записей`}>Ключевые события</SectionTitle>
      <Panel style={{ marginBottom: 24 }}>
        {events.length === 0 ? (
          <div style={{ padding: 20, fontSize: 13, color: 'var(--ss-ink-quiet)' }}>
            В журнале нет отмеченных событий.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {events.map((e) => (
              <li
                key={e.d}
                style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--ss-line)' }}
              >
                <span className="ss-nums ss-label">{e.d}</span>
                <span style={{ fontSize: 14, lineHeight: 1.6 }}>{e.comment}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <SectionTitle aside="последние 30 суток">Журнал</SectionTitle>
      <Panel>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr>
                {['Дата', 'Фаза', 'Qж', 'Qн', 'Обв., %', 'Комментарий'].map((h) => (
                  <th key={h} style={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {well.daily.slice(-30).reverse().map((r) => (
                <tr key={r.d}>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{r.d}</td>
                  <td style={{ ...TD, color: 'var(--ss-ink-quiet)', fontSize: 12 }}>{r.phase}</td>
                  <td style={NUM}>{fmt(r.qzh, 1)}</td>
                  <td style={NUM}>{fmt(r.qn, 2)}</td>
                  <td style={NUM}>{fmt(r.obv, 1)}</td>
                  <td style={{ ...TD, fontSize: 13, color: 'var(--ss-ink-quiet)' }}>{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function Row({ label, value, level }: { label: string; value: string; level?: 'ok' | 'warn' | 'crit' | 'none' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
      <dt className="ss-label">{label}</dt>
      <dd style={{ margin: 0, fontSize: 14, textAlign: 'right', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
        {level ? <StatusDot level={level} /> : null}
        {value}
      </dd>
    </div>
  );
}

function fmt(v: number | null, digits: number): string {
  if (v === null) return '—';
  return v.toFixed(digits).replace('.', ',');
}

/** ISO → «ДД.ММ», как подписаны сутки в журнале. */
function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
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
