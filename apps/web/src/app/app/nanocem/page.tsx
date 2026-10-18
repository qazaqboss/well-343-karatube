import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'NanoCem UT-9 — обзор — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="NanoCem UT-9 — обзор"
      lead="Заходы изоляции водопритока, прирост дебита и доля успешных. Сводные цифры уже считаются и видны на сводке холдинга."
      willShow={[
        'Все заходы с результатом в т/сут',
        'Прирост = средний дебит 14 суток после минус 14 до',
        'Кандидаты со скорингом',
        'Герметичность: АКЦ/ЭМДС, опрессовки',
      ]}
      links={[
        { href: '/app', label: 'Сводка холдинга' },
        { href: '/app/nanocem/program', label: 'Программа' },
        { href: '/app/nanocem/sealing', label: 'Герметичность' },
      ]}
    />
  );
}
