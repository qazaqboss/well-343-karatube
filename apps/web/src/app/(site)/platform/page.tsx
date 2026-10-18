import { Button, Hero, Panel, SectionTitle } from '@subsoil/ui';
import { PLATFORM_STEPS } from '@/lib/site-content';

export const metadata = { title: 'Как устроена платформа — Subsoil' };

export default function PlatformPage() {
  return (
    <>
      <Hero
        eyebrow="Платформа"
        title="ДАННЫЕ → МОДУЛИ → СВОДКА → ОТЧЁТ"
        lead="Один поток данных: замер на скважине попадает в показатели, показатели — в сводку руководства, те же данные — в отчёт по этапу. Повторного сбора нет нигде."
        actions={<Button href="/demo">Запросить демо</Button>}
        watermark="01—05"
      />

      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle aside="пять шагов">Путь данных</SectionTitle>
        <div style={{ display: 'grid', gap: 16 }}>
          {PLATFORM_STEPS.map((s) => (
            <Panel key={s.n} style={{ padding: 20, display: 'grid', gridTemplateColumns: '64px 1fr', gap: 16 }}>
              <div className="ss-display" style={{ fontSize: 28, fontWeight: 700, color: 'var(--ss-ink-quiet)' }}>
                {s.n}
              </div>
              <div>
                <h3 className="ss-display" style={{ fontSize: 18, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ss-ink-quiet)', marginTop: 6 }}>{s.text}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="ss-wrap" style={{ paddingBottom: 56 }}>
        <SectionTitle>Чем отличается от набора таблиц</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            ['Единые формулы', 'Нефть из замера, средневзвешенная обводнённость и процент плана считаются в одном месте. Веб и API берут их оттуда, поэтому цифра на сводке и цифра в отчёте не могут разойтись.'],
            ['Показатель рядом с требованием', 'У каждого месторождения на одной строке и добыча, и ближайший срок по обязательствам. Это разные контуры, но решение по ним принимает один человек.'],
            ['Сводка про отклонения', 'Наверху то, что требует решения сегодня. Зелёное свёрнуто — его не нужно просматривать.'],
            ['Каждое число кликабельно', 'От показателя можно дойти до источника: замера, документа, записи в журнале.'],
          ].map(([t, d]) => (
            <Panel key={t} style={{ padding: 20 }}>
              <h3 className="ss-display" style={{ fontSize: 16, fontWeight: 600 }}>{t}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>{d}</p>
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}
