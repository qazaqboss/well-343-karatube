/**
 * Вход-заглушка.
 *
 * Пока API не подключён, /login кладёт cookie демо-сессии, а middleware
 * закрывает /app/*. Это не аутентификация: подписи нет, подделать cookie
 * тривиально. Заменить на JWT от OFI, как только появится /auth.
 *
 * TODO: настоящая сессия — cookie с подписанным JWT, проверка в middleware.
 */
export const SESSION_COOKIE = 'subsoil_demo_session';

export const SESSION_VALUE = 'demo';

/** Срок демо-сессии — сутки: достаточно, чтобы посмотреть, и не навсегда. */
export const SESSION_MAX_AGE = 60 * 60 * 24;
