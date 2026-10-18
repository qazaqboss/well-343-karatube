import Link from 'next/link';
import { KpiCard, KpiStrip, Panel, SectionTitle, StatusDot } from '@subsoil/ui';
import program from '@/lib/data/program.json';
import { listWells } from '@/lib/real/build';

export const metadata = { title: 'Программа UT-9 — Subsoil' };

type Candidate = (typeof program.candidates)[number];

/** Скважины, где заход уже сделан: отмечаем их в списке кандидатов. */
function doneWells(): Set<string> {
  return new Set(listWells().map((w) => w.id));
}

export default function ProgramPage() {
  const done = doneWells();
  // Ключи '10' и '11' JS трактует как индексы массива и выдаёт раньше '08'/'09',
  // поэтому порядок задаём явно сортировкой, а не полагаемся на порядок полей.
  const months = (Object.entries(program.months) as [string, string][]).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const byMonth = months.map(([key, name]) => ({
    key,
    name,
    items: program.candidates.filter((c) => c.month === key),
  }));

  const byScenario = Object.entries(program.scenarios).map(([key, s]) => ({
    key,
    ...s,
    count: program.candidates.filter((c) => c.scenario === key).length,
  }));

  const peak = byMonth.reduce((a, b) => (b.items.length > a.items.length ? b : a), byMonth[0]!);

  return (
    <>
      <SectionTitle aside="II полугодие 2026">Программа NanoCem UT-9</SectionTitle>

      <div style={{ marginBottom: 24 }}>
        <KpiStrip>
          <KpiCard label="Кандидатов" value={String(program.candidates.length)} note="скважин в перечне" />
          <KpiCard
            label="Уже сделано в фонде"
            value={String(done.size)}
            note="заходов вне этого перечня"
            deltaLevel="ok"
            href="/app/nanocem"
          />
          <KpiCard
            label="Пиковый месяц"
            value={String(peak.items.length)}
            note={`${peak.name.toLowerCase()} — плотный участок`}
            deltaLevel="warn"
          />
          <KpiCard
            label="Расход цемента"
            value={`≈${(program.candidates.length * 3).toFixed(0)} т`}
            note="из расчёта ≈3 т на заход"
          />
          <KpiCard label="Сценариев" value={String(byScenario.length)} note="способов применения" />
        </KpiStrip>
      </div>

      <SectionTitle aside="по декадам">Волны заходов</SectionTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 1,
          background: 'var(--ss-line)',
          border: '1px solid var(--ss-line)',
          marginBottom: 24,
        }}
      >
        {byMonth.map((m) => (
          <div key={m.key} style={{ background: 'var(--ss-bg)', padding: 20 }}>
            <div className="ss-label">{m.name} 2026</div>
            <div className="ss-nums" style={{ fontSize: 28, fontWeight: 600, marginTop: 6 }}>
              {m.items.length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ss-ink-quiet)', marginTop: 4 }}>
              {m.items.length === 1 ? 'скважина' : m.items.length < 5 ? 'скважины' : 'скважин'}
            </div>
            <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'grid', gap: 6 }}>
              {m.items.map((c) => (
                <li key={c.well} style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <StatusDot level={done.has(c.well) ? 'ok' : 'none'} />
                  <span>{c.well}</span>
                  <span style={{ color: 'var(--ss-ink-quiet)', fontSize: 12 }}>
                    {program.decades[c.decade]} декада
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SectionTitle aside="что именно делаем">Сценарии применения</SectionTitle>
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}
      >
        {byScenario.map((s) => (
          <Panel key={s.key} style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
              <h3 className="ss-display" style={{ fontSize: 16, fontWeight: 600 }}>
                {s.name}
              </h3>
              <span className="ss-nums ss-label">{s.count} скв.</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ss-ink-quiet)', marginTop: 10 }}>{s.text}</p>
            <p style={{ fontSize: 12, lineHeight: 1.6, marginTop: 10 }}>
              <span className="ss-label">Применимость</span>
              <br />
              {s.fit}
            </p>
          </Panel>
        ))}
      </div>

      <SectionTitle aside={`${program.candidates.length} скважин`}>Перечень кандидатов</SectionTitle>
      <Panel style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: 28 }} />
                <th style={TH}>Скважина</th>
                <th style={TH}>Период</th>
                <th style={TH}>Сценарий</th>
                <th style={TH}>Объект изоляции</th>
              </tr>
            </thead>
            <tbody>
              {program.candidates.map((c: Candidate) => (
                <tr key={c.well}>
                  <td style={{ ...TD, paddingRight: 0 }}>
                    <StatusDot level={done.has(c.well) ? 'ok' : 'none'} title={done.has(c.well) ? 'заход выполнен' : 'в плане'} />
                  </td>
                  <td style={TD}>
                    {done.has(c.well) ? (
                      <Link href={`/app/field/wells/${c.well}`} style={{ textDecoration: 'none' }}>
                        <span style={{ borderBottom: '1px solid var(--ss-line)' }}>Скв. {c.well}</span>
                      </Link>
                    ) : (
                      <span>Скв. {c.well}</span>
                    )}
                  </td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>
                    {program.decades[c.decade]} декада · {program.months[c.month as keyof typeof program.months].toLowerCase()}
                  </td>
                  <td style={{ ...TD, fontSize: 13 }}>
                    {program.scenarios[c.scenario as keyof typeof program.scenarios].name}
                  </td>
                  <td style={{ ...TD, fontSize: 13, color: 'var(--ss-ink-quiet)' }}>{c.object}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel quiet style={{ padding: 20, maxWidth: 860 }}>
        <div className="ss-label">Оговорка</div>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>{program.note}</p>
        <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 10, color: 'var(--ss-ink-quiet)' }}>
          Это перечень будущих работ: скважины в нём не пересекаются с теми восемью, где заход уже
          сделан. Результат выполненных заходов — в разделе{' '}
          <Link href="/app/nanocem" style={{ borderBottom: '1px solid var(--ss-line)' }}>
            эффекта UT-9
          </Link>
          . Отбирать остальных кандидатов стоит по положению скважины и состоянию заколонного
          цемента: уровень обводнённости сам по себе исход не предсказывает.
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
