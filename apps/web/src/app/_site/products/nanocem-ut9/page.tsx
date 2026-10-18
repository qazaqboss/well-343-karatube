import { Button, Hero, Panel, SectionTitle } from '@subsoil/ui';

export const metadata = { title: 'NanoCem UT-9 — ультратонкий тампонажный цемент' };

const SPECS = [
  ['Тонкость помола', 'D95 ≤ 9 мкм'],
  ['Назначение', 'изоляция водопритока, ремонтно-изоляционные работы'],
  ['Способ', 'закачка под давлением в интервалы перфорации'],
  ['Прочность на 28 суток', '65–75 МПа'],
];

export default function ProductPage() {
  return (
    <>
      <Hero
        eyebrow="Продукт"
        title="NANOCEM UT-9"
        lead="Ультратонкий тампонажный цемент для изоляции водопритока. Помол позволяет входить в трещины и поры, куда обычный тампонажный цемент не проходит."
        actions={<Button href="/demo">Запросить демо</Button>}
        watermark="UT-9"
      />

      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle>Характеристики</SectionTitle>
        <Panel style={{ padding: 0, maxWidth: 680 }}>
          <dl style={{ margin: 0 }}>
            {SPECS.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '14px 20px', borderBottom: '1px solid var(--ss-line)' }}>
                <dt className="ss-label">{k}</dt>
                <dd className="ss-nums" style={{ margin: 0, fontSize: 14 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </section>

      <section className="ss-wrap" style={{ paddingBottom: 56 }}>
        <SectionTitle>Почему помол решает</SectionTitle>
        <Panel quiet style={{ padding: 24, maxWidth: 820 }}>
          <p style={{ fontSize: 15, lineHeight: 1.7 }}>
            Обычный тампонажный цемент останавливается на входе в трещину: крупные зёрна образуют
            мост, вода продолжает идти мимо. Ультратонкий помол проходит дальше и перекрывает путь
            там, где он действительно есть.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, marginTop: 14 }}>
            Это не отменяет главного ограничения: изоляция перфорации не помогает, если вода идёт
            за колонной. Поэтому кандидаты отбираются по положению скважины и состоянию заколонного
            цемента, а не по уровню обводнённости.
          </p>
        </Panel>
      </section>
    </>
  );
}
