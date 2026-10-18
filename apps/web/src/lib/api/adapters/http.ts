/**
 * Адаптер реального API.
 *
 * Ответ сервера проверяется той же zod-схемой, что и демо: если API отдаст
 * другую форму, ошибка будет названа здесь, а не рассыплется по экрану
 * неопределёнными значениями.
 */
import {
  holdingProductionSchema,
  holdingRequirementsSchema,
  holdingSummarySchema,
  scopeTreeSchema,
} from '@subsoil/shared';
import type { SubsoilApi } from '../client';
import { apiBaseUrl } from '../client';

async function get<T>(path: string, schema: { parse: (v: unknown) => T }): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`API ${path}: ${res.status} ${res.statusText}`);
  }
  return schema.parse(await res.json());
}

/** scope=holding без id, остальные — с id. */
function scopeQuery(scope: string, id: string | null): string {
  const p = new URLSearchParams({ scope });
  if (id) p.set('id', id);
  return p.toString();
}

export const httpApi: SubsoilApi = {
  mode: 'http',
  async getScopeTree() {
    return get('/holding/scope-tree', scopeTreeSchema);
  },
  async getSummary({ scope, id }) {
    return get(`/holding/summary?${scopeQuery(scope, id)}`, holdingSummarySchema);
  },
  async getProduction({ scope, id, metric, days }) {
    const p = new URLSearchParams({ scope, metric });
    if (id) p.set('id', id);
    if (days) p.set('days', String(days));
    return get(`/holding/production?${p.toString()}`, holdingProductionSchema);
  },
  async getRequirements({ scope, id, days }) {
    const p = new URLSearchParams({ scope, days: String(days ?? 30) });
    if (id) p.set('id', id);
    return get(`/holding/requirements?${p.toString()}`, holdingRequirementsSchema);
  },
};
