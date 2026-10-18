'use client';

import { useRouter } from 'next/navigation';
import { ScopeSwitcher, type ScopeSwitcherProps } from '@subsoil/ui';

/**
 * Клиентская обвязка переключателя уровня.
 *
 * Сам компонент из packages/ui не знает про роутер: выбор в <select> кладёт
 * ссылку в value, а переход делается здесь. Так дизайн-система остаётся
 * независимой от Next.
 */
export function ScopeNav(props: ScopeSwitcherProps) {
  const router = useRouter();

  return (
    <div
      onChange={(e) => {
        const target = e.target as HTMLSelectElement;
        if (target.dataset.scopeSelect === undefined) return;
        router.push(target.value || '/app');
      }}
    >
      <ScopeSwitcher {...props} />
    </div>
  );
}
