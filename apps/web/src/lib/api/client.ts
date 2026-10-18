/**
 * Клиент данных Subsoil.
 *
 * Три адаптера за одним интерфейсом:
 *   local — настоящие данные фонда из выгрузки файлов сайта (по умолчанию);
 *   mock  — выдуманные компании и показатели, для витрины и отладки;
 *   http  — реальный API, когда он поднимется.
 *
 * Выбор — переменной окружения NEXT_PUBLIC_API_MODE, без правок кода экранов.
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
  /** Источник данных — показывается в кабинете, чтобы демо не выдавали за факт. */
  readonly mode: ApiMode;
  getScopeTree(): Promise<ScopeTree>;
  getSummary(q: ScopeQuery): Promise<HoldingSummary>;
  getProduction(q: ScopeQuery & { metric: ProductionMetric; days?: number }): Promise<HoldingProduction>;
  getRequirements(q: ScopeQuery & { days?: number }): Promise<HoldingRequirements>;
}

export type ApiMode = 'local' | 'mock' | 'http';

export function apiMode(): ApiMode {
  const m = process.env.NEXT_PUBLIC_API_MODE;
  if (m === 'http') return 'http';
  if (m === 'mock') return 'mock';
  return 'local';
}

export function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'https://api.nanocem.app/v1';
}
