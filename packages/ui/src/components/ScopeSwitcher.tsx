import type { ReactNode } from 'react';

export interface ScopeOption {
  id: string;
  name: string;
  href: string;
}

export interface ScopeSwitcherProps {
  /** Уровень холдинга — всегда первая крошка. */
  holding: ScopeOption;
  /** Выбранная компания, если спустились на её уровень. */
  company?: ScopeOption | null;
  /** Выбранное месторождение. */
  field?: ScopeOption | null;
  /** Чем наполнить выпадающие списки соседей на каждом уровне. */
  companies: readonly ScopeOption[];
  fields: readonly ScopeOption[];
  /** «данные на 18.10.2026» — справа от крошек. */
  asOf?: ReactNode;
}

const SEP = (
  <span aria-hidden="true" style={{ color: 'var(--ss-ink-quiet)', padding: '0 6px' }}>
    ▸
  </span>
);

/**
 * Хлебные крошки Холдинг ▸ Компания ▸ Месторождение.
 *
 * Соседние уровни выбираются нативным <select> — он работает с клавиатуры
 * и на телефоне без собственного выпадающего меню.
 */
export function ScopeSwitcher({ holding, company, field, companies, fields, asOf }: ScopeSwitcherProps) {
  return (
    <nav
      aria-label="Уровень данных"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        padding: '12px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: 14 }}>
        <a className="ss-focus" href={holding.href} style={{ color: 'inherit', textDecoration: 'none', fontWeight: company ? 400 : 600 }}>
          {holding.name}
        </a>

        {SEP}
        <ScopeSelect
          label="Компания"
          value={company?.href ?? ''}
          placeholder="Все компании"
          options={companies}
          current={company}
        />

        {company ? (
          <>
            {SEP}
            <ScopeSelect
              label="Месторождение"
              value={field?.href ?? ''}
              placeholder="Все месторождения"
              options={fields}
              current={field}
            />
          </>
        ) : null}
      </div>

      {asOf ? <div className="ss-label">{asOf}</div> : null}
    </nav>
  );
}

function ScopeSelect({
  label,
  value,
  placeholder,
  options,
  current,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: readonly ScopeOption[];
  current?: ScopeOption | null;
}) {
  // Ссылки лежат в value, переход делает обработчик формы в приложении:
  // так компонент остаётся без зависимости от роутера.
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <select
        className="ss-focus"
        aria-label={label}
        defaultValue={value}
        data-scope-select
        style={{
          appearance: 'none',
          background: 'transparent',
          border: '1px solid var(--ss-line)',
          borderRadius: 'var(--ss-radius-btn)',
          color: 'inherit',
          font: 'inherit',
          fontWeight: current ? 600 : 400,
          padding: '4px 24px 4px 8px',
          cursor: 'pointer',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0h8L4 5z' fill='%236B6B6B'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.href}>
            {o.name}
          </option>
        ))}
      </select>
    </span>
  );
}
