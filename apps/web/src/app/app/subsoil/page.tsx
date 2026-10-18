import { LegacyHashRedirect } from '@/components/legacy-hash';
import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Недропользование — обзор требований — Subsoil' };

export default function Page() {
  return (
    <>
      <LegacyHashRedirect />
      <ModuleStub
      title="Недропользование — обзор требований"
      lead="Контракты, обязательства и карта отчётности ведутся в ERP — она работает по прямой ссылке, пока раздел переезжает в кабинет. Счётчики на сводке пока демонстрационные: они начнут брать данные из ERP после переноса."
      willShow={[
        'Обязательства по контрактам со статусами',
        'Карта отчётности: орган, форма, периодичность',
        'Календарь сроков',
        'Документы и отметки о сдаче',
      ]}
      links={[
        { href: '/erp/', label: 'Открыть ERP' },
        { href: '/app', label: 'Сводка холдинга' },
      ]}
      />
    </>
  );
}
