import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Обводнённость фонда — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Обводнённость фонда"
      lead="Страница со старого сайта: динамика по месяцам, распределение по диапазонам, разбор по горизонтам и вклад заходов UT-9."
      willShow={[
        'Динамика обводнённости фонда за год',
        'Распределение скважин по диапазонам',
        'Обводнённость по горизонтам',
        'Вклад заходов UT-9 в показатель фонда',
      ]}
      links={[
        { href: '/app', label: 'Сводка холдинга' },
        { href: '/app/nanocem', label: 'Эффект UT-9' },
      ]}
    />
  );
}
