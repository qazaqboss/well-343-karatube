import { LegacyHashRedirect } from '@/components/legacy-hash';
import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Недропользование — обзор требований — Subsoil' };

export default function Page() {
  return (
    <>
      <LegacyHashRedirect />
      <ModuleStub
      title="Недропользование — обзор требований"
      lead="Контракты, обязательства и карта отчётности. Счётчики просроченного и ближайших сроков уже работают на сводке."
      willShow={[
        'Обязательства по контрактам со статусами',
        'Карта отчётности: орган, форма, периодичность',
        'Календарь сроков',
        'Документы и отметки о сдаче',
      ]}
      links={[
        { href: '/app', label: 'Сводка холдинга' },
        { href: '/app/subsoil/obligations', label: 'Реестр обязательств' },
      ]}
      />
    </>
  );
}
