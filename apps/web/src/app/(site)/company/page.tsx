import { Hero, Panel, SectionTitle } from '@subsoil/ui';

export const metadata = { title: 'Компания — Subsoil' };

export default function Page() {
  return (
    <>
      <Hero
        eyebrow="О нас"
        title="КТО ДЕЛАЕТ SUBSOIL"
        lead="Платформа выросла из двух практик: промысловой аналитики зрелого фонда и сопровождения требований недропользования в Казахстане."
        watermark="KZ"
      />
      <section className="ss-wrap" style={{ paddingBlock: 56, display: 'grid', gap: 16, maxWidth: 760 }}>
        <Panel style={{ padding: 24 }}>
          <SectionTitle>Контакты</SectionTitle>
          <p style={{ fontSize: 15, lineHeight: 1.8 }}>
            ТОО «ЭкоМикс» · EASYMIX
            <br />
            Актобе, Промзона 679/17
            <br />
            8 747 111 19 64
            <br />
            info@easymix.kz
          </p>
        </Panel>
      </section>
    </>
  );
}
