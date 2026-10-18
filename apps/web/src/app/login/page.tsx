import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button, Hero } from '@subsoil/ui';
import { SESSION_COOKIE, SESSION_MAX_AGE, SESSION_VALUE } from '@/lib/session';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata = { title: 'Вход — Subsoil' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const target = next && next.startsWith('/app') ? next : '/app';

  async function signIn() {
    'use server';
    const jar = await cookies();
    jar.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    redirect(target);
  }

  return (
    <>
      <SiteHeader />
      <main>
        <Hero
          eyebrow="Кабинет"
          title="ВХОД В SUBSOIL"
          lead="Пока работает демо-режим: вход без пароля кладёт сессию на сутки и открывает кабинет на демонстрационных данных. Настоящая аутентификация подключится вместе с API."
          watermark="/APP"
        />
        <div className="ss-wrap" style={{ padding: '40px 40px 80px', maxWidth: 560 }}>
          <form action={signIn} style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span className="ss-label">Почта</span>
              <input
                className="ss-focus"
                type="email"
                name="email"
                placeholder="demo@subsoil.kz"
                autoComplete="username"
                style={inputStyle}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span className="ss-label">Пароль</span>
              <input
                className="ss-focus"
                type="password"
                name="password"
                placeholder="любой"
                autoComplete="current-password"
                style={inputStyle}
              />
            </label>
            <div style={{ marginTop: 8 }}>
              <Button type="submit">Войти в демо-кабинет</Button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ss-ink-quiet)', lineHeight: 1.6 }}>
              Поля ни на что не влияют — форма оставлена, чтобы страница не изменилась,
              когда появится настоящий вход.
            </p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

const inputStyle = {
  border: '1px solid var(--ss-line)',
  borderRadius: 'var(--ss-radius-btn)',
  background: 'var(--ss-bg)',
  color: 'var(--ss-ink)',
  font: 'inherit',
  padding: '10px 12px',
} as const;
