import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Календарь сроков — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Календарь сроков"
      lead="Месячная сетка со сроками обязательств и отчётов."
      willShow={[
        'Сетка месяца с метками по срокам',
        'Фильтр по компании и органу',
        'Переход в карточку обязательства',
      ]}
      links={[
        { href: '/app/subsoil/obligations', label: 'Реестр обязательств' },
      ]}
    />
  );
}
