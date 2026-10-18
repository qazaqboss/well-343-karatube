import { SiteFooter, SiteHeader } from '@/components/site-chrome';

/** Общая обвязка витрины: шапка и подвал на всех публичных страницах. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
