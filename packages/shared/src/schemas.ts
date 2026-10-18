/**
 * Zod-схемы ответов API — по 06-api.md.
 *
 * Их выполняют оба адаптера: mock проверяет себя при сборке демо-данных,
 * http — ответ сервера. Если API отдаст что-то другое, экран скажет об этом
 * явно, а не нарисует пустые места.
 */
import { z } from 'zod';

/** Уровень светофора. Тип берётся из metrics.ts, чтобы он был один на весь пакет. */
export const levelSchema = z.enum(['ok', 'warn', 'crit', 'none']);

/** Уровень агрегации: холдинг → компания → месторождение. */
export const scopeSchema = z.enum(['holding', 'company', 'field']);
export type Scope = z.infer<typeof scopeSchema>;

/** Показатель с дельтой к вчера. */
const kpiValue = z.object({
  value: z.number().nullable(),
  deltaDay: z.number().nullable().optional(),
  deltaDayPp: z.number().nullable().optional(),
  planPct: z.number().nullable().optional(),
});

export const attentionItemSchema = z.object({
  level: z.enum(['critical', 'warning']),
  code: z.string(),
  text: z.string(),
  link: z.string(),
});
export type AttentionItem = z.infer<typeof attentionItemSchema>;

export const assetRowSchema = z.object({
  companyId: z.string(),
  companyName: z.string(),
  fieldId: z.string().nullable(),
  name: z.string(),
  /** Куда ведёт клик по строке — на уровень ниже. */
  href: z.string(),
  oil: z.number().nullable(),
  deltaDay: z.number().nullable(),
  waterCut: z.number().nullable(),
  fund: z.string(),
  planPct: z.number().nullable(),
  requirementsStatus: z.enum(['ok', 'warn', 'crit']),
  requirementsNote: z.string(),
  nextDue: z.string().nullable(),
  status: levelSchema,
});
export type AssetRow = z.infer<typeof assetRowSchema>;

export const nanocemEffectSchema = z.object({
  jobs: z.number().int(),
  successful: z.number().int(),
  oilGainTDay: z.number().nullable(),
  lastJobDate: z.string().nullable(),
});
export type NanocemEffect = z.infer<typeof nanocemEffectSchema>;

export const holdingSummarySchema = z.object({
  asOf: z.string(),
  scope: scopeSchema,
  scopeId: z.string().nullable(),
  scopeName: z.string(),
  kpi: z.object({
    oilTDay: kpiValue,
    liquidM3Day: kpiValue,
    waterCutPct: kpiValue,
    fund: z.object({
      working: z.number().int(),
      total: z.number().int(),
      stopped: z.number().int(),
      deltaDay: z.number().int().nullable().optional(),
    }),
    requirements: z.object({
      overdue: z.number().int(),
      next30d: z.number().int(),
    }),
  }),
  attention: z.array(attentionItemSchema),
  assets: z.array(assetRowSchema),
  nanocem: nanocemEffectSchema,
});
export type HoldingSummary = z.infer<typeof holdingSummarySchema>;

export const productionMetricSchema = z.enum(['oil', 'liquid', 'water_cut']);
export type ProductionMetric = z.infer<typeof productionMetricSchema>;

export const productionPointSchema = z.object({
  date: z.string(),
  fact: z.number().nullable(),
  plan: z.number().nullable(),
});
export type ProductionPoint = z.infer<typeof productionPointSchema>;

export const productionMarkerSchema = z.object({
  date: z.string(),
  label: z.string(),
  kind: z.enum(['nanocem_job', 'workover', 'event']),
  href: z.string().nullable(),
});
export type ProductionMarker = z.infer<typeof productionMarkerSchema>;

export const holdingProductionSchema = z.object({
  scope: scopeSchema,
  scopeId: z.string().nullable(),
  metric: productionMetricSchema,
  unit: z.string(),
  from: z.string(),
  to: z.string(),
  points: z.array(productionPointSchema),
  markers: z.array(productionMarkerSchema),
});
export type HoldingProduction = z.infer<typeof holdingProductionSchema>;

export const requirementSchema = z.object({
  id: z.string(),
  kind: z.enum(['obligation', 'reporting_event']),
  dueDate: z.string(),
  companyId: z.string(),
  companyName: z.string(),
  fieldId: z.string().nullable(),
  contractId: z.string().nullable(),
  contractNumber: z.string().nullable(),
  title: z.string(),
  authority: z.string().nullable(),
  owner: z.string().nullable(),
  status: z.enum(['done', 'overdue', 'due_soon', 'planned']),
  href: z.string(),
});
export type Requirement = z.infer<typeof requirementSchema>;

export const holdingRequirementsSchema = z.object({
  scope: scopeSchema,
  scopeId: z.string().nullable(),
  days: z.number().int(),
  overdue: z.number().int(),
  next30d: z.number().int(),
  items: z.array(requirementSchema),
});
export type HoldingRequirements = z.infer<typeof holdingRequirementsSchema>;

/** Справочник уровней для переключателя Холдинг ▸ Компания ▸ Месторождение. */
export const scopeTreeSchema = z.object({
  holding: z.object({ id: z.string(), name: z.string() }),
  companies: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      fields: z.array(z.object({ id: z.string(), name: z.string() })),
    }),
  ),
});
export type ScopeTree = z.infer<typeof scopeTreeSchema>;
