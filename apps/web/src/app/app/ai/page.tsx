import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'AI-помощник — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="AI-помощник"
      lead="Отвечает по Кодексу о недрах и по фактическому состоянию активов. Переносится со старого сайта вместе с базой знаний."
      willShow={[
        'Ответы по КоНН РК со ссылками на статьи',
        'Вопросы по текущим показателям активов',
        'Подсказки по срокам и обязательствам',
      ]}
      links={[
        { href: '/app/subsoil', label: 'Требования' },
        { href: '/app', label: 'Сводка холдинга' },
      ]}
    />
  );
}
