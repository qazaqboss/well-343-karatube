import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'AI-помощник — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="AI-помощник"
      lead="Помощник уже работает — пока на прежнем интерфейсе, по прямой ссылке. Внутрь кабинета он переедет вместе с остальными модулями, вместе с базой знаний по КоНН."
      willShow={[
        'Ответы по КоНН РК со ссылками на статьи',
        'Вопросы по текущим показателям активов',
        'Подсказки по срокам и обязательствам',
      ]}
      links={[
        { href: '/ai', label: 'Открыть AI-помощника' },
        { href: '/app/subsoil', label: 'Требования' },
      ]}
    />
  );
}
