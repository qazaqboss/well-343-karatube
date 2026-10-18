import type { Scope } from '@subsoil/shared';
import { day } from '@subsoil/shared';
import { api } from '@/lib/api';
import { ScopeNav } from './scope-nav';

/**
 * Переключатель уровня + дата среза.
 *
 * Дерево компаний берётся из того же API, что и показатели: список уровней
 * не должен расходиться с тем, по чему реально есть данные.
 */
export async function ScopeBar({ scope, id, asOf }: { scope: Scope; id: string | null; asOf: string }) {
  const tree = await api.getScopeTree();

  const companyId = scope === 'company' ? id : scope === 'field' ? findCompanyOf(tree, id) : null;
  const company = tree.companies.find((c) => c.id === companyId) ?? null;
  const field = company?.fields.find((f) => f.id === id) ?? null;

  return (
    <ScopeNav
      holding={{ id: tree.holding.id, name: tree.holding.name, href: '/app' }}
      company={company ? { id: company.id, name: company.name, href: `/app/c/${company.id}` } : null}
      field={field && company ? { id: field.id, name: field.name, href: `/app/c/${company.id}/f/${field.id}` } : null}
      companies={tree.companies.map((c) => ({ id: c.id, name: c.name, href: `/app/c/${c.id}` }))}
      fields={(company?.fields ?? []).map((f) => ({
        id: f.id,
        name: f.name,
        href: `/app/c/${company?.id}/f/${f.id}`,
      }))}
      asOf={`данные на ${day(asOf)}`}
    />
  );
}

function findCompanyOf(
  tree: Awaited<ReturnType<typeof api.getScopeTree>>,
  fieldId: string | null,
): string | null {
  if (!fieldId) return null;
  return tree.companies.find((c) => c.fields.some((f) => f.id === fieldId))?.id ?? null;
}
