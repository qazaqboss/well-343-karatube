import {
  AssetTable,
  AttentionList,
  KpiCard,
  KpiStrip,
  Panel,
  SectionTitle,
  StatusDot,
  type AssetTableRow,
  type Level,
} from '@subsoil/ui';
import { day, dayShort, int, num, pct, pp, signed, EMPTY } from '@subsoil/shared';
import type { Scope } from '@subsoil/shared';
import { api } from '@/lib/api';
import { ProductionChart } from './production-chart';
import { ScopeBar } from './scope-bar';

/**
 * Сводка — один экран для всех трёх уровней.
 *
 * Холдинг, компания и месторождение отличаются только тем, что подставлено
 * в scope: макет, формулы и порядок блоков общие (03-holding-dashboard.md).
 */
export async function SummaryScreen({ scope, id }: { scope: Scope; id: string | null }) {
  const [summary, requirements] = await Promise.all([
    api.getSummary({ scope, id }),
    api.getRequirements({ scope, id, days: 30 }),
  ]);

  const k = summary.kpi;
  const isField = scope === 'field';

  const rows: AssetTableRow[] = summary.assets.map((a) => ({
    key: `${a.companyId}:${a.fieldId ?? a.name}`,
    href: a.href,
    status: a.status,
    name: a.name,
    subtitle: isField ? a.requirementsNote : a.companyName,
    oil: num(a.oil, 1),
    deltaDay: signed(a.deltaDay, 1),
    deltaLevel: deltaLevelForOil(a.deltaDay),
    waterCut: num(a.waterCut, 1),
    fund: a.fund,
    planPct: a.planPct === null ? EMPTY : int(a.planPct),
    requirements: isField ? EMPTY : a.requirementsNote,
    requirementsLevel: isField ? 'none' : (a.requirementsStatus as Level),
    nextDue: a.nextDue ? dayShort(a.nextDue) : EMPTY,
  }));

  return (
    <>
      <ScopeBar scope={scope} id={id} asOf={summary.asOf} />

      <SectionTitle aside={`${summary.attention.length} ${summary.attention.length === 1 ? 'пункт' : 'пунктов'}`}>
        Внимание сегодня
      </SectionTitle>
      <Panel style={{ marginBottom: 32 }}>
        <AttentionList items={summary.attention} />
      </Panel>

      <SectionTitle aside="клик по карточке открывает источник">Показатели</SectionTitle>
      <div style={{ marginBottom: 32 }}>
        <KpiStrip>
          <KpiCard
            label="Нефть, т/сут"
            value={num(k.oilTDay.value, 1)}
            delta={signed(k.oilTDay.deltaDay, 1)}
            deltaLevel={deltaLevelForOil(k.oilTDay.deltaDay ?? null)}
            note={k.oilTDay.planPct === null ? 'плана нет' : `${int(k.oilTDay.planPct)} % плана к дате`}
            href="/app/field"
          />
          <KpiCard
            label="Жидкость, м³/сут"
            value={int(k.liquidM3Day.value)}
            delta={signed(k.liquidM3Day.deltaDay, 1)}
            deltaLevel="none"
            href="/app/field/wells"
          />
          <KpiCard
            label="Обводнённость"
            value={pct(k.waterCutPct.value, 1)}
            delta={pp(k.waterCutPct.deltaDayPp, 1)}
            deltaLevel={deltaLevelForWater(k.waterCutPct.deltaDayPp ?? null)}
            note="средневзвешенная по потокам"
            href="/app/field/water-cut"
          />
          <KpiCard
            label="Фонд"
            value={`${k.fund.working} / ${k.fund.total}`}
            note={k.fund.stopped > 0 ? `${k.fund.stopped} в простое` : 'простоя нет'}
            deltaLevel={k.fund.stopped > 0 ? 'warn' : 'ok'}
            href="/app/field/wells"
          />
          <KpiCard
            label="Требования"
            value={`${k.requirements.overdue} просроч.`}
            note={`${k.requirements.next30d} в ближайшие 30 дней`}
            deltaLevel={k.requirements.overdue > 0 ? 'crit' : k.requirements.next30d > 0 ? 'warn' : 'ok'}
            href="/app/subsoil/obligations"
          />
        </KpiStrip>
      </div>

      <SectionTitle aside={isField ? 'строка — скважина' : 'строка — месторождение · клик спускает на уровень ниже'}>
        {isField ? 'Скважины' : 'Активы'}
      </SectionTitle>
      <Panel style={{ marginBottom: 32 }}>
        <AssetTable rows={rows} nameHeader={isField ? 'Скважина' : 'Компания / месторождение'} />
      </Panel>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)',
          gap: 24,
          marginBottom: 32,
          alignItems: 'start',
        }}
      >
        <div>
          <SectionTitle aside="90 дней">Добыча</SectionTitle>
          <Panel style={{ padding: 16 }}>
            <ProductionChart scope={scope} id={id} />
          </Panel>
        </div>

        <div>
          <SectionTitle>Эффект NanoCem UT-9</SectionTitle>
          <Panel style={{ padding: 20 }}>
            <dl style={{ display: 'grid', gap: 14, margin: 0 }}>
              <Stat label="Заходов" value={int(summary.nanocem.jobs)} href="/app/nanocem" />
              <Stat
                label="Успешных"
                value={`${summary.nanocem.successful} из ${summary.nanocem.jobs}`}
                href="/app/nanocem"
              />
              <Stat
                label="Суммарный прирост"
                value={`${signed(summary.nanocem.oilGainTDay, 1)} т/сут`}
                href="/app/nanocem"
              />
              <Stat
                label="Последний заход"
                value={summary.nanocem.lastJobDate ? day(summary.nanocem.lastJobDate) : EMPTY}
                href="/app/nanocem"
              />
            </dl>
            <p style={{ fontSize: 12, color: 'var(--ss-ink-quiet)', marginTop: 16, lineHeight: 1.6 }}>
              Прирост — средний дебит 14 суток после захода минус 14 суток до. Заходы без
              результата в сумму не входят.
            </p>
          </Panel>
        </div>
      </div>

      <SectionTitle aside={`${requirements.overdue} просрочено · ${requirements.next30d} в 30 дней`}>
        Требования — ближайшие 30 дней
      </SectionTitle>
      <Panel>
        {requirements.items.length === 0 ? (
          <div style={{ padding: 20, fontSize: 13, color: 'var(--ss-ink-quiet)' }}>
            На ближайшие 30 дней сроков нет.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="ss-nums" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr>
                  {['Срок', 'Компания', 'Что', 'Орган', 'Ответственный', ''].map((h, i) => (
                    <th
                      key={h || i}
                      style={{
                        textAlign: 'left',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--ss-ink-quiet)',
                        fontWeight: 500,
                        padding: '0 12px 8px',
                        borderBottom: '1px solid var(--ss-line)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requirements.items.map((r) => (
                  <tr key={r.id}>
                    <td style={{ ...CELL, whiteSpace: 'nowrap' }}>{dayShort(r.dueDate)}</td>
                    <td style={CELL}>{r.companyName}</td>
                    <td style={CELL}>
                      <a href={r.href} style={{ textDecoration: 'none', borderBottom: '1px solid var(--ss-line)' }}>
                        {r.title}
                      </a>
                    </td>
                    <td style={{ ...CELL, color: 'var(--ss-ink-quiet)' }}>{r.authority ?? EMPTY}</td>
                    <td style={{ ...CELL, color: 'var(--ss-ink-quiet)' }}>{r.owner ?? EMPTY}</td>
                    <td style={{ ...CELL, width: 28 }}>
                      <StatusDot level={r.status === 'overdue' ? 'crit' : r.status === 'due_soon' ? 'warn' : 'none'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}

const CELL = {
  padding: 12,
  borderBottom: '1px solid var(--ss-line)',
  fontSize: 14,
} as const;

function Stat({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
      <dt className="ss-label">{label}</dt>
      <dd style={{ margin: 0 }}>
        <a href={href} style={{ textDecoration: 'none', borderBottom: '1px solid var(--ss-line)' }}>
          {value}
        </a>
      </dd>
    </div>
  );
}

/** Нефть: рост — хорошо. */
function deltaLevelForOil(v: number | null): Level {
  if (v === null) return 'none';
  if (v > 0) return 'ok';
  if (v < 0) return 'warn';
  return 'none';
}

/** Вода: рост — плохо. Знак тот же, смысл обратный (09-design-system.md). */
function deltaLevelForWater(v: number | null): Level {
  if (v === null) return 'none';
  if (v > 0) return 'warn';
  if (v < 0) return 'ok';
  return 'none';
}
