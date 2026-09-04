/* Единый источник данных по фонду. Меняем здесь — обновляется на всех страницах.
   Обновлено: 30.08.2026 (суточные режимные листы). */
(function () {
  "use strict";

  var DATA = {
    updated: "30.08.2026",
    wells: [
      {
        id: "343", href: "index.html", title: "Скважина 343",
        status: { code: "work", label: "В работе", detail: "160 об/мин" },
        last: { date: "30.08", qn: "10,48", obv: "45,0", qzh: "21,8" },
        aug: [
          ["Qн средн. за август", "12,4 т/сут"],
          ["Диапазон Qн", "10,48 – 13,74"],
          ["Обводнённость", "36,1 → 45,0%"],
          ["Рабочих суток", "30 из 30"]
        ],
        note: "Опорная скважина программы. Эффект РИР держится седьмой месяц, но с 16.08 обводнённость превысила контрольные 40% и к концу месяца дошла до 45% — вода возвращается снизу.",
        seal: {
          code: "first", label: "Герметично с 1-го", entries: "1 заход",
          date: "январь 2026", zone: "Западно-центральная", qobv: "15,7 т/сут · 36%",
          note: "Опорный кейс: обводнённость с 89,4% до 27,5% на пике, эффект держится седьмой месяц."
        }
      },
      {
        id: "342", href: "well-342.html", title: "Скважина 342",
        status: { code: "work", label: "После ТРС", detail: "150 об/мин" },
        last: { date: "30.08", qn: "7,14", obv: "39,0", qzh: "13,4" },
        aug: [
          ["Qн средн. за август", "7,45 т/сут"],
          ["Максимум (27.08)", "10,36 т/сут"],
          ["Обводнённость", "26,6 → 41,0%"],
          ["Рабочих суток", "28 из 30"]
        ],
        note: "ТРС 12–14.08 с полной заменой подвески. После вывода на режим и подъёма оборотов до 150 об/мин вышла выше доремонтного уровня; изоляция от майского РИР удерживает воду.",
        seal: {
          code: "second", label: "Герметично со 2-го", entries: "2 захода",
          date: "10.05 → 31.05.2026", zone: "Северо-восточная", qobv: "7,4 т/сут · 28%",
          note: "Северо-восточный фланг: вода активнее, первого захода не хватило."
        }
      },
      {
        id: "301", href: "well-301.html", title: "Скважина 301",
        status: { code: "work", label: "В работе", detail: "140 об/мин" },
        last: { date: "30.08", qn: "10,52", obv: "37,0", qzh: "19,1" },
        aug: [
          ["Qн средн. за август", "11,06 т/сут"],
          ["Максимум (14.08)", "11,82 т/сут"],
          ["Обводнённость средн.", "37,9%"],
          ["Рабочих суток", "30 из 30"]
        ],
        note: "Самый ровный месяц в фонде: без остановок, обводнённость в коридоре 36–40%. Подъём оборотов 120 → 140 дал прирост нефти без прироста воды.",
        seal: {
          code: "first", label: "Герметично с 1-го", entries: "1 заход",
          date: "06.06.2026", zone: "Юго-западный центр", qobv: "11,7 т/сут · 39%",
          note: "Стоит на границе с водоактивным поясом, но интервал закрылся сразу."
        }
      },
      {
        id: "311", href: "well-311.html", title: "Скважина 311",
        status: { code: "work", label: "В работе с 12.08", detail: "80 об/мин · после ОТРС" },
        last: { date: "30.08", qn: "4,77", obv: "56,0", qzh: "12,4" },
        aug: [
          ["Qн средн. за август", "5,31 т/сут"],
          ["Максимум (19.08)", "8,78 т/сут"],
          ["Обводнённость", "98,5 → 49,0 → 56,0%"],
          ["Рабочих суток", "25 из 30"]
        ],
        note: "ОТРС 07–11.08, с 12.08 в работе. После отработки пусковой воды обводнённость опустилась с 90,5% (до РИР) до 49%, дебит вырос втрое — эффект изоляции подтверждён по факту работы.",
        seal: {
          code: "confirmed", label: "Эффект подтверждён после освоения", entries: "1 заход",
          date: "09.07.2026", zone: "Юго-западный край", qobv: "8,78 т/сут · 49% (19.08)",
          note: "На 03.08 числилась в освоении при ~95% воды. После ОТРС и вывода на режим с 12.08 обводнённость снизилась до 49–56% — изоляция работает, хотя фон заколонного цемента остаётся плохим."
        }
      },
      {
        id: "303", href: "well-303.html", title: "Скважина 303",
        status: { code: "stop", label: "Остановлена · ОТРС", detail: "с 29.08" },
        last: { date: "27.08", qn: "0,33", obv: "78,0", qzh: "1,7" },
        aug: [
          ["Qн средн. за август", "0,77 т/сут"],
          ["Максимум (19.08)", "1,43 т/сут"],
          ["Обводнённость", "11 – 100%"],
          ["Рабочих суток", "28 из 30"]
        ],
        note: "ТРС 21–23.08, после запуска — отработка технической воды. С 28.08 выхода жидкости нет: опрессовка показала негерметичность подземного оборудования, 29.08 скважина остановлена и выведена в ОТРС.",
        seal: {
          code: "first", label: "Герметично с 1-го", entries: "1 заход",
          date: "13.07.2026", zone: "Восточная", qobv: "1,4 т/сут · 33%",
          note: "Самый «сухой» вход в ядре залежи. Текущая остановка — по механике подземного оборудования, к герметичности интервала отношения не имеет."
        }
      },
      {
        id: "305", href: "well-305.html", title: "Скважина 305",
        status: { code: "krs", label: "В ремонте · КРС", detail: "весь август" },
        last: { date: "—", qn: "—", obv: "—", qzh: "—" },
        aug: [
          ["Добыча за август", "нет"],
          ["Статус", "ремонт весь месяц"],
          ["ЦПД", "выполнена в июле"],
          ["Рабочих суток", "0 из 30"]
        ],
        note: "Весь август в ремонте: до 13.08 — ожидание, с 14.08 — работы бригады. Запуск и оценка эффекта ЦПД переносятся на сентябрь.",
        seal: {
          code: "open", label: "Оценка не завершена · в ремонте", entries: "1 заход",
          date: "18.07.2026", zone: "Центральная", qobv: "добычи нет",
          note: "По АКЦ сплошной контакт всего 6,25% ствола: изоляция перфорации не перекрывает путь воды за колонной. Результат захода будет виден после запуска."
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
          '<div class="wf-sub">замер ' + w.last.date + ' · Qж ' + w.last.qzh + ' м³/сут</div>';
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
