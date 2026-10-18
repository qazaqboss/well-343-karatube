import { Button, Hero, ModuleCard, Panel, ProofStrip, SectionTitle } from '@subsoil/ui';
import { AI_QUESTIONS, CASES, MODULES, PLATFORM_STEPS, PROOF } from '@/lib/site-content';

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Холдинговая платформа · Недропользование · Промысел"
        title={
          <>
            SUBSOIL. ПОКАЗАТЕЛИ <span style={{ color: 'var(--ss-ink-quiet)' }}>И</span> ТРЕБОВАНИЯ —
            <br />
            НА ОДНОМ ЭКРАНЕ
          </>
        }
        lead="От суточного замера на скважине до отчёта по этапу недропользования. Руководство видит добычу, отклонения и сроки по всем активам сразу."
        actions={
          <>
            <Button href="/demo">Запросить демо</Button>
            <Button href="/platform" variant="secondary">
              Как устроена платформа →
            </Button>
          </>
        }
        watermark="J1-IV"
      />

      <ProofStrip items={PROOF} />

      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle aside="данные вводятся один раз">Одна платформа</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, background: 'var(--ss-line)', border: '1px solid var(--ss-line)' }}>
          {PLATFORM_STEPS.map((s) => (
            <div key={s.n} style={{ background: 'var(--ss-bg)', padding: 20 }}>
              <div className="ss-label">{s.n}</div>
              <h3 className="ss-display" style={{ fontSize: 17, fontWeight: 600, marginTop: 8 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ss-wrap" style={{ paddingBottom: 56 }}>
        <SectionTitle aside="пять модулей поверх общих данных">Модули</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {MODULES.map((m) => (
            <ModuleCard key={m.slug} index={m.index} title={m.title} text={m.text} href={`/modules/${m.slug}`} />
          ))}
        </div>
      </section>

      <section className="ss-wrap" style={{ paddingBottom: 56 }}>
        <SectionTitle aside="сводка холдинга">Для руководства</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { t: 'Что добыли', d: 'Нефть, жидкость и обводнённость по всем активам — с дельтой к вчера и процентом плана к дате.' },
            { t: 'Где проблемы', d: 'Лента «Внимание сегодня»: просроченные обязательства, скачки воды, простои, зависшие команды.' },
            { t: 'Какие сроки горят', d: 'Обязательства и отчётность на ближайшие 30 дней — с органом, ответственным и статусом.' },
          ].map((x) => (
            <Panel key={x.t} style={{ padding: 20 }}>
              <h3 className="ss-display" style={{ fontSize: 17, fontWeight: 600 }}>
                {x.t}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>{x.d}</p>
            </Panel>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--ss-ink-quiet)', marginTop: 16 }}>
          Кабинет открыт по логину: живых данных на публичных страницах нет.{' '}
          <a href="/login" style={{ borderBottom: '1px solid var(--ss-line)' }}>
            Посмотреть сводку на демо-данных →
          </a>
        </p>
      </section>

      <section className="ss-wrap" style={{ paddingBottom: 56 }}>
        <SectionTitle>AI-помощник</SectionTitle>
        <Panel quiet style={{ padding: 24 }}>
          <p style={{ fontSize: 15, lineHeight: 1.65, maxWidth: 680 }}>
            Отвечает и по Кодексу о недрах, и по фактическому состоянию активов — со ссылкой на статью
            или на конкретный замер.
          </p>
          <ul style={{ margin: '16px 0 0', paddingLeft: 18, fontSize: 14, lineHeight: 1.9, color: 'var(--ss-ink-quiet)' }}>
            {AI_QUESTIONS.map((q) => (
              <li key={q}>«{q}»</li>
            ))}
          </ul>
        </Panel>
      </section>

      <section className="ss-wrap" style={{ paddingBottom: 56 }}>
        <SectionTitle aside="кейсы обезличены">До и после</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {CASES.slice(0, 3).map((c) => (
            <Panel key={c.title} style={{ padding: 20 }}>
              <h3 className="ss-display" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>
                {c.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 12 }}>
                <b style={{ color: 'var(--ss-ink)' }}>Было. </b>
                {c.before}
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>
                <b style={{ color: 'var(--ss-ink)' }}>Стало. </b>
                {c.after}
              </p>
            </Panel>
          ))}
        </div>
      </section>

      <section style={{ borderTop: '1px solid var(--ss-line)', background: 'var(--ss-panel)' }}>
        <div className="ss-wrap" style={{ paddingBlock: 48, display: 'flex', gap: 24, justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <h2 className="ss-display" style={{ fontSize: 28, fontWeight: 700 }}>
              Посмотреть на своих данных
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ss-ink-quiet)', marginTop: 8, maxWidth: 560 }}>
              Покажем сводку на одном вашем месторождении: что добыли, где отклонения, какие сроки горят.
            </p>
          </div>
          <Button href="/demo">Запросить демо</Button>
        </div>
      </section>
    </>
  );
}
