import type { Metadata } from 'next';
import '@subsoil/ui/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Subsoil — платформа недропользования и аналитики промысла',
  description:
    'От суточного замера на скважине до отчёта по этапу недропользования. Показатели и требования по всем активам на одном экране.',
  openGraph: {
    title: 'Subsoil — платформа недропользования и аналитики промысла',
    description: 'Показатели и требования по всем активам холдинга на одном экране.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
