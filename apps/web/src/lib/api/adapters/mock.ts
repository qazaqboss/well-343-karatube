/** Адаптер демо-данных: строит ответы ровно тех форм, что описаны в 06-api.md. */
import type { SubsoilApi } from '../client';
import { buildProduction, buildRequirements, buildScopeTree, buildSummary } from '@/lib/demo/build';

export const mockApi: SubsoilApi = {
  mode: 'mock',
  async getScopeTree() {
    return buildScopeTree();
  },
  async getSummary({ scope, id }) {
    return buildSummary(scope, id);
  },
  async getProduction({ scope, id, metric, days }) {
    return buildProduction(scope, id, metric, days ?? 90);
  },
  async getRequirements({ scope, id, days }) {
    return buildRequirements(scope, id, days ?? 30);
  },
};
