import Link from 'next/link';
import { Hero, SectionTitle } from '@subsoil/ui';
import { PRODUCTS } from '@/lib/site-content';

export const metadata = { title: 'Продукты — Subsoil' };

export default function ProductsPage() {
  return (
    <>
      <Hero
        eyebrow="Каталог"
        title="ПЯТЬ ПРОДУКТОВ НА ОБЩИХ ДАННЫХ"
        lead="Каждый наполняет общую сводку своими показателями и берёт из неё контекст. Данные вводятся один раз."
        watermark="05"
      />
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle>Продукты</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="ss-focus"
              style={{
                border: '1px solid var(--ss-line)',
                padding: 24,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span className="ss-label">{p.index}</span>
              <h3 className="ss-display" style={{ fontSize: 20, fontWeight: 600 }}>{p.title}</h3>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{p.tagline}</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', flex: 1 }}>{p.text}</p>
              <span style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                Подробнее →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
