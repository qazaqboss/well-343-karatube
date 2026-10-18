import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Реестр обязательств — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Реестр обязательств"
      lead="Все обязательства и отчёты с фильтрами по статусу, сроку и компании. Список на ближайшие 30 дней уже виден на сводке."
      willShow={[
        'Фильтры: просрочено, ближайшие 30 дней, по компании',
        'Ответственный и документ-подтверждение',
        'Отметка выполнения',
      ]}
      links={[
        { href: '/app', label: 'Сводка холдинга' },
        { href: '/app/subsoil/calendar', label: 'Календарь сроков' },
      ]}
    />
  );
}
