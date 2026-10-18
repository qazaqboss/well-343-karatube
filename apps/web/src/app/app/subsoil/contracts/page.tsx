import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Контракты и лицензии — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Контракты и лицензии"
      lead="Реестр контрактов на недропользование с этапом, сроком действия и обязательствами."
      willShow={[
        'Карточка контракта: этап, срок, обязательства',
        'Предупреждение за 90 дней до окончания',
        'Документы по контракту',
      ]}
      links={[
        { href: '/app/subsoil', label: 'Обзор требований' },
      ]}
    />
  );
}
