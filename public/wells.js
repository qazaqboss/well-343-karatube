/* Единый источник данных по фонду. Меняем здесь — обновляется на всех страницах.
   Обновлено: 30.09.2026 (суточные режимные листы). */
(function () {
  "use strict";

  var DATA = {
    updated: "30.09.2026",
    wells: [
      {
        id: "343", href: "well-343.html", title: "Скважина 343",
        status: { code: "work", label: "В работе", detail: "150 об/мин" },
        last: { date: "30.09", qn: "10,64", obv: "48,2", qzh: "23,5" },
        stats: [
          ["Qн средн. за сентябрь", "9,98 т/сут"],
          ["Диапазон Qн", "9,01 – 10,71"],
          ["Обводнённость", "45,0 → 48,2%"],
          ["Рабочих суток", "30 из 30"]
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
        last: { date: "30.09", qn: "7,85", obv: "37,2", qzh: "14,3" },
        stats: [
          ["Qн средн. за сентябрь", "7,44 т/сут"],
          ["Максимум (25.09)", "7,87 т/сут"],
          ["Обводнённость", "39,0 → 37,2%"],
          ["Рабочих суток", "30 из 30"]
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
        last: { date: "30.09", qn: "11,48", obv: "31,6", qzh: "19,2" },
        stats: [
          ["Qн средн. за сентябрь", "10,24 т/сут"],
          ["Максимум (30.09)", "11,48 т/сут"],
          ["Обводнённость средн.", "37,4%"],
          ["Рабочих суток", "30 из 30"]
        ],
        note: "Лучшая скважина фонда по итогам месяца. 29.09 обводнённость ушла с 37,1 до 31,6%, дебит поднялся до 11,48 т/сут при почти неизменном отборе жидкости — вода уходит, а не разбавляется.",
        seal: {
          code: "first", label: "Герметично с 1-го", entries: "1 заход",
          date: "06.06.2026", zone: "Юго-западный центр", qobv: "11,7 т/сут · 39%",
          note: "Стоит на границе с водоактивным поясом, но интервал закрылся сразу."
        }
      },
      {
        id: "311", href: "well-311.html", title: "Скважина 311",
        status: { code: "work", label: "В работе · срыв", detail: "100 об/мин · вода вернулась" },
        last: { date: "30.09", qn: "2,25", obv: "88,0", qzh: "21,5" },
        stats: [
          ["Qн средн. за сентябрь", "5,95 т/сут"],
          ["Максимум (14.09)", "6,65 т/сут"],
          ["Обводнённость", "59,6 → 88,0%"],
          ["Рабочих суток", "30 из 30"]
        ],
        note: "Три недели ровной работы и срыв в конце месяца: 28.09 обводнённость за сутки ушла с 60,1 до 86%, к 30.09 — 88%. Это доремонтный уровень, эффект изоляции утрачен. Дебит упал с 6,31 до 2,25 т/сут, 30.09 обороты снижены 110 → 100.",
        seal: {
          code: "lost", label: "Эффект утрачен на третьем месяце", entries: "1 заход",
          date: "09.07.2026", zone: "Юго-западный край", qobv: "2,25 т/сут · 88,0% (30.09)",
          note: "После вывода на режим обводнённость упала с 90,5% до 49%, держалась около 60% полтора месяца, а 28.09 за сутки вернулась к 86–88% — доремонтному уровню. Сплошной контакт заколонного цемента всего 30,4%: изоляция перфорации закрылась, но вода нашла путь мимо неё."
        }
      },
      {
        id: "303", href: "well-303.html", title: "Скважина 303",
        status: { code: "work", label: "В работе · откат", detail: "обводнённость 88,7%" },
        last: { date: "30.09", qn: "1,37", obv: "88,7", qzh: "13,9" },
        stats: [
          ["Qн средн. за сентябрь", "1,79 т/сут"],
          ["Максимум (28.09)", "3,06 т/сут"],
          ["Обводнённость", "95 → 65 → 88,7%"],
          ["Рабочих суток", "19 из 30"]
        ],
        note: "ТРС 09–10.09, запуск 11.09. За две недели вывода обводнённость упала с 95% до 65%, дебит дошёл до 3,06 т/сут — рекорда скважины. Но 29.09 замер показал откат к 88,7%: достигнутый уровень не удержался и месяца.",
        seal: {
          code: "wait", label: "Откат на выводе — нужен октябрь", entries: "1 заход",
          date: "13.07.2026", zone: "Восточная", qobv: "1,37 т/сут · 88,7% (30.09)",
          note: "Самый «сухой» вход в ядре залежи. После ТРС скважина вышла на рекордный для себя дебит 3,06 т/сут, но к концу сентября обводнённость вернулась к 88,7%. Устойчивость эффекта под вопросом — нужен октябрь."
        }
      },
      {
        id: "305", href: "well-305.html", title: "Скважина 305",
        status: { code: "work", label: "В работе с 08.09", detail: "60 об/мин · горизонт T1-II" },
        last: { date: "30.09", qn: "1,39", obv: "16,2", qzh: "1,9" },
        stats: [
          ["Qн средн. за сентябрь", "0,99 т/сут"],
          ["Максимум (21.09)", "2,11 т/сут"],
          ["Обводнённость", "100 → 16,2%"],
          ["Рабочих суток", "22 из 30"]
        ],
        note: "ГРП 05–07.09 и перевод на вышележащий горизонт T1-II (744–754 м), запуск 08.09. Вода ушла до 18,6% — но отдача мизерная: дебит жидкости всего 0,4–0,5 м³/сут.",
        seal: {
          code: "open", label: "Объект сменён · оценка невозможна", entries: "1 заход",
          date: "18.07.2026", zone: "Центральная", qobv: "1,39 т/сут · 16,2%",
          note: "По АКЦ сплошной контакт всего 6,25% ствола: изоляция перфорации не перекрывала путь воды за колонной. В сентябре скважину перевели на горизонт T1-II — результат захода по J1-IV оценить уже нельзя."
        }
      },
      {
        id: "357", href: "well-357.html", title: "Скважина 357",
        status: { code: "krs", label: "Вывод на режим", detail: "насос спущен 29.09" },
        last: { date: "30.09", qn: "—", obv: "—", qzh: "—" },
        stats: [
          ["База до изоляции", "1,50 т/сут"],
          ["Обводнённость до", "80,6%"],
          ["Опрессовка", "3 из 3 держат"],
          ["Дней простоя", "97 с 26.06"]
        ],
        note: "До остановки работала на воде: 1,50 т/сут при обводнённости 80,6%. ЦПД 24.09 в трёх интервалах, опрессовка 25.09 — герметичны все три. 29.09 спущен насос NTZ 350*090DT33 на 638,6 м, 30.09 начат вывод на режим. Первые замеры — в октябре.",
        seal: {
          code: "tested", label: "Герметично по опрессовке", entries: "1 заход",
          date: "24.09.2026", zone: "уточняется", qobv: "база 1,50 т/сут · 80,6%",
          note: "ЦПД в трёх интервалах 657–663, 669,5–672 и 679–684 м, 3 т ультратонкого состава. 25.09 мост разбурен и каждый интервал опрессован — все три держат (30–40 атм, 15 мин). Изоляция подтверждена прямым испытанием, а не косвенно. База для оценки эффекта известна точно: 1,50 т/сут при 80,6% воды за десять суток до остановки."
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
    '.wf-strip{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--border,#D8D8D8);border:1px solid var(--border,#D8D8D8)}' +
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
    '@media(max-width:1500px){.wf-strip{grid-template-columns:repeat(4,1fr)}}' +
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
