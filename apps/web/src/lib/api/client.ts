/**
 * Клиент данных Subsoil.
 *
 * Два адаптера за одним интерфейсом: mock отдаёт демо-данные, http ходит
 * в реальный API. Выбор — переменной окружения NEXT_PUBLIC_API_MODE, без
 * правок кода экранов (критерий готовности в задании).
 */
import type {
  HoldingProduction,
  HoldingRequirements,
  HoldingSummary,
  ProductionMetric,
  Scope,
  ScopeTree,
} from '@subsoil/shared';

export interface ScopeQuery {
  scope: Scope;
  id: string | null;
}

export interface SubsoilApi {
  /** Источник данных — показывается в подвале кабинета, чтобы демо не выдавали за факт. */
  readonly mode: 'mock' | 'http';
  getScopeTree(): Promise<ScopeTree>;
  getSummary(q: ScopeQuery): Promise<HoldingSummary>;
  getProduction(q: ScopeQuery & { metric: ProductionMetric; days?: number }): Promise<HoldingProduction>;
  getRequirements(q: ScopeQuery & { days?: number }): Promise<HoldingRequirements>;
}

export type ApiMode = 'mock' | 'http';

export function apiMode(): ApiMode {
  return process.env.NEXT_PUBLIC_API_MODE === 'http' ? 'http' : 'mock';
}

export function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nanocem.app/v1';
}
