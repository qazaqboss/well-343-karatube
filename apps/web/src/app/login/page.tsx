import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button, Hero, Panel } from '@subsoil/ui';
import { SESSION_COOKIE, SESSION_MAX_AGE, authConfig, issueToken, safeEqual } from '@/lib/auth';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata = {
  title: 'Вход — Subsoil',
  description: 'Кабинет Subsoil. Доступ по паролю.',
  robots: { index: false, follow: false },
};

/** Куда разрешено возвращать после входа — только внутрь, иначе это открытый редирект. */
const ALLOWED = ['/app', '/ai', '/erp', '/stage-reports'];

/**
 * Единственная публичная страница сайта — вход.
 *
 * Всё остальное закрыто: фонд, заходы, контракты и AI-помощник работают
 * с данными компании, и снаружи от них не должно быть видно ничего.
 */
export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; e?: string }>;
}) {
  const { next, e } = await searchParams;
  const target = next && ALLOWED.some((p) => next.startsWith(p)) ? next : '/app';
  const { login, password, secret } = authConfig();
  const ready = Boolean(password && secret);

  async function signIn(formData: FormData) {
    'use server';
    const cfg = authConfig();
    if (!cfg.password || !cfg.secret) {
      redirect(`/login?next=${encodeURIComponent(target)}&e=setup`);
    }
    // Логин без учёта регистра: «icp» и «ICP» — один и тот же пользователь.
    // Сравниваем оба поля всегда, чтобы по времени ответа нельзя было понять,
    // какое из них неверно.
    const loginOk = cfg.login
      ? safeEqual(String(formData.get('login') ?? '').trim().toLowerCase(), cfg.login.toLowerCase())
      : true;
    const passOk = safeEqual(String(formData.get('password') ?? ''), cfg.password);
    if (!loginOk || !passOk) {
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
          title="ВХОД В КАБИНЕТ"

          lead="Показатели фонда, заходы NanoCem UT-9, контракты и сроки недропользования. Доступ по паролю."
          watermark="J1-IV"
        />

        <div className="ss-wrap" style={{ padding: '40px 40px 80px', maxWidth: 520 }}>
          {!ready ? (
            <Panel style={{ padding: 20, borderColor: 'var(--ss-crit)' }}>
              <div className="ss-label" style={{ color: 'var(--ss-crit)' }}>
                Вход не настроен
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.65, marginTop: 10 }}>
                На сервере не заданы <code>ADMIN_PASSWORD</code> и <code>SESSION_SECRET</code>.
                Пока их нет, система закрыта для всех — это намеренно: забытая переменная
                не должна открывать данные.
              </p>
            </Panel>
          ) : (
            <form action={signIn} style={{ display: 'grid', gap: 16 }}>
              {e === 'bad' ? (
                <div
                  role="alert"
                  style={{ border: '1px solid var(--ss-crit)', color: 'var(--ss-crit)', padding: '10px 12px', fontSize: 13 }}
                >
                  Неверный логин или пароль.
                </div>
              ) : null}

              {login ? (
                <label style={{ display: 'grid', gap: 6 }}>
                  <span className="ss-label">Логин</span>
                  <input
                    className="ss-focus"
                    type="text"
                    name="login"
                    autoComplete="username"
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
              ) : null}

              <label style={{ display: 'grid', gap: 6 }}>
                <span className="ss-label">Пароль</span>
                <input
                  className="ss-focus"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  autoFocus={!login}
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
                Сессия действует 12 часов.
              </p>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
