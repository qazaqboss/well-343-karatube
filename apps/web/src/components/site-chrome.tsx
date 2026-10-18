import Link from 'next/link';
import { Button } from '@subsoil/ui';

const NAV = [
  { href: '/platform', label: 'Платформа' },
  { href: '/modules', label: 'Модули' },
  { href: '/solutions/water-cut', label: 'Решения' },
  { href: '/products/nanocem-ut9', label: 'NanoCem UT-9' },
  { href: '/cases', label: 'Кейсы' },
  { href: '/company', label: 'Компания' },
];

/** Шапка витрины — по 08-public-site.md, п. 3. */
export function SiteHeader() {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--ss-line)',
        position: 'sticky',
        top: 0,
        background: 'var(--ss-bg)',
        zIndex: 20,
      }}
    >
      <div
        className="ss-wrap"
        style={{ display: 'flex', alignItems: 'center', gap: 24, height: 64, flexWrap: 'wrap' }}
      >
        <Link
          href="/"
          className="ss-display ss-focus"
          style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.18em', textDecoration: 'none' }}
        >
          Subsoil
        </Link>

        <nav style={{ display: 'flex', gap: 18, flex: 1, flexWrap: 'wrap' }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="ss-focus"
              style={{ fontSize: 13, textDecoration: 'none', color: 'var(--ss-ink-quiet)' }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button href="/login" variant="secondary" style={{ padding: '8px 14px' }}>
            Войти
          </Button>
          <Button href="/demo" style={{ padding: '8px 14px' }}>
            Демо
          </Button>
        </div>
      </div>
    </header>
  );
}

/** Подвал витрины. Контакты — из 08-public-site.md. */
export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--ss-line)', marginTop: 64 }}>
      <div
        className="ss-wrap"
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          padding: '28px 40px',
          fontSize: 12,
          color: 'var(--ss-ink-quiet)',
        }}
      >
        <div style={{ lineHeight: 1.7 }}>
          <div className="ss-display" style={{ fontSize: 14, color: 'var(--ss-ink)', letterSpacing: '0.16em' }}>
            Subsoil
          </div>
          ТОО «ЭкоМикс» · EASYMIX
          <br />
          Актобе, Промзона 679/17
        </div>
        <div style={{ lineHeight: 1.7 }}>
          8 747 111 19 64
          <br />
          info@easymix.kz
        </div>
        <div style={{ lineHeight: 1.7 }}>
          <Link href="/resources" style={{ textDecoration: 'none' }}>
            Ресурсы
          </Link>
          <br />
          <Link href="/demo" style={{ textDecoration: 'none' }}>
            Запросить демо
          </Link>
        </div>
        <div style={{ lineHeight: 1.7 }}>RU · KZ · EN</div>
      </div>
    </footer>
  );
}
