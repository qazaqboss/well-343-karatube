/**
 * ДЕМО-ДАННЫЕ. Вымышленные компании и показатели для витрины и отладки кабинета.
 *
 * Реальные названия ТОО здесь не используются намеренно: до подключения API
 * экран не должен выдавать себя за настоящие данные клиента. Месторождение
 * «Каратюбе J1-IV» названо так, как просит задание, но цифры по нему —
 * синтетические, а не выгрузка из режимных листов.
 *
 * TODO: заменить на ответы /holding/* реального API (NEXT_PUBLIC_API_MODE=http).
 */

export const DEMO = true as const;

/** Опорная дата демо-мира: на неё собираются все срезы. */
export const DEMO_AS_OF = '2026-10-18T06:00:00+05:00';

export interface DemoField {
  id: string;
  name: string;
  companyId: string;
  horizon: string;
  oilDensity: number;
  /** План нефти на месяц, т. */
  monthPlanT: number;
  wells: DemoWell[];
}

export interface DemoWell {
  id: string;
  name: string;
  /** Последний замер жидкости, м³/сут. */
  liquidM3Day: number;
  waterCutPct: number;
  /** Замер накануне — для дельты к вчера. */
  prevLiquidM3Day: number;
  prevWaterCutPct: number;
  status: 'working' | 'stopped';
  /** Причина простоя — показывается на уровне месторождения. */
  note?: string;
}

export interface DemoCompany {
  id: string;
  name: string;
  bin: string;
  role: 'subsoil_user' | 'service' | 'supplier';
}

export const HOLDING = { id: 'h1', name: 'Холдинг (демо)' } as const;

export const COMPANIES: DemoCompany[] = [
  { id: 'c1', name: 'ТОО Демо-1', bin: '000000000001', role: 'subsoil_user' },
  { id: 'c2', name: 'ТОО Демо-2', bin: '000000000002', role: 'subsoil_user' },
  { id: 'c3', name: 'ТОО Демо-3', bin: '000000000003', role: 'service' },
];

