import type { NextConfig } from 'next';

/** Адрес FastAPI внутри контейнера: он отдаёт AI-помощника, ERP и PDF-отчёты. */
const LEGACY = process.env.LEGACY_ORIGIN ?? 'http://127.0.0.1:8000';

/**
 * Редиректы старых страниц nanocem.app — таблица из 00-migration.md.
 *
 * Из таблицы намеренно исключены /ai и /erp: оба работают и переносятся
 * в Subsoil постепенно, поэтому они не редиректятся на заглушки, а
 * проксируются на прежний сервис (см. rewrites ниже).
 */
const legacyRedirects = [
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/product.html', destination: '/products/nanocem', permanent: true },
  { source: '/stages.html', destination: '/stages', permanent: true },
  { source: '/water-cut.html', destination: '/app/field/water-cut', permanent: true },
  { source: '/sealing.html', destination: '/app/nanocem/sealing', permanent: true },
  { source: '/plan.html', destination: '/app/nanocem/program', permanent: true },
  // Страницы скважин старого сайта — в фонд кабинета.
  { source: '/well-:id(\\d+).html', destination: '/app/field/wells', permanent: true },
];

/**
 * Что остаётся за прежним сервисом.
 *
 * PDF и баннеры тоже: на них ссылаются из переписки и поисковой выдачи,
 * и ломать эти адреса ради переезда незачем.
 */
const legacyProxy = [
  { source: '/ai', destination: `${LEGACY}/ai` },
  { source: '/ai/:path*', destination: `${LEGACY}/ai/:path*` },
  { source: '/erp', destination: `${LEGACY}/erp/` },
  { source: '/erp/:path*', destination: `${LEGACY}/erp/:path*` },
  { source: '/stage-reports/:path*', destination: `${LEGACY}/stage-reports/:path*` },
  { source: '/:file(.*\\.pdf)', destination: `${LEGACY}/:file` },
  { source: '/og-:name(.*\\.png)', destination: `${LEGACY}/og-:name` },
];

const nextConfig: NextConfig = {
  transpilePackages: ['@subsoil/ui', '@subsoil/shared'],
  async redirects() {
    return legacyRedirects;
  },
  async rewrites() {
    return legacyProxy;
  },
};

export default nextConfig;
