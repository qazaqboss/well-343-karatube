import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, authConfig, verifyToken } from '@/lib/auth';

/**
 * Кабинет закрыт без действующей сессии.
 *
 * Под замком не только /app, но и прежние инструменты — AI-помощник и ERP.
 * Они отдают рабочие данные компании: название месторождения, оператора,
 * контракты и сроки. На старом сайте они были открыты всем, и это был
 * недосмотр, а не решение.
 *
 * Подпись куки проверяется здесь же, на границе: дальше запрос без неё
 * не проходит. Адрес, куда человек шёл, передаётся в ?next=.
 */
export async function middleware(req: NextRequest) {
  const { secret } = authConfig();
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (await verifyToken(token, secret)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  const res = NextResponse.redirect(url);
  // Протухшую или подделанную куку стираем, чтобы не пытаться по ней войти снова.
  if (token) res.cookies.delete(SESSION_COOKIE);
  return res;
}

export const config = {
  matcher: ['/app/:path*', '/ai', '/ai/:path*', '/erp', '/erp/:path*', '/stage-reports/:path*'],
};
