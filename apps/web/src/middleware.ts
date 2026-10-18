import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';

/**
 * Кабинет закрыт без сессии: живые данные доступны только по логину
 * (CLAUDE.md, п. 2). Адрес, куда человек шёл, передаётся в ?next=,
 * чтобы после входа вернуть его туда же.
 */
export function middleware(req: NextRequest) {
  if (req.cookies.get(SESSION_COOKIE)?.value) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/app/:path*'] };
