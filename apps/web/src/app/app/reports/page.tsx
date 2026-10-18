import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Отчёты — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Отчёты"
      lead="Генерация PDF и XLSX из тех же данных, что показаны на сводке, — без повторного сбора."
      willShow={[
        'Суточная сводка по месторождению',
        'Отчёт по этапу недропользования',
        'Паспорт скважины',
        'Выгрузка реестра обязательств',
      ]}
      links={[
        { href: '/erp/', label: 'Отчёты по этапам в ERP' },
        { href: '/app', label: 'Сводка холдинга' },
      ]}
    />
  );
}
