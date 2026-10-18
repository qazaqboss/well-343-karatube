import { Panel, SectionTitle } from '@subsoil/ui';

export interface StubLink {
  href: string;
  label: string;
}

/**
 * Страница-заглушка раздела кабинета.
 *
 * Говорит прямо, что модуль ещё переносится, и показывает, что именно тут
 * появится — чтобы пустой экран не выглядел ошибкой. Ссылки ведут на уже
 * работающие места, иначе с заглушки некуда идти.
 */
export function ModuleStub({
  title,
  lead,
  willShow,
  links = [],
}: {
  title: string;
  lead: string;
  willShow: readonly string[];
  links?: readonly StubLink[];
}) {
  return (
    <>
      <SectionTitle aside="модуль в переносе">{title}</SectionTitle>

      <Panel style={{ padding: 24, maxWidth: 760 }}>
        <p style={{ fontSize: 15, lineHeight: 1.65 }}>{lead}</p>

        <div className="ss-label" style={{ marginTop: 24 }}>
          Что здесь будет
        </div>
        <ul style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 14, lineHeight: 1.8, color: 'var(--ss-ink-quiet)' }}>
          {willShow.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>

        {links.length > 0 ? (
          <>
            <div className="ss-label" style={{ marginTop: 24 }}>
              Пока доступно
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10 }}>
              {links.map((l) => (
                <a key={l.href} href={l.href} style={{ fontSize: 14, borderBottom: '1px solid var(--ss-line)', textDecoration: 'none' }}>
                  {l.label} →
                </a>
              ))}
            </div>
          </>
        ) : null}
      </Panel>
    </>
  );
}