export const FIELDS: DemoField[] = [
  {
    id: 'f1',
    name: 'Каратюбе J1-IV',
    companyId: 'c1',
    horizon: 'J1-IV',
    oilDensity: 0.85,
    monthPlanT: 1208,
    wells: [
      { id: 'w301', name: 'Скв. 301', liquidM3Day: 19.2, waterCutPct: 30.3, prevLiquidM3Day: 19.1, prevWaterCutPct: 30.5, status: 'working' },
      { id: 'w343', name: 'Скв. 343', liquidM3Day: 22.2, waterCutPct: 46.4, prevLiquidM3Day: 22.1, prevWaterCutPct: 46.6, status: 'working' },
      { id: 'w342', name: 'Скв. 342', liquidM3Day: 14.3, waterCutPct: 35.2, prevLiquidM3Day: 14.3, prevWaterCutPct: 35.9, status: 'working' },
      { id: 'w357', name: 'Скв. 357', liquidM3Day: 12.5, waterCutPct: 63.8, prevLiquidM3Day: 12.5, prevWaterCutPct: 63.8, status: 'working' },
      { id: 'w311', name: 'Скв. 311', liquidM3Day: 24.8, waterCutPct: 85.4, prevLiquidM3Day: 25.2, prevWaterCutPct: 85.4, status: 'working' },
      { id: 'w303', name: 'Скв. 303', liquidM3Day: 15.5, waterCutPct: 85.2, prevLiquidM3Day: 15.7, prevWaterCutPct: 85.2, status: 'working' },
      { id: 'w305', name: 'Скв. 305', liquidM3Day: 1.6, waterCutPct: 15.0, prevLiquidM3Day: 1.7, prevWaterCutPct: 15.4, status: 'working' },
      { id: 'w363', name: 'Скв. 363', liquidM3Day: 21.1, waterCutPct: 98.0, prevLiquidM3Day: 0, prevWaterCutPct: 0, status: 'working', note: 'вывод на режим после изоляции' },
    ],
  },
  {
    id: 'f2',
    name: 'Мортук Восточный',
    companyId: 'c1',
    horizon: 'T1-II',
    oilDensity: 0.86,
    monthPlanT: 1789,
    wells: [
      { id: 'w201', name: 'Скв. 201', liquidM3Day: 58.0, waterCutPct: 71.0, prevLiquidM3Day: 57.4, prevWaterCutPct: 70.2, status: 'working' },
      { id: 'w202', name: 'Скв. 202', liquidM3Day: 44.5, waterCutPct: 68.3, prevLiquidM3Day: 44.9, prevWaterCutPct: 67.1, status: 'working' },
      { id: 'w203', name: 'Скв. 203', liquidM3Day: 61.2, waterCutPct: 79.4, prevLiquidM3Day: 60.1, prevWaterCutPct: 73.9, status: 'working', note: 'рост воды за сутки' },
      { id: 'w204', name: 'Скв. 204', liquidM3Day: 0, waterCutPct: 0, prevLiquidM3Day: 39.0, prevWaterCutPct: 74.0, status: 'stopped', note: 'простой: ремонт насоса' },
      { id: 'w205', name: 'Скв. 205', liquidM3Day: 52.8, waterCutPct: 70.6, prevLiquidM3Day: 52.2, prevWaterCutPct: 70.9, status: 'working' },
    ],
  },
  {
    id: 'f3',
    name: 'Жыланкабак',
    companyId: 'c2',
    horizon: 'P2-I',
    oilDensity: 0.84,
    monthPlanT: 174,
    wells: [
      { id: 'w401', name: 'Скв. 401', liquidM3Day: 31.4, waterCutPct: 88.1, prevLiquidM3Day: 31.0, prevWaterCutPct: 87.6, status: 'working' },
      { id: 'w402', name: 'Скв. 402', liquidM3Day: 27.9, waterCutPct: 90.4, prevLiquidM3Day: 27.6, prevWaterCutPct: 90.1, status: 'working' },
      { id: 'w403', name: 'Скв. 403', liquidM3Day: 0, waterCutPct: 0, prevLiquidM3Day: 18.2, prevWaterCutPct: 92.0, status: 'stopped', note: 'простой более суток' },
    ],
  },
  {
    id: 'f4',
    name: 'Жолдыбай',
    companyId: 'c2',
    horizon: 'J1-II',
    oilDensity: 0.87,
    monthPlanT: 375,
    wells: [
      { id: 'w501', name: 'Скв. 501', liquidM3Day: 16.8, waterCutPct: 54.2, prevLiquidM3Day: 16.5, prevWaterCutPct: 54.8, status: 'working' },
      { id: 'w502', name: 'Скв. 502', liquidM3Day: 12.1, waterCutPct: 49.7, prevLiquidM3Day: 12.3, prevWaterCutPct: 50.1, status: 'working' },
    ],
  },
];

export interface DemoJob {
  id: string;
  wellId: string;
  wellName: string;
  fieldId: string;
  jobDate: string;
  intervalTop: number;
  intervalBot: number;
  volumeM3: number;
  /** Средний дебит 14 суток до захода, т/сут. */
  oilBefore: number | null;
  /** Средний дебит 14 суток после; null — результата ещё нет. */
  oilAfter: number | null;
  result: 'success' | 'partial' | 'fail' | 'pending';
}

