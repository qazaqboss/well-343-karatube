/**
 * Диагностика входа: дошли ли переменные до запущенного процесса.
 *
 * Нужна потому, что по закрытому кабинету нельзя отличить две разные причины:
 * переменной нет в сервисе — или она есть, но приложение её не читает.
 * Эндпоинт отвечает на этот вопрос, не раскрывая значений: только «задана
 * или нет», плюс имя сервиса и коммит, чтобы видеть, тот ли это деплой.
 *
 * Паролей и их длин здесь нет: длина — тоже подсказка для подбора. Имена
 * переменных выводятся как они есть на сервере: опечатка в имени и пустое
 * значение снаружи выглядят одинаково, а в списке имён разница сразу видна.
 */
import { NextResponse } from 'next/server';

/** Без этого Next отдал бы один и тот же ответ со сборки. */
export const dynamic = 'force-dynamic';

const set = (v: string | undefined) => Boolean(v && v.trim());

export function GET() {
  return NextResponse.json(
    {
      env: {
        ADMIN_PASSWORD: set(process.env.ADMIN_PASSWORD),
        ADMIN_LOGIN: set(process.env.ADMIN_LOGIN),
        ADMIN_USER: set(process.env.ADMIN_USER),
        SESSION_SECRET: set(process.env.SESSION_SECRET),
      },
      // Имена, похожие на наши, без значений: видно опечатку и лишний пробел.
      // Пробелы показываем в кавычках, иначе «ADMIN_PASSWORD » не отличить.
      keys: Object.keys(process.env)
        .filter((k) => /admin|login|password/i.test(k))
        .sort()
        .map((k) => JSON.stringify(k)),
      // Вход открывается одним только паролем — остальное необязательно.
      authReady: set(process.env.ADMIN_PASSWORD),
      deploy: {
        nodeEnv: process.env.NODE_ENV ?? null,
        service: process.env.RAILWAY_SERVICE_NAME ?? null,
        environment: process.env.RAILWAY_ENVIRONMENT_NAME ?? null,
        commit: process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      },
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
