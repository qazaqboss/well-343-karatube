import { Button, Hero, Panel, SectionTitle } from '@subsoil/ui';

export const metadata = { title: 'Запросить демо — Subsoil' };

const FIELDS = [
  { name: 'name', label: 'Имя', type: 'text', placeholder: 'Как к вам обращаться' },
  { name: 'company', label: 'Компания', type: 'text', placeholder: 'ТОО «…»' },
  { name: 'email', label: 'Почта', type: 'email', placeholder: 'you@company.kz' },
  { name: 'phone', label: 'Телефон', type: 'tel', placeholder: '+7 …' },
] as const;

/**
 * Форма запроса демо.
 *
 * Отправки пока нет: некуда — бэкенд переносится. Поэтому форма честно
 * говорит об этом и даёт прямые контакты, а не делает вид, что приняла заявку.
 *
 * TODO: POST на /demo-requests, когда появится API.
 */
export default function DemoPage() {
  return (
    <>
      <Hero
        eyebrow="Демонстрация"
        title="ПОСМОТРЕТЬ НА СВОИХ ДАННЫХ"
        lead="Покажем сводку на одном вашем месторождении: что добыли, где отклонения, какие сроки горят. Займёт около тридцати минут."
        watermark="DEMO"
      />

      <section className="ss-wrap" style={{ paddingBlock: 56, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
        <div>
          <SectionTitle>Заявка</SectionTitle>
          <Panel style={{ padding: 24 }}>
            <form style={{ display: 'grid', gap: 16 }}>
              {FIELDS.map((f) => (
                <label key={f.name} style={{ display: 'grid', gap: 6 }}>
                  <span className="ss-label">{f.label}</span>
                  <input
                    className="ss-focus"
                    type={f.type}
                    name={f.name}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                </label>
              ))}
              <label style={{ display: 'grid', gap: 6 }}>
                <span className="ss-label">Что хотите посмотреть</span>
                <textarea className="ss-focus" name="message" rows={4} style={inputStyle} />
              </label>

              <div>
                <Button type="submit" disabled>
                  Отправить
                </Button>
              </div>

              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)' }}>
                Отправка пока не подключена — бэкенд переносится. Напишите на{' '}
                <a href="mailto:info@easymix.kz" style={{ borderBottom: '1px solid var(--ss-line)' }}>
                  info@easymix.kz
                </a>{' '}
                или позвоните: 8 747 111 19 64.
              </p>
            </form>
          </Panel>
        </div>

        <div>
          <SectionTitle>Что покажем</SectionTitle>
          <Panel quiet style={{ padding: 24 }}>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.9 }}>
              <li>Сводку холдинга: показатели, отклонения, сроки</li>
              <li>Как замер с телефона доходит до отчёта</li>
              <li>Разбор одного вашего кандидата на изоляцию</li>
              <li>Карту отчётности по вашему контракту</li>
            </ul>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ss-ink-quiet)', marginTop: 16 }}>
              Можно и без своих данных:{' '}
              <a href="/login" style={{ borderBottom: '1px solid var(--ss-line)' }}>
                открыть кабинет на демо-данных →
              </a>
            </p>
          </Panel>
        </div>
      </section>
    </>
  );
}

const inputStyle = {
  border: '1px solid var(--ss-line)',
  borderRadius: 'var(--ss-radius-btn)',
  background: 'var(--ss-bg)',
  color: 'var(--ss-ink)',
  font: 'inherit',
  padding: '10px 12px',
  width: '100%',
} as const;
