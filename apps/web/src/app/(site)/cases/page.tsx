import { Hero, Panel, SectionTitle } from '@subsoil/ui';
import { CASES } from '@/lib/site-content';

export const metadata = { title: 'Кейсы — Subsoil' };

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="Кейсы"
        title="ДО И ПОСЛЕ"
        lead="Результаты обезличены: номера скважин, оператор и название месторождения не раскрываются. Оговорки по срокам наблюдения приведены там же, где цифры."
        watermark="±"
      />
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle aside="данные клиентов не публикуются">Разбор</SectionTitle>
        <div style={{ display: 'grid', gap: 16, maxWidth: 860 }}>
          {CASES.map((c) => (
            <Panel key={c.title} style={{ padding: 24 }}>
              <h3 className="ss-display" style={{ fontSize: 18, fontWeight: 600 }}>{c.title}</h3>
              <div className="ss-nums ss-display" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>{c.metric}</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>
                <b>Было. </b>{c.before}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>
                <b>Стало. </b>{c.after}
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 12 }}>{c.note}</p>
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}
