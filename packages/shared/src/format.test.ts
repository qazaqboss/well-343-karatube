import { describe, expect, it } from 'vitest';
import { day, dueLabel, int, num, pct, plural, pp, signed, EMPTY } from './format';

/** Неразрывные пробелы в ожиданиях пишем явно, чтобы тест не врал глазами. */
const NB = ' ';

describe('числа', () => {
  it('разделяет тысячи пробелом и ставит запятую в дробях', () => {
    expect(num(1234.5)).toBe(`1${NB}234,5`);
  });

  it('целые — без дробной части', () => {
    expect(int(1380)).toBe(`1${NB}380`);
  });

  it('нет значения — прочерк, а не ноль', () => {
    expect(num(null)).toBe(EMPTY);
    expect(num(undefined)).toBe(EMPTY);
    expect(num(NaN)).toBe(EMPTY);
    expect(int(null)).toBe(EMPTY);
  });

  it('бесконечность — тоже прочерк', () => {
    expect(num(Infinity)).toBe(EMPTY);
  });
});

describe('дельты', () => {
  it('плюс и типографский минус', () => {
    expect(signed(3.1)).toBe('+3,1');
    expect(signed(-12, 0)).toBe('−12');
  });

  it('ноль без знака', () => {
    expect(signed(0)).toBe('0,0');
  });

  it('процентные пункты со знаком', () => {
    expect(pp(0.4)).toBe(`+0,4${NB}п.п.`);
  });

  it('проценты с неразрывным пробелом', () => {
    expect(pct(96, 0)).toBe(`96${NB}%`);
  });
});

describe('даты', () => {
  it('формат ДД.ММ.ГГГГ', () => {
    expect(day('2026-10-18T06:00:00+05:00')).toBe('18.10.2026');
  });

  it('учитывает пояс Актобе: полночь UTC — это уже утро следующего дня', () => {
    expect(day('2026-10-17T20:00:00Z')).toBe('18.10.2026');
  });

  it('негодная дата — прочерк', () => {
    expect(day('не дата')).toBe(EMPTY);
    expect(day(null)).toBe(EMPTY);
  });
});

describe('сроки и склонение', () => {
  it('подписывает срок', () => {
    expect(dueLabel(7)).toBe('через 7 дней');
    expect(dueLabel(1)).toBe('через 1 день');
    expect(dueLabel(0)).toBe('сегодня');
    expect(dueLabel(-3)).toBe('просрочено на 3 дня');
  });

  it('склоняет по-русски', () => {
    expect(plural(1, 'день', 'дня', 'дней')).toBe('день');
    expect(plural(2, 'день', 'дня', 'дней')).toBe('дня');
    expect(plural(5, 'день', 'дня', 'дней')).toBe('дней');
    expect(plural(11, 'день', 'дня', 'дней')).toBe('дней');
    expect(plural(21, 'день', 'дня', 'дней')).toBe('день');
  });
});
