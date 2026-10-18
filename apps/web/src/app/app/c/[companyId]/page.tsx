import { SummaryScreen } from '@/components/summary-screen';

export const metadata = { title: 'Сводка компании — Subsoil' };

export default async function CompanyPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  return <SummaryScreen scope="company" id={companyId} />;
}
