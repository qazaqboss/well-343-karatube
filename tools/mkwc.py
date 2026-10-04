# -*- coding: utf-8 -*-
"""Сборка public/water-cut.html на каркасе sealing.html."""
import io, re

PUB = "/Users/damirsultan/Desktop/Wibecoding/nanocem.app/public/"
head = io.open('/tmp/wc_head.html', encoding='utf-8').read()

# ── голова: заголовок, OG, активный пункт меню ───────────────────────────────
head = re.sub(r'<title>[^<]*</title>', '<title>Обводнённость фонда — NanoCem UT-9</title>', head)
head = re.sub(r'<meta property="og:title" content="[^"]*">',
              '<meta property="og:title" content="Обводнённость фонда — общий анализ">', head)
head = re.sub(r'<meta property="og:description" content="[^"]*">',
              '<meta property="og:description" content="Семьдесят скважин, девять месяцев замеров: '
              'распределение обводнённости по фонду, разбор по горизонтам и место наших заходов UT-9.">', head)
head = head.replace('og-sealing.png', 'og-fund.png')
head = head.replace('<a href="sealing.html" class="nav-pill active">Герметичность</a>',
                    '<a href="sealing.html" class="nav-pill">Герметичность</a>')
head = head.replace('<a href="sealing.html" class="active" onclick="closeNav()">Герметичность</a>',
                    '<a href="sealing.html" onclick="closeNav()">Герметичность</a>')
head = head.replace('<div class="header-date">заходы на 03.08 · статусы <span data-wells-updated>27.09.2026</span></div>',
                    '<div class="header-date">фонд на 27.09.2026 · 70 скважин</div>')
# пункт меню «Обводнённость» — на этой странице активный
head = head.replace('<a href="index.html" class="nav-pill active">Фонд</a>',
                    '<a href="index.html" class="nav-pill">Фонд</a>'
                    '<a href="water-cut.html" class="nav-pill active">Обводнённость</a>')
head = head.replace('<a href="index.html" class="nav-pill">Фонд</a>\n      <a href="sealing.html"',
                    '<a href="index.html" class="nav-pill">Фонд</a>\n      '
                    '<a href="water-cut.html" class="nav-pill active">Обводнённость</a>\n      <a href="sealing.html"')
head = head.replace('<a href="index.html" onclick="closeNav()">Фонд скважин</a>',
                    '<a href="index.html" onclick="closeNav()">Фонд скважин</a>\n'
                    '  <a href="water-cut.html" class="active" onclick="closeNav()">Обводнённость фонда</a>')
head = head.replace('<body data-well-id="">', '<body>')

