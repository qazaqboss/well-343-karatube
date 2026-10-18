'use client';

import { Button, Panel, SectionTitle } from '@subsoil/ui';

/**
 * Экран ошибки кабинета.
 *
 * Чаще всего сюда приводит недоступный API в режиме http. Показываем, что
 * именно сломалось и в каком режиме работает приложение, — иначе человек
 * видит пустой экран и не понимает, его это данные или сбой.
 */
export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  const mode = process.env.NEXT_PUBLIC_API_MODE === 'http' ? 'http' : 'mock';

  return (
    <>
      <SectionTitle aside={`режим данных: ${mode}`}>Данные не загрузились</SectionTitle>
      <Panel style={{ padding: 24, maxWidth: 760 }}>
        <p style={{ fontSize: 15, lineHeight: 1.65 }}>
          {mode === 'http'
            ? 'Приложение работает с реальным API, но запрос не прошёл. Проверьте NEXT_PUBLIC_API_URL и доступность сервиса.'
            : 'Сборка демо-данных упала. Это ошибка в коде, а не в данных клиента.'}
        </p>
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: 'var(--ss-panel)',
            border: '1px solid var(--ss-line)',
            fontSize: 12,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: 'var(--ss-crit)',
          }}
        >
          {error.message}
        </pre>
        <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button onClick={reset}>Повторить</Button>
          <Button href="/" variant="secondary">
            На витрину
          </Button>
        </div>
      </Panel>
    </>
  );
}
