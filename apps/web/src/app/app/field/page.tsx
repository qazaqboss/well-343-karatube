import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Промысел — утренняя сводка — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Промысел — утренняя сводка"
      lead="Раздел переносится из OilField Interact: он станет сервисом api в проекте Subsoil. Пока показатели промысла видны на сводке холдинга."
      willShow={[
        'Что произошло за ночь: замеры, действия, события',
        'Фонд скважин с фильтрами по статусу и месторождению',
        'Карточка скважины: замеры, режим, история ремонтов',
        'Команды и их исполнение',
      ]}
      links={[
        { href: '/app', label: 'Сводка холдинга' },
        { href: '/app/field/water-cut', label: 'Обводнённость фонда' },
      ]}
    />
  );
}
