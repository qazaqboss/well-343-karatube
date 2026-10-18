'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Якоря старого ERP: /erp/#contracts и далее.
 *
 * Сервер якорь не видит, поэтому редирект из next.config.ts приводит человека
 * на /app/subsoil, а дальше разбираемся на клиенте — как и описано в
 * 00-migration.md, п. 3.
 */
const MAP: Record<string, string> = {
  '#contracts': '/app/subsoil/contracts',
  '#wells': '/app/field/wells',
  '#deadlines': '/app/subsoil/obligations?status=overdue',
  '#calendar': '/app/subsoil/calendar',
  '#reports': '/app/reports',
};

export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const target = MAP[window.location.hash];
    if (target) router.replace(target);
  }, [router]);

  return null;
}