export const JOBS: DemoJob[] = [
  { id: 'j1', wellId: 'w343', wellName: 'Скв. 343', fieldId: 'f1', jobDate: '2026-01-29', intervalTop: 629.8, intervalBot: 660, volumeM3: 3.5, oilBefore: 1.1, oilAfter: 10.4, result: 'success' },
  { id: 'j2', wellId: 'w342', wellName: 'Скв. 342', fieldId: 'f1', jobDate: '2026-05-31', intervalTop: 612, intervalBot: 648, volumeM3: 3.0, oilBefore: 2.3, oilAfter: 8.1, result: 'success' },
  { id: 'j3', wellId: 'w301', wellName: 'Скв. 301', fieldId: 'f1', jobDate: '2026-06-05', intervalTop: 637, intervalBot: 677, volumeM3: 3.5, oilBefore: 0.0, oilAfter: 11.7, result: 'success' },
  { id: 'j4', wellId: 'w311', wellName: 'Скв. 311', fieldId: 'f1', jobDate: '2026-07-09', intervalTop: 598, intervalBot: 624, volumeM3: 3.5, oilBefore: 6.3, oilAfter: 3.2, result: 'fail' },
  { id: 'j5', wellId: 'w303', wellName: 'Скв. 303', fieldId: 'f1', jobDate: '2026-07-13', intervalTop: 686, intervalBot: 688, volumeM3: 3.0, oilBefore: 1.4, oilAfter: 2.0, result: 'partial' },
  { id: 'j6', wellId: 'w357', wellName: 'Скв. 357', fieldId: 'f1', jobDate: '2026-09-24', intervalTop: 657, intervalBot: 684, volumeM3: 3.0, oilBefore: 1.5, oilAfter: 3.95, result: 'success' },
  { id: 'j7', wellId: 'w363', wellName: 'Скв. 363', fieldId: 'f1', jobDate: '2026-10-10', intervalTop: 647, intervalBot: 674, volumeM3: 3.0, oilBefore: 0.46, oilAfter: null, result: 'pending' },
];

export interface DemoRequirement {
  id: string;
  kind: 'obligation' | 'reporting_event';
  dueDate: string;
  companyId: string;
  fieldId: string | null;
  contractId: string;
  contractNumber: string;
  title: string;
  authority: string | null;
  owner: string | null;
  doneAt: string | null;
}

export const CONTRACTS = [
  { id: 'k1', companyId: 'c1', fieldId: 'f1', number: '5169-УВС', stage: 5, validTo: '2031-07-15' },
  { id: 'k2', companyId: 'c1', fieldId: 'f2', number: '5204-УВС', stage: 5, validTo: '2029-03-01' },
  { id: 'k3', companyId: 'c2', fieldId: 'f3', number: '4871-УВС', stage: 4, validTo: '2027-01-20' },
  { id: 'k4', companyId: 'c2', fieldId: 'f4', number: '5310-УВС', stage: 3, validTo: '2033-11-30' },
] as const;

/**
 * Обязательства и отчётность. Два просроченных и несколько в ближайшие 30 дней —
 * чтобы «Внимание сегодня» и блок требований были не пустыми.
 */
