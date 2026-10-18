import { apiMode, type SubsoilApi } from './client';
import { localApi } from './adapters/local';
import { mockApi } from './adapters/mock';
import { httpApi } from './adapters/http';

const BY_MODE: Record<ReturnType<typeof apiMode>, SubsoilApi> = {
  local: localApi,
  mock: mockApi,
  http: httpApi,
};

/** Единственная точка, где выбирается источник данных. */
export const api: SubsoilApi = BY_MODE[apiMode()];

export { apiMode, apiBaseUrl } from './client';
export type { SubsoilApi, ScopeQuery, ApiMode } from './client';
