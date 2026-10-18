import { Button, Hero, Panel, SectionTitle } from '@subsoil/ui';
import { STAGES } from '@/lib/site-content';

export const metadata = { title: '7 этапов недропользования РК — Subsoil' };

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="Недропользование РК"
        title="СЕМЬ ЭТАПОВ НЕДРОПОЛЬЗОВАНИЯ"
        lead="От разведки до сдачи контрактной территории: что требуется на каждом этапе, какие документы и отчёты нужно выпустить."
        actions={<Button href="/demo">Запросить демо</Button>}
        watermark="1—7"
      />
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle aside="Кодекс о недрах и недропользовании">Этапы</SectionTitle>
        <div style={{ display: 'grid', gap: 12, maxWidth: 860 }}>
          {STAGES.map((s) => (
            <Panel key={s.n} style={{ padding: 20, display: 'grid', gridTemplateColumns: '48px 1fr', gap: 16 }}>
              <div className="ss-display ss-nums" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ss-ink-quiet)' }}>
                {s.n}
              </div>
              <div>
                <h3 className="ss-display" style={{ fontSize: 17, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ss-ink-quiet)', marginTop: 6 }}>{s.text}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}
