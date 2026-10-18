import { SectionTitle } from '@subsoil/ui';
import { num, pct, signed } from '@subsoil/shared';
import { api } from '@/lib/api';
import { HubTiles, type HubTile } from '@/components/hub-tiles';
import { SummaryScreen } from '@/components/summary-screen';
import { FUND_META, getFundAnalytics, getJobs, listWells } from '@/lib/real/build';

export const metadata = { title: 'Subsoil — кабинет' };

/**
 * Общий вход в кабинет.
 *
 * Сверху — плитки разделов, каждая со своей главной цифрой: отсюда видно
 * состояние дел, не открывая ни одного раздела. Ниже — полная сводка
 * холдинга по 03-holding-dashboard.md.
 */
export default async function AppHome() {
  const summary = await api.getSummary({ scope: 'holding', id: null });
  const fundAnalytics = getFundAnalytics();
  const wells = listWells();
  const jobs = getJobs();

  const lost = wells.filter((w) => w.seal.code === 'lost').length;
  const gain = jobs.filter((j) => j.gain !== null).reduce((s, j) => s + (j.gain ?? 0), 0);
  const k = summary.kpi;

  const tiles: HubTile[] = [
    {
      href: '/app/field/wells',
      index: '01',
      title: 'Фонд скважин',
      figure: `${k.fund.working} / ${k.fund.total}`,
      figureNote: `${num(k.oilTDay.value, 1)} т/сут · ${signed(k.oilTDay.deltaDay ?? null, 1)} к вчера`,
      text: 'Суточные замеры по каждой скважине, режим, история ремонтов и ключевые события.',
      level: k.fund.stopped > 0 ? 'warn' : 'ok',
    },
    {
      href: '/app/field/water-cut',
      index: '02',
      title: 'Обводнённость',
      figure: pct(k.waterCutPct.value, 1),
      figureNote: `фонд ${fundAnalytics.wellsTotal} скважин · ${num(fundAnalytics.effect.waterSaved, 1)} м³/сут сэкономлено`,
      text: 'Динамика по месяцам, распределение по диапазонам, горизонты и вклад заходов.',
      level: 'ok',
    },
    {
      href: '/app/nanocem',
      index: '03',
      title: 'NanoCem UT-9',
      figure: `${signed(gain, 1)} т/сут`,
      figureNote: `${jobs.length} заходов · ${lost} без эффекта`,
      text: 'Результат каждого захода, герметичность и программа кандидатов.',
      level: lost > 0 ? 'warn' : 'ok',
    },
    {
      href: '/erp/',
      index: '04',
      title: 'Менеджмент',
      figure: `${k.requirements.overdue} просроч.`,
      figureNote: `${k.requirements.next30d} в ближайшие 30 дней`,
      text: 'Контракты, обязательства, сроки отчётности и этапы недропользования.',
      legacy: true,
    },
    {
      href: '/ai',
      index: '05',
      title: 'AI-помощник',
      text: 'Отвечает по Кодексу о недрах и по фактическому состоянию активов — со ссылкой на источник.',
      legacy: true,
    },
    {
      href: '/app/reports',
      index: '06',
      title: 'Отчёты',
      text: 'Суточная сводка, отчёт по этапу и паспорт скважины — из тех же данных.',
      pending: true,
    },
  ];

  return (
    <>
      <SectionTitle aside={`данные на ${FUND_META.updated}`}>Разделы</SectionTitle>
      <div style={{ marginBottom: 36 }}>
        <HubTiles tiles={tiles} />
      </div>

      <SummaryScreen scope="holding" id={null} />
    </>
  );
}
