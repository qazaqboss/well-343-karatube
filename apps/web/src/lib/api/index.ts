import { apiMode, type SubsoilApi } from './client';
import { mockApi } from './adapters/mock';
import { httpApi } from './adapters/http';

/** Единственная точка, где выбирается источник данных. */
export const api: SubsoilApi = apiMode() === 'http' ? httpApi : mockApi;

export { apiMode, apiBaseUrl } from './client';
export type { SubsoilApi, ScopeQuery } from './client';
