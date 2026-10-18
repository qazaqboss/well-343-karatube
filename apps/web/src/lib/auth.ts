/**
 * Вход в кабинет по паролю.
 *
 * Пароль хранится только в переменной окружения ADMIN_PASSWORD и в репозиторий
 * не попадает. Сессия — кука с подписью HMAC-SHA256 на SESSION_SECRET: подделать
 * её, не зная секрета, нельзя, а серверного хранилища сессий не требуется.
 *
 * Поведение при отсутствии переменных — отказ во входе, а не свободный доступ:
 * забытая переменная на проде не должна открывать кабинет всему интернету.
 */

export const SESSION_COOKIE = 'subsoil_session';

/** Срок жизни сессии — 12 часов: рабочий день, после чего вход повторяется. */
export const SESSION_MAX_AGE = 60 * 60 * 12;

export interface AuthConfig {
  password: string | null;
  secret: string | null;
}

export function authConfig(): AuthConfig {
  return {
    password: process.env.ADMIN_PASSWORD?.trim() || null,
    secret: process.env.SESSION_SECRET?.trim() || null,
  };
}

/** Настроен ли вход. Если нет — кабинет закрыт для всех. */
export function authReady(): boolean {
  const c = authConfig();
  return Boolean(c.password && c.secret);
}

const enc = new TextEncoder();

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return base64url(new Uint8Array(sig));
}

function base64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Сравнение без раннего выхода.
 *
 * Обычное === возвращается на первом несовпавшем символе, и по времени ответа
 * пароль можно подбирать посимвольно. Здесь время зависит только от длины.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Токен сессии: срок годности и подпись. */
export async function issueToken(secret: string, now = Date.now()): Promise<string> {
  const exp = Math.floor(now / 1000) + SESSION_MAX_AGE;
  const payload = `admin.${exp}`;
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifyToken(token: string | undefined, secret: string | null): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [role, expRaw, sig] = parts as [string, string, string];
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const expected = await hmac(secret, `${role}.${expRaw}`);
  return safeEqual(sig, expected);
}