# ── свои стили страницы ──────────────────────────────────────────────────────
CSS = """
/* ── Обводнённость фонда ─────────────────────────────────────────────────── */
.wc-chart{padding:26px 40px 10px;border-bottom:1px solid var(--border)}
.wc-wrap{height:300px;position:relative}
.wc-legend{display:flex;gap:22px;flex-wrap:wrap;margin:14px 0 4px}
.wc-leg{display:flex;align-items:center;gap:7px;font-family:var(--font-data);font-size:11px;color:var(--grey);letter-spacing:.5px}
.wc-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}

/* распределение по диапазонам */
.dist{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--border);border:1px solid var(--border)}
.dist-col{background:var(--bg);padding:20px 18px 18px;display:flex;flex-direction:column}
.dist-range{font-family:var(--font-data);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--grey-dim)}
.dist-n{font-family:var(--font-h);font-size:44px;font-weight:700;line-height:1;margin-top:10px}
.dist-sub{font-family:var(--font-data);font-size:11px;color:var(--grey);margin-top:5px}
.dist-bar{height:5px;background:var(--border-dim);margin-top:14px;position:relative;overflow:hidden}
.dist-bar i{position:absolute;inset:0 auto 0 0;background:var(--white)}
.dist-ours{margin-top:14px;display:flex;gap:5px;flex-wrap:wrap;min-height:22px}
.dist-chip{font-family:var(--font-h);font-size:11px;font-weight:600;letter-spacing:1px;
           border:1px solid var(--white);background:var(--white);color:var(--bg);padding:3px 8px;border-radius:2px}

/* горизонты */
.hz{border:1px solid var(--border)}
.hz-row{display:grid;grid-template-columns:120px 1fr 86px 70px;gap:16px;align-items:center;
        padding:14px 20px;border-bottom:1px solid var(--border-dim)}
.hz-row:last-child{border-bottom:none}
.hz-name{font-family:var(--font-h);font-size:15px;font-weight:600;letter-spacing:1px}
.hz-track{height:10px;background:var(--bg-2);position:relative;overflow:hidden}
.hz-fill{position:absolute;inset:0 auto 0 0;background:var(--white)}
.hz-val{font-family:var(--font-h);font-size:18px;font-weight:700;text-align:right}
.hz-n{font-family:var(--font-data);font-size:11px;color:var(--grey-dim);text-align:right}

/* таблица фонда */
.tf-top{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:14px}
.tf-filters{display:flex;gap:6px;flex-wrap:wrap}
.tf-btn{font-family:var(--font-body);font-size:12px;font-weight:500;color:var(--grey);background:none;
        border:1px solid var(--border);padding:6px 14px;cursor:pointer;border-radius:2px;white-space:nowrap}
.tf-btn:hover{border-color:var(--grey);color:var(--white-dim)}
.tf-btn.on{background:var(--white);color:var(--bg);border-color:var(--white);font-weight:600}
.tf-count{font-family:var(--font-data);font-size:11px;color:var(--grey-dim)}
.tf-wrap{border:1px solid var(--border);overflow-x:auto}
.tf{width:100%;border-collapse:collapse;min-width:720px;font-size:12.5px}
.tf th{font-family:var(--font-data);font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--grey-dim);
       text-align:left;padding:11px 14px;background:var(--surface);border-bottom:1px solid var(--border);white-space:nowrap}
.tf td{padding:11px 14px;border-bottom:1px solid var(--border-dim);vertical-align:middle}
.tf tr:last-child td{border-bottom:none}
.tf tr.ours{background:var(--bg-2)}
.tf .num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.tf-well{font-family:var(--font-h);font-size:16px;font-weight:600;letter-spacing:1px;white-space:nowrap}
.tf-tag{display:inline-block;font-family:var(--font-data);font-size:9px;letter-spacing:1px;text-transform:uppercase;
        background:var(--white);color:var(--bg);padding:2px 7px;border-radius:2px;margin-left:8px;vertical-align:middle}
.tf-mini{display:inline-block;width:64px;height:16px;vertical-align:middle}
.tf-idle{color:var(--grey-dim)}

/* наши заходы: до и после */
.ba{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border)}
.ba-col{background:var(--bg);padding:22px 22px 20px}
.ba-w{font-family:var(--font-h);font-size:24px;font-weight:700;letter-spacing:1px}
.ba-line{display:flex;align-items:baseline;gap:10px;margin-top:14px}
.ba-from{font-family:var(--font-h);font-size:26px;font-weight:700;color:var(--grey-muted)}
.ba-arr{color:var(--grey-dim);font-size:15px}
.ba-to{font-family:var(--font-h);font-size:34px;font-weight:700;color:#16A34A}
.ba-note{font-size:12px;color:var(--grey);line-height:1.5;margin-top:12px}

@media(max-width:1100px){
  .dist{grid-template-columns:repeat(2,1fr)}
  .dist-col:last-child{grid-column:1/-1}
  .ba{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:900px){
  .wc-chart{padding:20px 20px 8px}
  .hz-row{grid-template-columns:80px 1fr 70px;gap:10px;padding:12px 14px}
  .hz-n{display:none}
}
@media(max-width:640px){
  .dist{grid-template-columns:1fr}
  .dist-col:last-child{grid-column:auto}
  .ba{grid-template-columns:1fr}
}
"""
head = head.replace('</style>', CSS + '</style>')
io.open('/tmp/wc_head2.html', 'w', encoding='utf-8').write(head)
print('голова подготовлена:', len(head))
