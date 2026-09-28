/* Единый источник данных по фонду. Меняем здесь — обновляется на всех страницах.
   Обновлено: 27.09.2026 (суточные режимные листы). */
(function () {
  "use strict";

  var DATA = {
    updated: "27.09.2026",
    wells: [
      {
        id: "343", href: "well-343.html", title: "Скважина 343",
        status: { code: "work", label: "В работе", detail: "150 об/мин" },
        last: { date: "27.09", qn: "10,61", obv: "48,1", qzh: "23,5" },
        stats: [
          ["Qн средн. за сентябрь", "9,91 т/сут"],
          ["Диапазон Qн", "9,01 – 10,71"],
          ["Обводнённость", "45,0 → 48,1%"],
          ["Рабочих суток", "27 из 27"]
        ],
        note: "Опорная скважина программы, восьмой месяц после РИР. 13.09 обороты снижены 160 → 150 — дебит вырос с 9,4 до 10,7 т/сут, обводнённость опустилась на 1,5 пункта: форсирование себя не оправдывало.",
        seal: {
          code: "first", label: "Герметично с 1-го", entries: "1 заход",
          date: "январь 2026", zone: "Западно-центральная", qobv: "15,7 т/сут · 36%",
          note: "Опорный кейс: обводнённость с 89,4% до 27,5% на пике, эффект держится восьмой месяц."
        }
      },
      {
        id: "342", href: "well-342.html", title: "Скважина 342",
        status: { code: "work", label: "В работе", detail: "160 об/мин" },
        last: { date: "27.09", qn: "7,86", obv: "37,1", qzh: "14,3" },
        stats: [
          ["Qн средн. за сентябрь", "7,40 т/сут"],
          ["Максимум (25.09)", "7,87 т/сут"],
          ["Обводнённость", "39,0 → 37,1%"],
          ["Рабочих суток", "27 из 27"]
        ],
        note: "Лучшая динамика месяца в фонде: после подъёма оборотов 150 → 160 дебит вырос на 13%, а обводнённость снизилась до 37,1% — минимума с майской изоляции.",
        seal: {
          code: "second", label: "Герметично со 2-го", entries: "2 захода",
          date: "10.05 → 31.05.2026", zone: "Северо-восточная", qobv: "7,4 т/сут · 28%",
          note: "Северо-восточный фланг: вода активнее, первого захода не хватило."
        }
      },
      {
        id: "301", href: "well-301.html", title: "Скважина 301",
        status: { code: "work", label: "В работе", detail: "150 об/мин" },
        last: { date: "27.09", qn: "10,28", obv: "37,1", qzh: "18,6" },
        stats: [
          ["Qн средн. за сентябрь", "10,15 т/сут"],
          ["Максимум (21.09)", "10,41 т/сут"],
          ["Обводнённость средн.", "37,8%"],
          ["Рабочих суток", "27 из 27"]
        ],
        note: "Второй ровный месяц подряд: обводнённость в коридоре 37–39%, динамический уровень поднялся с 500 до 281 м. Единственная потеря — авария на линии 08.09.",
        seal: {
          code: "first", label: "Герметично с 1-го", entries: "1 заход",
          date: "06.06.2026", zone: "Юго-западный центр", qobv: "11,7 т/сут · 39%",
          note: "Стоит на границе с водоактивным поясом, но интервал закрылся сразу."
        }
      },
      {
        id: "311", href: "well-311.html", title: "Скважина 311",
        status: { code: "work", label: "В работе", detail: "110 об/мин · после РИР" },
        last: { date: "27.09", qn: "6,31", obv: "60,1", qzh: "18,1" },
        stats: [
          ["Qн средн. за сентябрь", "6,35 т/сут"],
          ["Максимум (14.09)", "6,65 т/сут"],
          ["Обводнённость", "59,6 → 60,1%"],
          ["Рабочих суток", "27 из 27"]
        ],
        note: "Месяц без событий: дебит в узком коридоре 5,94–6,65 т/сут. Обводнённость закрепилась на 60% — против 90,5% до РИР эффект держится, но августовский минимум 49% не удержался.",
        seal: {
          code: "confirmed", label: "Эффект подтверждён после освоения", entries: "1 заход",
          date: "09.07.2026", zone: "Юго-западный край", qobv: "6,31 т/сут · 60,1% (27.09)",
          note: "После вывода на режим обводнённость упала с 90,5% до 49%, затем откатилась к 60% и там стабилизировалась. Изоляция работает, но фон заколонного цемента плохой — вода частично возвращается."
        }
      },
      {
        id: "303", href: "well-303.html", title: "Скважина 303",
        status: { code: "work", label: "В работе с 11.09", detail: "100 об/мин · после ТРС" },
        last: { date: "27.09", qn: "2,78", obv: "65,4", qzh: "9,2" },
        stats: [
          ["Qн средн. за сентябрь", "1,77 т/сут"],
          ["Максимум (23.09)", "2,86 т/сут"],
          ["Обводнённость", "95,0 → 65,4%"],
          ["Рабочих суток", "16 из 27"]
        ],
        note: "ТРС 09–10.09, запуск 11.09. За две недели вывода обводнённость упала с 95% до 65%, а дебит поднялся до 2,86 т/сут — лучшего значения за всю историю наблюдений. Августовская остановка была механикой подвески, не потерей изоляции.",
        seal: {
          code: "first", label: "Герметично с 1-го", entries: "1 заход",
          date: "13.07.2026", zone: "Восточная", qobv: "2,86 т/сут · 72% (23.09)",
          note: "Самый «сухой» вход в ядре залежи. Августовская остановка была механикой подвески: после ТРС скважина вышла на рекордный для себя дебит, изоляция интервала не пострадала."
        }
      },
      {
        id: "305", href: "well-305.html", title: "Скважина 305",
        status: { code: "work", label: "В работе с 08.09", detail: "60 об/мин · горизонт T1-II" },
        last: { date: "27.09", qn: "1,42", obv: "18,6", qzh: "0,5" },
        stats: [
          ["Qн средн. за сентябрь", "0,93 т/сут"],
          ["Максимум (21.09)", "2,11 т/сут"],
          ["Обводнённость", "100 → 18,6%"],
          ["Рабочих суток", "19 из 27"]
        ],
        note: "ГРП 05–07.09 и перевод на вышележащий горизонт T1-II (744–754 м), запуск 08.09. Вода ушла до 18,6% — но отдача мизерная: дебит жидкости всего 0,4–0,5 м³/сут.",
        seal: {
          code: "open", label: "Объект сменён · оценка невозможна", entries: "1 заход",
          date: "18.07.2026", zone: "Центральная", qobv: "1,42 т/сут · 18,6%",
          note: "По АКЦ сплошной контакт всего 6,25% ствола: изоляция перфорации не перекрывала путь воды за колонной. В сентябре скважину перевели на горизонт T1-II — результат захода по J1-IV оценить уже нельзя."
        }
      }
    ],

    /* Заходы вне суточного мониторинга: скважина обработана, но в фонд из шести
       не входит — своих режимных листов по ней пока нет. Идёт в таблицу
       на странице герметичности, в ленту фонда не попадает. */
    extra: [
      {
        id: "357", href: "sealing.html", title: "Скважина 357",
        status: { code: "krs", label: "КРС · разбурка, далее ПВР", detail: "с 24.09" },
        seal: {
          code: "tested", label: "Герметично по опрессовке", entries: "1 заход",
          date: "24.09.2026", zone: "уточняется",
          qobv: "добычи пока нет",
          note: "ЦПД в трёх интервалах 657–663, 669,5–672 и 679–684 м, 3 т ультратонкого состава. 25.09 мост разбурен и каждый интервал опрессован — все три держат (30–40 атм, 15 мин). Изоляция подтверждена прямым испытанием, а не косвенно. Дальше ГИС и перфорация; промысловый эффект будет виден после запуска."
        }
      }
    ]
  };

  var STATUS_ORDER = { work: 0, stop: 1, krs: 2 };

  DATA.get = function (id) {
    for (var i = 0; i < DATA.wells.length; i++) if (DATA.wells[i].id === id) return DATA.wells[i];
    return null;
  };

  window.WELLS = DATA;

  /* ── Лента фонда: рендерится в #fundStrip на любой странице ────────────── */
  var CSS = '' +
    '.wf-strip{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:var(--border,#D8D8D8);border:1px solid var(--border,#D8D8D8)}' +
    '.wf-card{background:var(--bg,#fff);padding:16px 18px;display:block;text-decoration:none;color:inherit;transition:background .15s}' +
    '.wf-card:hover{background:var(--bg-2,#F8F8F8)}' +
    '.wf-card.is-current{background:var(--surface,#F4F4F4)}' +
    '.wf-top{display:flex;align-items:center;justify-content:space-between;gap:8px}' +
    '.wf-num{font-family:Oswald,sans-serif;font-size:20px;font-weight:600;letter-spacing:1px}' +
    '.wf-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}' +
    '.wf-dot.work{background:#16A34A}.wf-dot.stop{background:#EF4444}.wf-dot.krs{background:#AAAAAA}' +
    '.wf-status{font-family:Inter,sans-serif;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;color:#777;margin-top:7px}' +
    '.wf-val{font-family:Inter,sans-serif;font-size:12.5px;margin-top:9px;color:#2A2A2A}' +
    '.wf-val b{font-weight:600}' +
    '.wf-sub{font-family:Inter,sans-serif;font-size:10.5px;color:#AAAAAA;margin-top:3px;letter-spacing:.5px}' +
    '@media(max-width:1100px){.wf-strip{grid-template-columns:repeat(3,1fr)}}' +
    '@media(max-width:640px){.wf-strip{grid-template-columns:repeat(2,1fr)}}';

  function renderStrip(host) {
    var current = document.body.getAttribute('data-well-id') || '';
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    host.className = 'wf-strip';
    host.innerHTML = DATA.wells.slice().sort(function (a, b) {
      return (STATUS_ORDER[a.status.code] - STATUS_ORDER[b.status.code]) || (a.id > b.id ? 1 : -1);
    }).map(function (w) {
      var cur = w.id === current;
      var val = w.last.qn === '—'
        ? '<div class="wf-val">Добычи нет</div><div class="wf-sub">' + w.status.detail + '</div>'
        : '<div class="wf-val"><b>' + w.last.qn + '</b> т/сут · обв. <b>' + w.last.obv + '%</b></div>' +
          '<div class="wf-sub"><span>замер</span> ' + w.last.date + ' · <span>Qж</span> ' +
          w.last.qzh + ' <span>м³/сут</span></div>';
      return '<a class="wf-card' + (cur ? ' is-current' : '') + '" href="' + w.href + '">' +
        '<div class="wf-top"><span class="wf-num">' + w.id + '</span><span class="wf-dot ' + w.status.code + '"></span></div>' +
        '<div class="wf-status">' + w.status.label + '</div>' + val + '</a>';
    }).join('');
  }

  function start() {
    var host = document.getElementById('fundStrip');
    if (host) renderStrip(host);
    var stamp = document.querySelectorAll('[data-wells-updated]');
    for (var i = 0; i < stamp.length; i++) stamp[i].textContent = DATA.updated;
    document.dispatchEvent(new CustomEvent('wells:ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
