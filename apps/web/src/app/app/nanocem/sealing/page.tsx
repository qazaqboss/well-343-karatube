import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Герметичность — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Герметичность"
      lead="Итог по каждому заходу, география результата и заключения ПГИ. Страница переносится со старого сайта."
      willShow={[
        'Таблица заходов с итогом герметизации',
        'Разбор АКЦ/ЭМДС по краевым скважинам',
        'Опрессовка интервалов до запуска',
      ]}
      links={[
        { href: '/app/nanocem', label: 'Обзор UT-9' },
      ]}
    />
  );
}
