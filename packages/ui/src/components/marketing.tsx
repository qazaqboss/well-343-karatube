import type { ReactNode } from 'react';

export interface ModuleCardProps {
  /** Номер карточки: «01». */
  index: string;
  title: string;
  /** Одна строка пользы — по 08-public-site.md, п. 2. */
  text: string;
  href: string;
  /** Подпись-состояние: «в переносе», «работает». */
  badge?: string | null;
}

/** Карточка модуля на витрине: номер, заголовок Oswald, строка, «Открыть →». */
export function ModuleCard({ index, title, text, href, badge }: ModuleCardProps) {
  return (
    <a
      className="ss-focus"
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 24,
        border: '1px solid var(--ss-line)',
        textDecoration: 'none',
        color: 'inherit',
        background: 'var(--ss-bg)',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <span className="ss-label">{index}</span>
        {badge ? <span className="ss-label">{badge}</span> : null}
      </div>
      <h3 className="ss-display" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.15 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', flex: 1 }}>{text}</p>
      <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
        Открыть →
      </span>
    </a>
  );
}

export interface HeroProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  /** Крупный бледный текст на фоне — дата или код объекта, как «J1-IV». */
  watermark?: string;
  /** Иллюстрация справа. Если она есть, водяной знак не рисуется: вдвоём тесно. */
  aside?: ReactNode;
}

/** Серый блок с крупным бледным текстом на фоне (09-design-system.md). */
export function Hero({ eyebrow, title, lead, actions, watermark, aside }: HeroProps) {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--ss-panel)',
        borderBottom: '1px solid var(--ss-line)',
        padding: '56px 40px 52px',
      }}
    >
      {watermark && !aside ? (
        <span
          aria-hidden="true"
          className="ss-display"
          style={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(64px, 11vw, 150px)',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: 0,
            color: 'var(--ss-line)',
            opacity: 0.55,
            maxWidth: '45%',
            overflow: 'hidden',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {watermark}
        </span>
      ) : null}

      <div
        className={aside ? 'ss-hero-split' : undefined}
        style={{
          position: 'relative',
          display: aside ? 'grid' : 'block',
          gridTemplateColumns: aside ? 'minmax(0, 1.25fr) minmax(0, 1fr)' : undefined,
          gap: aside ? 40 : undefined,
          alignItems: 'center',
          maxWidth: aside ? 1240 : 980,
          margin: '0 auto',
        }}
      >
        <div>
        <div className="ss-label">{eyebrow}</div>
        <h1
          className="ss-display"
          style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 700, lineHeight: 1.04, marginTop: 16 }}
        >
          {title}
        </h1>
        {lead ? (
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 20, maxWidth: 720 }}>
            {lead}
          </p>
        ) : null}
        {actions ? <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>{actions}</div> : null}
        </div>
        {aside ? <div style={{ minWidth: 0 }}>{aside}</div> : null}
      </div>
    </section>
  );
}

/** Полоса цифр-доказательств под hero. */
export function ProofStrip({ items }: { items: readonly { value: string; label: string }[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        borderBottom: '1px solid var(--ss-line)',
      }}
    >
      {items.map((i) => (
        <div key={i.label} style={{ padding: '24px 40px', borderRight: '1px solid var(--ss-line)' }}>
          <div className="ss-nums ss-display" style={{ fontSize: 28, fontWeight: 600 }}>
            {i.value}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ss-ink-quiet)', marginTop: 6 }}>{i.label}</div>
        </div>
      ))}
    </div>
  );
}
