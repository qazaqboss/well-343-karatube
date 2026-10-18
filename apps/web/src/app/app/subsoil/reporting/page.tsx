import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Карта отчётности — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Карта отчётности"
      lead="Какие формы, в какой орган и с какой периодичностью сдаёт каждая компания."
      willShow={[
        'Правила отчётности по типу полезного ископаемого и этапу',
        'Автоматический расчёт сроков',
        'История сдачи',
      ]}
      links={[
        { href: '/app/subsoil', label: 'Обзор требований' },
      ]}
    />
  );
}