export const REQUIREMENTS: DemoRequirement[] = [
  { id: 'r1', kind: 'obligation', dueDate: '2026-10-05', companyId: 'c1', fieldId: 'f2', contractId: 'k2', contractNumber: '5204-УВС', title: 'Отчёт по местному содержанию в кадрах за III квартал', authority: 'МЭиПР РК', owner: 'Юрист компании', doneAt: null },
  { id: 'r2', kind: 'reporting_event', dueDate: '2026-10-12', companyId: 'c2', fieldId: 'f3', contractId: 'k3', contractNumber: '4871-УВС', title: 'Форма 2-ТП (воздух) за III квартал', authority: 'Бюро нацстатистики', owner: 'Эколог', doneAt: null },
  { id: 'r3', kind: 'reporting_event', dueDate: '2026-10-20', companyId: 'c1', fieldId: 'f1', contractId: 'k1', contractNumber: '5169-УВС', title: 'Отчёт о выполнении обязательств по контракту', authority: 'МЭиПР РК', owner: 'Недропользование', doneAt: null },
  { id: 'r4', kind: 'reporting_event', dueDate: '2026-10-25', companyId: 'c1', fieldId: 'f1', contractId: 'k1', contractNumber: '5169-УВС', title: 'Форма 1-ТП (недра) за III квартал', authority: 'МЭиПР РК', owner: 'Геолог', doneAt: null },
  { id: 'r5', kind: 'obligation', dueDate: '2026-10-28', companyId: 'c2', fieldId: 'f4', contractId: 'k4', contractNumber: '5310-УВС', title: 'Взнос в ликвидационный фонд за III квартал', authority: null, owner: 'Финансовый директор', doneAt: null },
  { id: 'r6', kind: 'reporting_event', dueDate: '2026-11-05', companyId: 'c1', fieldId: 'f2', contractId: 'k2', contractNumber: '5204-УВС', title: 'Суточная сводка добычи за октябрь', authority: 'МЭиПР РК', owner: 'Технолог', doneAt: null },
  { id: 'r7', kind: 'obligation', dueDate: '2026-11-10', companyId: 'c2', fieldId: 'f3', contractId: 'k3', contractNumber: '4871-УВС', title: 'Обучение казахстанских кадров — отчёт за год', authority: 'МЭиПР РК', owner: 'HR', doneAt: null },
  { id: 'r8', kind: 'reporting_event', dueDate: '2026-11-15', companyId: 'c1', fieldId: 'f1', contractId: 'k1', contractNumber: '5169-УВС', title: 'Отчёт о движении запасов', authority: 'ГКЗ', owner: 'Геолог', doneAt: null },
  { id: 'r9', kind: 'obligation', dueDate: '2026-11-16', companyId: 'c1', fieldId: 'f1', contractId: 'k1', contractNumber: '5169-УВС', title: 'Финансирование социальных обязательств за год', authority: null, owner: 'Финансовый директор', doneAt: null },
  { id: 'r10', kind: 'reporting_event', dueDate: '2026-12-01', companyId: 'c2', fieldId: 'f4', contractId: 'k4', contractNumber: '5310-УВС', title: 'Годовой отчёт о выполнении рабочей программы', authority: 'МЭиПР РК', owner: 'Недропользование', doneAt: null },
  { id: 'r11', kind: 'reporting_event', dueDate: '2026-12-10', companyId: 'c1', fieldId: 'f2', contractId: 'k2', contractNumber: '5204-УВС', title: 'Форма 6-ГР за год', authority: 'МЭиПР РК', owner: 'Геолог', doneAt: null },
  { id: 'r12', kind: 'obligation', dueDate: '2026-09-30', companyId: 'c1', fieldId: 'f1', contractId: 'k1', contractNumber: '5169-УВС', title: 'Отчёт по закупу товаров и услуг за III квартал', authority: 'МЭиПР РК', owner: 'Снабжение', doneAt: '2026-09-29T10:00:00+05:00' },
  { id: 'r13', kind: 'reporting_event', dueDate: '2026-09-25', companyId: 'c2', fieldId: 'f3', contractId: 'k3', contractNumber: '4871-УВС', title: 'Форма 1-ТП (недра) за II квартал', authority: 'МЭиПР РК', owner: 'Геолог', doneAt: '2026-09-24T12:00:00+05:00' },
  { id: 'r14', kind: 'obligation', dueDate: '2027-01-20', companyId: 'c2', fieldId: 'f3', contractId: 'k3', contractNumber: '4871-УВС', title: 'Продление контракта 4871-УВС', authority: 'МЭиПР РК', owner: 'Юрист компании', doneAt: null },
  { id: 'r15', kind: 'reporting_event', dueDate: '2027-02-01', companyId: 'c1', fieldId: 'f1', contractId: 'k1', contractNumber: '5169-УВС', title: 'Годовая форма по эмиссиям', authority: 'Департамент экологии', owner: 'Эколог', doneAt: null },
];

/** Команды промысла — для правила «не исполнена более суток». */
export const COMMANDS = [
  { id: 'cm1', fieldId: 'f2', wellId: 'w203', text: 'Замерить обводнённость после смены режима', status: 'open', createdAt: '2026-10-16T09:00:00+05:00' },
  { id: 'cm2', fieldId: 'f1', wellId: 'w363', text: 'Контрольный замер после запуска', status: 'done', createdAt: '2026-10-13T08:00:00+05:00' },
] as const;
