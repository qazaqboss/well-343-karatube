/**
 * Вход в кабинет.
 *
 * Обязательна одна переменная — ADMIN_PASSWORD. SESSION_SECRET необязателен:
 * если он задан, подпись сессии идёт на нём, если нет — ключ выводится из
 * самого пароля. Так забытая вторая переменная не оставляет кабинет закрытым
 * для всех, а те, кто её уже задал, ничего не теряют.
 *
 * Логин необязателен и читается из ADMIN_LOGIN (или ADMIN_USER — то же самое,
 * второе имя оставлено, потому что обе переменные успели разойтись по
 * инструкциям). Если логин не задан, проверяется только пароль.
 *
 * Без ADMIN_PASSWORD вход закрыт для всех: забытая переменная не должна
 * открывать данные.
 */

export const SESSION_COOKIE = 'subsoil_session';

/** Срок жизни сессии — 12 часов: рабочий день, после чего вход повторяется. */
export const SESSION_MAX_AGE = 60 * 60 * 12;

export interface AuthConfig {
  /** Логин из ADMIN_LOGIN либо ADMIN_USER. Не задан — вход только по паролю. */
  login: string | null;
  password: string | null;
  /** Явный ключ подписи. Не задан — выводится из пароля. */
  secret: string | null;
}

export function authConfig(): AuthConfig {
  return {
    login: process.env.ADMIN_LOGIN?.trim() || process.env.ADMIN_USER?.trim() || null,
    password: process.env.ADMIN_PASSWORD?.trim() || null,
    secret: process.env.SESSION_SECRET?.trim() || null,
  };
}

/** Настроен ли вход. Достаточно пароля. */
export function authReady(): boolean {
  return Boolean(authConfig().password);
}

const enc = new TextEncoder();

/**
 * Материал для ключа подписи.
 *
 * Берём SESSION_SECRET, если он есть, иначе пароль. В обоих случаях строка
 * прогоняется через SHA-256 с фиксированной солью: подпись не зависит
 * от длины и формы исходной строки, а из куки её не вытащить.
 */
async function signingKey(cfg: AuthConfig): Promise<CryptoKey | null> {
  const base = cfg.secret ?? cfg.password;
  if (!base) return null;
  const material = await crypto.subtle.digest('SHA-256', enc.encode(`subsoil.v1.${base}`));
  return crypto.subtle.importKey('raw', material, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function hmac(cfg: AuthConfig, data: string): Promise<string | null> {
  const key = await signingKey(cfg);
  if (!key) return null;
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

/**
 * Проверка логина и пароля.
 *
 * Логин без учёта регистра: «icp» и «ICP» — один пользователь. Оба поля
 * сравниваются всегда, даже если первое уже не совпало: иначе по времени
 * ответа видно, что именно введено неверно.
 */
export function checkCredentials(login: string, password: string): boolean {
  const cfg = authConfig();
  if (!cfg.password) return false;
  const loginOk = cfg.login
    ? safeEqual(login.trim().toLowerCase(), cfg.login.toLowerCase())
    : true;
  const passOk = safeEqual(password, cfg.password);
  return loginOk && passOk;
}

/** Токен сессии: срок годности и подпись. */
export async function issueToken(now = Date.now()): Promise<string | null> {
  const cfg = authConfig();
  const exp = Math.floor(now / 1000) + SESSION_MAX_AGE;
  const payload = `admin.${exp}`;
  const sig = await hmac(cfg, payload);
  return sig ? `${payload}.${sig}` : null;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const cfg = authConfig();
  if (!cfg.password) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [role, expRaw, sig] = parts as [string, string, string];
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;

  const expected = await hmac(cfg, `${role}.${expRaw}`);
  return expected !== null && safeEqual(sig, expected);
}
