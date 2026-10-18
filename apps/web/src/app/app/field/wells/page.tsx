import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Фонд скважин — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Фонд скважин"
      lead="Список скважин с последним замером и статусом. Переносится вместе с модулем Промысел."
      willShow={[
        'Таблица скважин: дебит, обводнённость, режим, простой',
        'Фильтры по статусу и месторождению',
        'Переход в карточку скважины',
      ]}
      links={[
        { href: '/app', label: 'Сводка холдинга' },
      ]}
    />
  );
}
