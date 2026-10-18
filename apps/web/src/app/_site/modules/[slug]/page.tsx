import { notFound } from 'next/navigation';
import { Button, Hero, Panel, SectionTitle } from '@subsoil/ui';
import { MODULES, MODULE_DETAIL, type ModuleSlug } from '@/lib/site-content';

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = MODULES.find((x) => x.slug === slug);
  return { title: m ? `${m.title} — Subsoil` : 'Модуль — Subsoil' };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = MODULES.find((m) => m.slug === slug);
  if (!module) notFound();
  const detail = MODULE_DETAIL[module.slug as ModuleSlug];

  return (
    <>
      <Hero
        eyebrow={`Модуль ${module.index}`}
        title={module.title.toUpperCase()}
        lead={detail.lead}
        actions={
          <>
            <Button href="/demo">Запросить демо</Button>
            <Button href="/modules" variant="secondary">Все модули →</Button>
          </>
        }
        watermark={module.index}
      />
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle>Что внутри</SectionTitle>
        <Panel style={{ padding: 24, maxWidth: 820 }}>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, lineHeight: 1.9 }}>
            {detail.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Panel>
      </section>
    </>
  );
}
