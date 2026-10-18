import { SummaryScreen } from '@/components/summary-screen';

export const metadata = { title: 'Сводка месторождения — Subsoil' };

export default async function FieldPage({ params }: { params: Promise<{ fieldId: string }> }) {
  const { fieldId } = await params;
  return <SummaryScreen scope="field" id={fieldId} />;
}
