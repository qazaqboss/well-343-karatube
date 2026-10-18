import { StatusDot, type Level } from './primitives';

export interface AttentionItem {
  level: 'critical' | 'warning';
  code: string;
  text: string;
  link: string;
}

const LEVEL: Record<AttentionItem['level'], Level> = { critical: 'crit', warning: 'warn' };

/**
 * «Внимание сегодня» — лента отклонений, критичное сверху.
 *
 * Если лента пуста, это сообщается словами: пустое место читается как «блок
 * не загрузился», а не как «проблем нет».
 */
export function AttentionList({ items }: { items: readonly AttentionItem[] }) {
  if (items.length === 0) {
    return (
      <div style={{ padding: '14px 20px', color: 'var(--ss-ink-quiet)', fontSize: 13 }}>
        Отклонений нет: просроченных обязательств, скачков обводнённости и зависших команд не найдено.
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => (a.level === b.level ? 0 : a.level === 'critical' ? -1 : 1));

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {sorted.map((item) => (
        <li key={`${item.code}:${item.text}`} style={{ borderBottom: '1px solid var(--ss-line)' }}>
          <a
            className="ss-focus"
            href={item.link}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              textDecoration: 'none',
              color: 'inherit',
              fontSize: 14,
            }}
          >
            <StatusDot level={LEVEL[item.level]} />
            <span style={{ flex: 1 }}>{item.text}</span>
            <span aria-hidden="true" style={{ color: 'var(--ss-ink-quiet)' }}>
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
