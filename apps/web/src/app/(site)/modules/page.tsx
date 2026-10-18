import { Hero, ModuleCard, SectionTitle } from '@subsoil/ui';
import { MODULES } from '@/lib/site-content';

export const metadata = { title: 'Модули — Subsoil' };

export default function ModulesPage() {
  return (
    <>
      <Hero
        eyebrow="Каталог"
        title="МОДУЛИ ПОВЕРХ ОБЩИХ ДАННЫХ"
        lead="Каждый модуль наполняет сводку своими показателями и забирает из неё контекст. Данные вводятся один раз."
        watermark="05"
      />
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle>Пять модулей</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {MODULES.map((m) => (
            <ModuleCard key={m.slug} index={m.index} title={m.title} text={m.text} href={`/modules/${m.slug}`} />
          ))}
        </div>
      </section>
    </>
  );
}
