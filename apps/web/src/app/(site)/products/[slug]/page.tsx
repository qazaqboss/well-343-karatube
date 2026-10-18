import { notFound } from 'next/navigation';
import { Button, Hero, Panel, SectionTitle } from '@subsoil/ui';
import { PRODUCTS } from '@/lib/site-content';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  return { title: p ? `${p.title} — Subsoil` : 'Продукт — Subsoil' };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <Hero
        eyebrow={`Продукт ${product.index}`}
        title={product.title.toUpperCase()}
        lead={`${product.tagline}. ${product.text}`}
        actions={
          <>
            <Button href="/demo">Запросить демо</Button>
            <Button href="/products" variant="secondary">Все продукты →</Button>
          </>
        }
        watermark={product.index}
      />
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle aside={product.inside}>Что внутри</SectionTitle>
        <Panel style={{ padding: 26, maxWidth: 840 }}>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, lineHeight: 1.9 }}>
            {product.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </Panel>
        <p style={{ fontSize: 13, color: 'var(--ss-ink-quiet)', marginTop: 20, maxWidth: 840, lineHeight: 1.7 }}>
          Рабочие данные по этому продукту доступны в кабинете, после входа. На публичных
          страницах показателей скважин и клиентов нет.
        </p>
      </section>
    </>
  );
}
