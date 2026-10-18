import { SectionTitle } from '@subsoil/ui';

/**
 * Обвязка закрытого сайта.
 *
 * Шапка без навигации: публичных разделов больше нет, вести из неё некуда.
 * Подвал оставляет контакты — чтобы человек, попавший сюда по ссылке,
 * понимал, чей это сайт, и мог написать.
 */
export function GateHeader() {
  return (
    <header style={{ borderBottom: '1px solid var(--ss-line)' }}>
      <div
        className="ss-wrap"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 16 }}
      >
        <span
          className="ss-display"
          style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.18em' }}
        >
          Subsoil
        </span>
        <span className="ss-label">Закрытая система</span>
      </div>
    </header>
  );
}

export function GateFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--ss-line)', marginTop: 64 }}>
      <div
        className="ss-wrap"
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          padding: '24px 40px',
          fontSize: 12,
          color: 'var(--ss-ink-quiet)',
        }}
      >
        <div>ТОО «ЭкоМикс» · EASYMIX</div>
        <div>Актобе, Промзона 679/17</div>
        <div>8 747 111 19 64 · info@easymix.kz</div>
      </div>
    </footer>
  );
}

export { SectionTitle };
