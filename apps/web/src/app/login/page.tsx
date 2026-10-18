import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button, Hero, Panel } from '@subsoil/ui';
import { SESSION_COOKIE, SESSION_MAX_AGE, authConfig, issueToken, safeEqual } from '@/lib/auth';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata = { title: 'Вход — Subsoil' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; e?: string }>;
}) {
  const { next, e } = await searchParams;
  // Пускаем обратно только на внутренние адреса — иначе ?next= становится
  // открытым редиректом на чужой сайт.
  const ALLOWED = ['/app', '/ai', '/erp', '/stage-reports'];
  const target = next && ALLOWED.some((p) => next.startsWith(p)) ? next : '/app';
  const { password, secret } = authConfig();
  const ready = Boolean(password && secret);

  async function signIn(formData: FormData) {
    'use server';
    const cfg = authConfig();
    if (!cfg.password || !cfg.secret) {
      redirect(`/login?next=${encodeURIComponent(target)}&e=setup`);
    }
    const given = String(formData.get('password') ?? '');
    if (!safeEqual(given, cfg.password)) {
      redirect(`/login?next=${encodeURIComponent(target)}&e=bad`);
    }
    const jar = await cookies();
    jar.set(SESSION_COOKIE, await issueToken(cfg.secret), {
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
      <main>
        <Hero
          eyebrow="Кабинет"
          title="ВХОД В SUBSOIL"
          lead="Показатели фонда, заходы UT-9 и требования доступны только по паролю."
          watermark="/APP"
        />
        <div className="ss-wrap" style={{ padding: '40px 40px 80px', maxWidth: 520 }}>
          {!ready ? (
            <Panel style={{ padding: 20, borderColor: 'var(--ss-crit)' }}>
              <div className="ss-label" style={{ color: 'var(--ss-crit)' }}>
                Вход не настроен
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.65, marginTop: 10 }}>
                На сервере не заданы переменные <code>ADMIN_PASSWORD</code> и{' '}
                <code>SESSION_SECRET</code>. Пока их нет, кабинет закрыт для всех — это
                намеренно: забытая переменная не должна открывать данные.
              </p>
            </Panel>
          ) : (
            <form action={signIn} style={{ display: 'grid', gap: 16 }}>
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
                  Неверный пароль.
                </div>
              ) : null}

              <label style={{ display: 'grid', gap: 6 }}>
                <span className="ss-label">Пароль</span>
                <input
                  className="ss-focus"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  style={{
                    border: '1px solid var(--ss-line)',
                    borderRadius: 'var(--ss-radius-btn)',
                    background: 'var(--ss-bg)',
                    color: 'var(--ss-ink)',
                    font: 'inherit',
                    padding: '10px 12px',
                  }}
                />
              </label>

              <div>
                <Button type="submit">Войти</Button>
              </div>

              <p style={{ fontSize: 13, color: 'var(--ss-ink-quiet)', lineHeight: 1.6 }}>
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
