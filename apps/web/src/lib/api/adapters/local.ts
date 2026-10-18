/** Адаптер реальных данных фонда (выгрузка из файлов сайта). */
import type { SubsoilApi } from '../client';
import { buildProduction, buildRequirements, buildScopeTree, buildSummary } from '@/lib/real/build';

export const localApi: SubsoilApi = {
  mode: 'local',
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
