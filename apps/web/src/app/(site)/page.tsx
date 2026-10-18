import Link from 'next/link';
import { Button, Hero, Panel, SectionTitle } from '@subsoil/ui';
import { AI_QUESTIONS, CASES, FLOW, PLATFORM, PRODUCTS, PROOF } from '@/lib/site-content';

/**
 * Главная Subsoil.
 *
 * Структура повторяет корпоративную подачу Corva: обещание → цифры и разбор
 * результатов → как устроена платформа → продукты → AI → заявка. Разница
 * в предмете: зрелый фонд Казахстана, требования КоНН и собственный продукт
 * для изоляции водопритока.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Платформа недропользования и промысла"
        title={
          <>
            ВСЁ О ВАШИХ СКВАЖИНАХ <span style={{ color: 'var(--ss-ink-quiet)' }}>—</span>
            <br />
            НА ОДНОМ ЭКРАНЕ
          </>
        }
        lead="От суточного замера на скважине до отчёта по этапу недропользования. Добыча, отклонения и сроки по всем активам — в одной системе, без повторного сбора данных."
        actions={
          <>
            <Button href="/demo">Запросить демо</Button>
            <Button href="/platform" variant="secondary">
              Как устроена платформа →
            </Button>
          </>
        }
        watermark="J1-IV"
      />

      {/* ── Цифры и разбор результатов ─────────────────────────────────── */}
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle aside="результаты обезличены">Данные превращаются в результат</SectionTitle>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {PROOF.map((p) => (
            <div key={p.label} style={{ border: '1px solid var(--ss-line)', padding: 24 }}>
              <div className="ss-nums ss-display" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1 }}>
                {p.value}
                <span style={{ fontSize: 15, fontWeight: 400, color: 'var(--ss-ink-quiet)', marginLeft: 8 }}>
                  {p.unit}
                </span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ss-ink-quiet)', marginTop: 10 }}>
                {p.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>
          {CASES.map((c) => (
            <Panel key={c.title} style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
              <div className="ss-nums ss-display" style={{ fontSize: 22, fontWeight: 600 }}>
                {c.metric}
              </div>
              <h3 className="ss-display" style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>
                {c.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 12 }}>
                <b style={{ color: 'var(--ss-ink)' }}>Было. </b>
                {c.before}
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8, flex: 1 }}>
                <b style={{ color: 'var(--ss-ink)' }}>Стало. </b>
                {c.after}
              </p>
              <p style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--ss-ink-quiet)', marginTop: 12 }}>{c.note}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* ── Как устроена платформа ─────────────────────────────────────── */}
      <section style={{ borderBlock: '1px solid var(--ss-line)', background: 'var(--ss-panel)' }}>
        <div className="ss-wrap" style={{ paddingBlock: 56 }}>
          <SectionTitle aside="четыре опоры">Внутри платформы</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {PLATFORM.map((p, i) => (
              <div
                key={p.title}
                style={{ background: 'var(--ss-bg)', border: '1px solid var(--ss-line)', padding: 22 }}
              >
                <div className="ss-label">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="ss-display" style={{ fontSize: 17, fontWeight: 600, marginTop: 8 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>{p.text}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              marginTop: 28,
            }}
          >
            {FLOW.map((f) => (
              <div key={f.n} style={{ borderTop: '2px solid var(--ss-ink)', paddingTop: 12 }}>
                <div className="ss-label">{f.n}</div>
                <div className="ss-display" style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>
                  {f.title}
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--ss-ink-quiet)', marginTop: 6 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Продукты ───────────────────────────────────────────────────── */}
      <section className="ss-wrap" style={{ paddingBlock: 56 }}>
        <SectionTitle aside="пять продуктов на общих данных">Что входит в Subsoil</SectionTitle>
        <div style={{ display: 'grid', gap: 1, background: 'var(--ss-line)', border: '1px solid var(--ss-line)' }}>
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="ss-focus"
              style={{
                background: 'var(--ss-bg)',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr) auto',
                gap: 20,
                alignItems: 'center',
                padding: '22px 24px',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div>
                <span className="ss-label">{p.index}</span>
                <h3 className="ss-display" style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>
                  {p.title}
                </h3>
                <div style={{ fontSize: 12, color: 'var(--ss-ink-quiet)', marginTop: 4 }}>{p.inside}</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.tagline}</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 6 }}>{p.text}</p>
              </div>
              <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Подробнее →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI ─────────────────────────────────────────────────────────── */}
      <section className="ss-wrap" style={{ paddingBottom: 56 }}>
        <SectionTitle>AI-помощник</SectionTitle>
        <Panel quiet style={{ padding: 26 }}>
          <p style={{ fontSize: 16, lineHeight: 1.65, maxWidth: 720 }}>
            Отвечает и по Кодексу о недрах, и по фактическому состоянию активов — со ссылкой
            на статью или на конкретный замер.
          </p>
          <ul style={{ margin: '18px 0 0', paddingLeft: 18, fontSize: 14, lineHeight: 1.9, color: 'var(--ss-ink-quiet)' }}>
            {AI_QUESTIONS.map((q) => (
              <li key={q}>«{q}»</li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* ── Кабинет ────────────────────────────────────────────────────── */}
      <section className="ss-wrap" style={{ paddingBottom: 56 }}>
        <SectionTitle aside="доступ по паролю">Кабинет</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            ['Что добыли', 'Нефть, жидкость и обводнённость по всем активам — с дельтой к вчера.'],
            ['Где проблемы', 'Просроченные обязательства, скачки воды, простои, зависшие команды.'],
            ['Какие сроки горят', 'Обязательства и отчётность на ближайшие 30 дней.'],
          ].map(([t, d]) => (
            <Panel key={t} style={{ padding: 20 }}>
              <h3 className="ss-display" style={{ fontSize: 16, fontWeight: 600 }}>
                {t}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 8 }}>{d}</p>
            </Panel>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--ss-ink-quiet)', marginTop: 16 }}>
          Данные скважин, контракты и AI-помощник доступны только после входа: наружу они
          не публикуются.{' '}
          <Link href="/login" style={{ borderBottom: '1px solid var(--ss-line)' }}>
            Войти →
          </Link>
        </p>
      </section>

      {/* ── Заявка ─────────────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--ss-line)', background: 'var(--ss-panel)' }}>
        <div
          className="ss-wrap"
          style={{
            paddingBlock: 48,
            display: 'flex',
            gap: 24,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 className="ss-display" style={{ fontSize: 30, fontWeight: 700 }}>
              Посмотреть на своих данных
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ss-ink-quiet)', marginTop: 8, maxWidth: 560 }}>
              Покажем сводку на одном вашем месторождении: что добыли, где отклонения, какие
              сроки горят. Около тридцати минут.
            </p>
          </div>
          <Button href="/demo">Запросить демо</Button>
        </div>
      </section>
    </>
  );
}
