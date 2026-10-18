import { Hero, Panel, SectionTitle } from '@subsoil/ui';

export const metadata = { title: 'Ресурсы — Subsoil' };

const TOPICS = [
  ['Кодекс о недрах: что требуется на каждом этапе', 'Разбор обязательств по этапам 1–7 и сроков отчётности.'],
  ['Карта отчётности недропользователя', 'Какой орган, какая форма, какая периодичность.'],
  ['Ремонтно-изоляционные работы: когда они окупаются', 'Отбор кандидатов и оценка эффекта в т/сут.'],
  ['Заколонный переток: почему изоляция перфорации не всегда помогает', 'АКЦ, ЭМДС и что они на самом деле показывают.'],
];

export default function Page() {
  return (
    <>
      <Hero eyebrow="Ресурсы" title="СТАТЬИ И РАЗБОРЫ" lead="Материалы по недропользованию, отчётности и изоляции водопритока." watermark="DOC" />
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle aside="готовятся">Темы</SectionTitle>
        <div style={{ display: 'grid', gap: 12, maxWidth: 820 }}>
          {TOPICS.map(([t, d]) => (
            <Panel key={t} style={{ padding: 20 }}>
              <h3 className="ss-display" style={{ fontSize: 16, fontWeight: 600 }}>{t}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 6 }}>{d}</p>
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}
