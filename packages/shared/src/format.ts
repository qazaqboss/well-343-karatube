/**
 * Форматирование чисел и дат: ru-RU, пробел между тысячами, запятая в дробях,
 * часовой пояс Asia/Aqtobe (CLAUDE.md, п. 6).
 */

export const TIME_ZONE = 'Asia/Aqtobe';
const LOCALE = 'ru-RU';

/** Пустое значение показывается одинаково везде. */
export const EMPTY = '—';

/**
 * Число с фиксированным числом знаков.
 *
 * Intl в ru-RU ставит узкий неразрывный пробел (U+202F); приводим к обычному
 * неразрывному — он предсказуемо выглядит в таблицах и копируется без сюрпризов.
 */
export function num(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(value)
    .replace(/ /g, ' ');
}

/** Целое число. */
export function int(value: number | null | undefined): string {
  return num(value, 0);
}

/** Знаковая дельта: «+3,1», «−12», «0». Минус — типографский. */
export function signed(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
  if (value === 0) return num(0, digits);
  const sign = value > 0 ? '+' : '−';
  return sign + num(Math.abs(value), digits);
}

/** Процент: «96 %» — с неразрывным пробелом перед знаком, как в ru-типографике. */
export function pct(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
  return `${num(value, digits)} %`;
}

/** Процентные пункты со знаком: «+0,4 п.п.» */
export function pp(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return EMPTY;
  return `${signed(value, digits)} п.п.`;
}

function parse(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Дата «18.10.2026» в поясе месторождения. */
export function day(date: string | Date | null | undefined): string {
  const d = parse(date);
  if (!d) return EMPTY;
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/** Короткая дата «18.10» — для таблиц, где год одинаковый. */
export function dayShort(date: string | Date | null | undefined): string {
  const d = parse(date);
  if (!d) return EMPTY;
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
  }).format(d);
}

/** Дата и время «18.10.2026, 06:00». */
export function dateTime(date: string | Date | null | undefined): string {
  const d = parse(date);
  if (!d) return EMPTY;
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** «через 7 дней» / «просрочено на 3 дня» / «сегодня». */
export function dueLabel(daysLeft: number | null | undefined): string {
  if (daysLeft === null || daysLeft === undefined || !Number.isFinite(daysLeft)) return EMPTY;
  if (daysLeft === 0) return 'сегодня';
  const n = Math.abs(daysLeft);
  const word = plural(n, 'день', 'дня', 'дней');
  return daysLeft > 0 ? `через ${n} ${word}` : `просрочено на ${n} ${word}`;
}

/** Русское склонение по числу. */
export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}
