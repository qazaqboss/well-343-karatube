import type { NextConfig } from 'next';

/**
 * Редиректы старых страниц nanocem.app — таблица из 00-migration.md.
 *
 * Якоря (`/erp/#contracts`) сервер не видит: их разбирает клиентский
 * обработчик на /app/subsoil.
 */
const legacyRedirects = [
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/product.html', destination: '/products/nanocem-ut9', permanent: true },
  { source: '/stages.html', destination: '/solutions/subsoil-stages', permanent: true },
  { source: '/water-cut.html', destination: '/app/field/water-cut', permanent: true },
  { source: '/sealing.html', destination: '/app/nanocem/sealing', permanent: true },
  { source: '/plan.html', destination: '/app/nanocem/program', permanent: true },
  { source: '/erp', destination: '/app/subsoil', permanent: true },
  { source: '/erp/', destination: '/app/subsoil', permanent: true },
  { source: '/erp/:path*', destination: '/app/subsoil', permanent: true },
  { source: '/ai', destination: '/app/ai', permanent: true },
  // Страницы скважин старого сайта — в фонд кабинета.
  { source: '/well-:id(\\d+).html', destination: '/app/field/wells', permanent: true },
];

const nextConfig: NextConfig = {
  transpilePackages: ['@subsoil/ui', '@subsoil/shared'],
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
