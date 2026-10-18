import Link from 'next/link';
import { StatusDot, type Level } from '@subsoil/ui';

export interface HubTile {
  href: string;
  index: string;
  title: string;
  text: string;
  /** Главная цифра раздела — чтобы хаб отвечал на вопрос, а не только вёл дальше. */
  figure?: string | null;
  figureNote?: string | null;
  level?: Level;
  /** Раздел ещё переносится — говорим об этом, а не притворяемся. */
  pending?: boolean;
  /** Раздел живёт на прежнем интерфейсе. */
  legacy?: boolean;
}

/**
 * Плитки разделов — общий вход в кабинет.
 *
 * Каждая несёт свою главную цифру: иначе хаб превращается в меню, ради
 * которого приходится делать лишний переход, чтобы узнать, всё ли в порядке.
 *
 * Рамка у каждой плитки, а не общая подложка под сеткой: при неполном
 * последнем ряде подложка просвечивала пустыми серыми ячейками.
 */
export function HubTiles({ tiles }: { tiles: readonly HubTile[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
      }}
    >
      {tiles.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="ss-focus"
          style={{
            background: 'var(--ss-bg)',
            border: '1px solid var(--ss-line)',
            padding: 20,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minHeight: 170,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span className="ss-label">{t.index}</span>
            {t.pending ? (
              <span className="ss-label" style={{ color: 'var(--ss-warn)' }}>
                в переносе
              </span>
            ) : t.legacy ? (
              <span className="ss-label" style={{ color: 'var(--ss-ink-quiet)' }}>
                прежний интерфейс
              </span>
            ) : t.level ? (
              <StatusDot level={t.level} />
            ) : null}
          </div>

          <h3 className="ss-display" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.15 }}>
            {t.title}
          </h3>

          {t.figure ? (
            <div className="ss-nums" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.1 }}>
              {t.figure}
              {t.figureNote ? (
                <span style={{ display: 'block', fontSize: 12, fontWeight: 400, color: 'var(--ss-ink-quiet)', marginTop: 4 }}>
                  {t.figureNote}
                </span>
              ) : null}
            </div>
          ) : null}

          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ss-ink-quiet)', flex: 1 }}>{t.text}</p>

          <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Открыть →
          </span>
        </Link>
      ))}
    </div>
  );
}
