import { ModuleStub } from '@/components/module-stub';

export const metadata = { title: 'Программа UT-9 — Subsoil' };

export default function Page() {
  return (
    <ModuleStub
      title="Программа UT-9"
      lead="Кандидаты на изоляцию, волны заходов и сценарии применения. Страница переносится со старого сайта."
      willShow={[
        'Портфель кандидатов со скорингом',
        'Волны заходов по месяцам',
        'Сценарии: прямой ЦПД, с ОТРС, с реперфорацией',
      ]}
      links={[
        { href: '/app/nanocem', label: 'Обзор UT-9' },
      ]}
    />
  );
}
