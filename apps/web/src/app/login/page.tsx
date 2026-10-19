import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@subsoil/ui';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  authConfig,
  checkCredentials,
  issueToken,
} from '@/lib/auth';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata = {
  title: 'Вход — Subsoil',
  description: 'Кабинет Subsoil. Доступ по паролю.',
  robots: { index: false, follow: false },
};

/** Куда разрешено возвращать после входа — только внутрь, иначе открытый редирект. */
const ALLOWED = ['/app', '/ai', '/erp', '/stage-reports'];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; e?: string }>;
}) {
  const { next, e } = await searchParams;
  const target = next && ALLOWED.some((p) => next.startsWith(p)) ? next : '/app';
  const cfg = authConfig();

  async function signIn(formData: FormData) {
    'use server';
    if (!authConfig().password) {
      redirect(`/login?next=${encodeURIComponent(target)}&e=setup`);
    }

    const ok = checkCredentials(
      String(formData.get('login') ?? ''),
      String(formData.get('password') ?? ''),
    );
    if (!ok) {
      redirect(`/login?next=${encodeURIComponent(target)}&e=bad`);
    }

    const token = await issueToken();
    if (!token) {
      redirect(`/login?next=${encodeURIComponent(target)}&e=setup`);
    }

    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    redirect(target);
  }

  return (
    <>
      <SiteHeader />
      <main
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: '56px 16px 72px',
          minHeight: 'calc(100vh - 64px - 120px)',
          background: 'var(--ss-panel)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'var(--ss-bg)',
            border: '1px solid var(--ss-line)',
            padding: 32,
          }}
        >
          <div className="ss-label">Кабинет</div>
          <h1 className="ss-display" style={{ fontSize: 30, fontWeight: 700, marginTop: 10, lineHeight: 1.05 }}>
            Вход в Subsoil
          </h1>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 12 }}>
            Показатели фонда, заходы NanoCem UT-9, контракты и сроки недропользования.
          </p>

          {!cfg.password ? (
            <div
              role="alert"
              style={{
                border: '1px solid var(--ss-crit)',
                color: 'var(--ss-crit)',
                padding: '12px 14px',
                fontSize: 13,
                lineHeight: 1.6,
                marginTop: 24,
              }}
            >
              <b>Вход не настроен.</b> На сервере не задана переменная{' '}
              <code>ADMIN_PASSWORD</code>. Пока её нет, кабинет закрыт для всех — это намеренно.
            </div>
          ) : (
            <form action={signIn} style={{ display: 'grid', gap: 14, marginTop: 24 }}>
              {e === 'bad' ? (
                <div
                  role="alert"
                  style={{
                    border: '1px solid var(--ss-crit)',
                    color: 'var(--ss-crit)',
                    padding: '10px 12px',
                    fontSize: 13,
                  }}
                >
                  Неверный логин или пароль.
                </div>
              ) : null}

              {cfg.login ? (
                <label style={{ display: 'grid', gap: 6 }}>
                  <span className="ss-label">Логин</span>
                  <input
                    className="ss-focus"
                    type="text"
                    name="login"
                    autoComplete="username"
                    autoFocus
                    required
                    style={inputStyle}
                  />
                </label>
              ) : null}

              <label style={{ display: 'grid', gap: 6 }}>
                <span className="ss-label">Пароль</span>
                <input
                  className="ss-focus"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  autoFocus={!cfg.login}
                  required
                  style={inputStyle}
                />
              </label>

              <Button type="submit" style={{ width: '100%', marginTop: 6 }}>
                Войти
              </Button>

              <p style={{ fontSize: 12, color: 'var(--ss-ink-quiet)', lineHeight: 1.6 }}>
                Сессия действует 12 часов. Данные фонда за пределы кабинета не выходят.
              </p>
            </form>
          )}
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
  fontSize: 15,
  padding: '11px 12px',
  width: '100%',
} as const;
