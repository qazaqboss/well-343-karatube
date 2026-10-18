import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Настройки — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Настройки"
      lead="Компании, месторождения, пользователи и пороги правил «Внимание сегодня»."
      willShow={[
        'Компании и месторождения холдинга',
        'Пользователи и доступ по компаниям',
        'Пороги: рост воды, падение нефти, сроки',
        'Получатели утренней рассылки',
      ]}
      links={[
        { href: '/app', label: 'Сводка холдинга' },
      ]}
    />
  );
}
