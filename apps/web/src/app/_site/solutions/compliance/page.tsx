import { Button, Hero, Panel, SectionTitle } from '@subsoil/ui';

export const metadata = { title: 'Решение: не пропустить обязательства — Subsoil' };

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="Решение"
        title="НЕ ПРОПУСТИТЬ ОБЯЗАТЕЛЬСТВА"
        lead="Сроки по контракту на недропользование приходят не вместе. Система считает их сама и предупреждает заранее, а не постфактум."
        actions={<Button href="/demo">Запросить демо</Button>}
        watermark="30"
      />
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle>Что отслеживается</SectionTitle>
        <div style={{ display: 'grid', gap: 16, maxWidth: 820 }}>
          {[
            ['Обязательства по контракту', 'Рабочая программа, местное содержание, социальные обязательства, обучение кадров, ликвидационный фонд.'],
            ['Карта отчётности', 'Какой орган, какая форма, какая периодичность. Сроки рассчитываются правилом, а не вносятся руками.'],
            ['Предупреждения', 'Просрочено — критично. Срок в ближайшие 7 дней и контракт, истекающий в ближайшие 90 дней, — внимание.'],
            ['Подтверждение', 'Отметка о сдаче с документом. Выполненное остаётся выполненным, даже если срок давно прошёл.'],
          ].map(([t, d]) => (
            <Panel key={t} style={{ padding: 20 }}>
              <h3 className="ss-display" style={{ fontSize: 17, fontWeight: 600 }}>{t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>{d}</p>
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}
