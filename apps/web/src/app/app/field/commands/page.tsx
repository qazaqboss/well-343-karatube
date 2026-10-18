import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Команды — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Команды"
      lead="Команды технолога на промысел и их исполнение. Переносится из OilField Interact."
      willShow={[
        'Лента команд с ответственными и сроками',
        'Отметка исполнения с телефона',
        'Правило «не исполнена более 24 ч» на сводке',
      ]}
      links={[
        { href: '/app', label: 'Сводка холдинга' },
      ]}
    />
  );
}
