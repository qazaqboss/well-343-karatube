import Link from 'next/link';
import { apiMode } from '@/lib/api';
import { FUND_META } from '@/lib/real/build';

/** Левое меню кабинета — по 02-sitemap.md. */
const NAV = [
  { href: '/app', label: 'Сводка', short: 'Сводка' },
  { href: '/app/field', label: 'Промысел', short: 'Промысел' },
  { href: '/app/nanocem', label: 'NanoCem UT-9', short: 'UT-9' },
  { href: '/app/subsoil', label: 'Недропользование', short: 'Недра' },
  { href: '/app/reports', label: 'Отчёты', short: 'Отчёты' },
  { href: '/app/ai', label: 'AI', short: 'AI' },
];

/** Сервис на отдельном домене — в меню отмечен стрелкой наружу. */
const EXTERNAL = [{ href: 'https://ofi.nanocem.app/', label: 'OilField Interact ↗' }];

const SETTINGS = { href: '/app/settings', label: 'Настройки' };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const mode = apiMode();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        className="ss-sidebar"
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: '1px solid var(--ss-line)',
          padding: '20px 0',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Link
          href="/app"
          className="ss-display ss-focus"
          style={{
            display: 'block',
            padding: '0 20px 20px',
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textDecoration: 'none',
          }}
        >
          Subsoil
        </Link>

        <nav style={{ display: 'grid' }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="ss-focus" style={navItem}>
              {n.label}
            </Link>
          ))}
          {EXTERNAL.map((n) => (
            <a key={n.href} href={n.href} target="_blank" rel="noopener" className="ss-focus" style={navItem}>
              {n.label}
            </a>
          ))}
          <span style={{ height: 1, background: 'var(--ss-line)', margin: '12px 20px' }} />
          <Link href={SETTINGS.href} className="ss-focus" style={navItem}>
            {SETTINGS.label}
          </Link>
        </nav>

        <div
          className="ss-label"
          style={{
            margin: '24px 20px 0',
            lineHeight: 1.6,
            color: mode === 'mock' ? 'var(--ss-warn)' : 'var(--ss-ink-quiet)',
          }}
        >
          {mode === 'mock' ? 'Демо-данные' : `Данные на ${FUND_META.updated}`}
          <span style={{ display: 'block', textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
            {mode === 'mock'
              ? 'Компании и показатели вымышлены.'
              : 'Промысел — из суточных режимных листов. Требования пока демонстрационные.'}
          </span>
        </div>
      </aside>

      <main className="ss-app-main" style={{ flex: 1, minWidth: 0, padding: '24px 32px 48px' }}>
        {children}
      </main>

      <nav
        className="ss-bottombar"
        aria-label="Разделы кабинета"
        style={{
          position: 'fixed',
          insetInline: 0,
          bottom: 0,
          gridTemplateColumns: 'repeat(5, 1fr)',
          borderTop: '1px solid var(--ss-line)',
          background: 'var(--ss-bg)',
          zIndex: 30,
        }}
      >
        {NAV.slice(0, 5).map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="ss-focus"
            style={{
              padding: '12px 4px',
              textAlign: 'center',
              fontSize: 11,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: 'var(--ss-ink-quiet)',
              borderRight: '1px solid var(--ss-line)',
            }}
          >
            {n.short}
          </Link>
        ))}
      </nav>
    </div>
  );
}

const navItem = {
  display: 'block',
  padding: '9px 20px',
  fontSize: 13,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  color: 'var(--ss-ink-quiet)',
} as const;
