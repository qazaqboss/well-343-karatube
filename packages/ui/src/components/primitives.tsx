import type { CSSProperties, ReactNode } from 'react';
import type { Level } from '../tokens';

export type { Level };

const LEVEL_VAR: Record<Level, string> = {
  ok: 'var(--ss-ok)',
  warn: 'var(--ss-warn)',
  crit: 'var(--ss-crit)',
  none: 'var(--ss-none)',
};

const LEVEL_TITLE: Record<Level, string> = {
  ok: 'норма',
  warn: 'внимание',
  crit: 'критично',
  none: 'нет данных',
};

/** Цвет статуса как CSS-значение — для инлайновых стилей компонентов. */
export function levelVar(level: Level): string {
  return LEVEL_VAR[level];
}

/**
 * Точка статуса 8px.
 *
 * Цвет — единственное, чем он отличается, поэтому к нему добавлена подпись:
 * на цвет полагаться нельзя, часть людей его не различает.
 */
export function StatusDot({ level, title }: { level: Level; title?: string }) {
  return (
    <span
      role="img"
      aria-label={title ?? LEVEL_TITLE[level]}
      title={title ?? LEVEL_TITLE[level]}
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: LEVEL_VAR[level],
        flexShrink: 0,
      }}
    />
  );
}

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  type?: 'button' | 'submit';
  disabled?: boolean;
  style?: CSSProperties;
}

/** Кнопка: чёрная капсом, радиус 2px; вторичная — контурная. */
export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  style,
}: ButtonProps) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 18px',
    fontFamily: 'var(--ss-font-body)',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderRadius: 'var(--ss-radius-btn)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    textDecoration: 'none',
    transition: 'background .15s, color .15s',
    ...style,
  };

  const skin: CSSProperties =
    variant === 'primary'
      ? { background: 'var(--ss-ink)', color: 'var(--ss-bg)', border: '1px solid var(--ss-ink)' }
      : variant === 'secondary'
        ? { background: 'transparent', color: 'var(--ss-ink)', border: '1px solid var(--ss-ink)' }
        : { background: 'transparent', color: 'var(--ss-ink-quiet)', border: '1px solid transparent' };

  if (href && !disabled) {
    return (
      <a className="ss-focus" href={href} style={{ ...base, ...skin }}>
        {children}
      </a>
    );
  }
  return (
    <button className="ss-focus" type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...skin }}>
      {children}
    </button>
  );
}

/** Мелкая подпись капсом с разрядкой. */
export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="ss-label" style={style}>
      {children}
    </div>
  );
}

/** Панель с общей тонкой рамкой. */
export function Panel({
  children,
  quiet,
  style,
}: {
  children: ReactNode;
  quiet?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={quiet ? 'ss-panel-quiet' : 'ss-panel'} style={style}>
      {children}
    </div>
  );
}

/** Заголовок раздела: Oswald капсом + тонкая линия под ним. */
export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--ss-line)',
        paddingBottom: 8,
        marginBottom: 16,
      }}
    >
      <h2 className="ss-display" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.12em' }}>
        {children}
      </h2>
      {aside ? <div className="ss-label">{aside}</div> : null}
    </div>
  );
}
