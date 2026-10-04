# -*- coding: utf-8 -*-
"""Тело страницы «Обводнённость фонда»."""
import io

PUB = "/Users/damirsultan/Desktop/Wibecoding/nanocem.app/public/"
head = io.open('/tmp/wc_head2.html', encoding='utf-8').read()

BODY = '''
<!-- HERO -->
<section class="hero">
  <div class="hero-inner">
    <div>
      <div class="hero-eyebrow">Аналитика фонда · Девять месяцев замеров</div>
      <h1 class="hero-title">ОБВОДНЁННОСТЬ ФОНДА —<br>ОБЩАЯ КАРТИНА</h1>
      <div class="hero-lead">Семьдесят скважин месторождения, январь — сентябрь 2026. Здесь фонд
      виден целиком: сколько скважин в каком диапазоне обводнённости, как показатель ведёт себя
      по горизонтам и где на этом фоне стоят семь скважин с заходами NanoCem UT-9.</div>
      <div class="hero-meta">
        <div class="hero-meta-item">СКВАЖИН <span id="mWells">—</span></div>
        <div class="hero-meta-sep">·</div>
        <div class="hero-meta-item">ОБВОДНЁННОСТЬ ФОНДА <span id="mWc">—</span></div>
        <div class="hero-meta-sep">·</div>
        <div class="hero-meta-item">ЗАХОДОВ UT-9 <span id="mUt9">—</span></div>
        <div class="hero-meta-sep">·</div>
        <div class="hero-meta-item">ДАННЫЕ НА <span>27.09.2026</span></div>
      </div>
    </div>
    <div class="side-box">
      <div class="side-title">Как считается</div>
      <div class="side-text">Обводнённость фонда — это отношение суммарной добычи воды к суммарной
      добыче жидкости, а не среднее по скважинам. Среднее завысило бы вклад малодебитных скважин:
      скважина с 0,4 м³/сут и скважина с 30 м³/сут весили бы одинаково.</div>
      <div class="side-text">Замеры — фактический режим из суточных режимных листов на последнюю
      дату каждого месяца. Скважины в ремонте в расчёт не входят.</div>
    </div>
  </div>
</section>

<!-- KPI -->
<div class="kpi-row" id="kpis"></div>

<!-- ДИНАМИКА -->
<section class="section">
  <div class="section-head">
    <div>
      <div class="section-title">Динамика за девять месяцев</div>
      <div class="section-sub">Обводнённость по фонду в целом и отдельно по скважинам, где выполнены
      заходы UT-9. Точка месяца — последний замер месяца.</div>
    </div>
  </div>
</section>
<div class="wc-chart">
  <div class="wc-legend">
    <div class="wc-leg"><span class="wc-dot" style="background:#111"></span>Весь фонд</div>
    <div class="wc-leg"><span class="wc-dot" style="background:#16A34A"></span>Скважины с заходами UT-9</div>
    <div class="wc-leg"><span class="wc-dot" style="background:#C4C4C4"></span>Фонд без наших скважин</div>
  </div>
  <div class="wc-wrap"><canvas id="wcChart"></canvas></div>
</div>

<!-- РАСПРЕДЕЛЕНИЕ -->
<section class="section">
  <div class="section-head">
    <div>
      <div class="section-title">Распределение по диапазонам</div>
      <div class="section-sub">Сколько скважин в каждом диапазоне обводнённости на 27.09.2026.
      Чёрным отмечены наши — видно, в какую часть фонда они попали после изоляции.</div>
    </div>
  </div>
  <div class="dist" id="dist"></div>
</section>

<!-- ГОРИЗОНТЫ -->
<section class="section">
  <div class="section-head">
    <div>
      <div class="section-title">По горизонтам</div>
      <div class="section-sub">Обводнённость считается по каждому горизонту отдельно: сумма воды
      к сумме жидкости внутри группы.</div>
    </div>
  </div>
  <div class="hz" id="hz"></div>
</section>

<!-- НАШИ ЗАХОДЫ -->
<section class="section">
  <div class="section-head">
    <div>
      <div class="section-title">Наши заходы: до и после</div>
      <div class="section-sub">Четыре скважины, по которым обводнённость до работ задокументирована
      замерами. По 301 дореремонтного замера в сопоставимом режиме нет, 305 переведена на другой
      горизонт, 357 ещё не запущена — их в сравнение не берём.</div>
    </div>
  </div>
  <div class="ba">
    <div class="ba-col">
      <div class="ba-w">343</div>
      <div class="ba-line"><span class="ba-from">89,4%</span><span class="ba-arr">→</span><span class="ba-to">48,1%</span></div>
      <div class="ba-note">Изоляция в январе 2026. Минимум 27,5% на пике эффекта, восьмой месяц работы.</div>
    </div>
    <div class="ba-col">
      <div class="ba-w">342</div>
      <div class="ba-line"><span class="ba-from">91,0%</span><span class="ba-arr">→</span><span class="ba-to">37,1%</span></div>
      <div class="ba-note">Потребовалось два захода: 10.05 и 31.05. Сейчас — минимум с момента изоляции.</div>
    </div>
    <div class="ba-col">
      <div class="ba-w">311</div>
      <div class="ba-line"><span class="ba-from">90,5%</span><span class="ba-arr">→</span><span class="ba-to">60,1%</span></div>
      <div class="ba-note">После освоения доходила до 49%, затем откатилась к 60% — мешает плохой заколонный цемент.</div>
    </div>
    <div class="ba-col">
      <div class="ba-w">303</div>
      <div class="ba-line"><span class="ba-from">95,0%</span><span class="ba-arr">→</span><span class="ba-to">65,4%</span></div>
      <div class="ba-note">Отсчёт от первых суток после запуска 11.09. Вывод на режим продолжается.</div>
    </div>
  </div>
</section>

<!-- ВЫВОДЫ -->
<section class="section">
  <div class="section-head">
    <div>
      <div class="section-title">Что из этого следует</div>
      <div class="section-sub">Три наблюдения, которые видны только на фоне всего фонда.</div>
    </div>
  </div>
  <div class="cards">
    <div class="card">
      <div class="card-idx">Наблюдение 01</div>
      <div class="card-title">Фонд стоит на месте</div>
      <div class="card-text" id="obs1">—</div>
    </div>
    <div class="card">
      <div class="card-idx">Наблюдение 02</div>
      <div class="card-title">Фонд расслоён, а не однороден</div>
      <div class="card-text" id="obs2">—</div>
    </div>
    <div class="card">
      <div class="card-idx">Наблюдение 03</div>
      <div class="card-title">Срез не доказывает эффект</div>
      <div class="card-text">Сравнение «наши против остальных» на один день мало что значит:
      скважины изначально разные. Доказательство даёт только движение каждой скважины
      относительно самой себя — блок «до и после» выше. Срез нужен для другого: чтобы видеть,
      куда скважина попала после работ и остались ли в фонде кандидаты с тем же профилем.</div>
    </div>
  </div>
</section>

<!-- ТАБЛИЦА ФОНДА -->
<section class="section">
  <div class="section-head">
    <div>
      <div class="section-title">Весь фонд</div>
      <div class="section-sub">Сортировка по обводнённости, от высокой к низкой. Мини-график —
      обводнённость скважины по месяцам, январь слева. Наши скважины выделены фоном.</div>
    </div>
  </div>
  <div class="tf-top">
    <div class="tf-filters" id="tfFilters"></div>
    <div class="tf-count" id="tfCount"></div>
  </div>
  <div class="tf-wrap">
    <table class="tf">
      <thead><tr>
        <th>Скважина</th><th>Горизонт</th><th>Участок</th>
        <th class="num">Обв., %</th><th class="num">Qн, т/сут</th><th class="num">Qж, м³/сут</th>
        <th>Динамика с января</th>
      </tr></thead>
      <tbody id="tfBody"></tbody>
    </table>
  </div>
</section>

<div class="caveat">
  <b>Оговорка.</b> Данные — фактический режим из суточных режимных листов на последнюю дату каждого
  месяца, по одной точке на месяц. Это снимок, а не среднемесячное значение: разовый замер может
  отличаться от режима. Скважины без замера (ремонт, ожидание бригады) в расчёт обводнённости не
  входят, поэтому число скважин по месяцам разное — оно указано в подписи к каждой точке графика.
  Обводнённость групп считается по сумме потоков, среднее арифметическое по скважинам дало бы
  другую цифру и приведено отдельно в таблице выше.
</div>

<footer class="footer">
  <div>Аналитика обводнённости фонда · данные на 27.09.2026 · <a href="index.html" style="border-bottom:1px solid var(--grey-muted)">Фонд скважин</a> · <a href="sealing.html" style="border-bottom:1px solid var(--grey-muted)">Герметичность</a> · <a href="plan.html" style="border-bottom:1px solid var(--grey-muted)">Программа UT-9</a></div>
  <div class="footer-right">ТОО «ЭкоМикс» · EASYMIX</div>
</footer>
'''

JS = '''
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="field.js?v=20261004a"></script>
<script>
function toggleNav(){document.getElementById('navMobile').classList.toggle('open');document.getElementById('navToggle').classList.toggle('active');}
function closeNav(){document.getElementById('navMobile').classList.remove('open');document.getElementById('navToggle').classList.remove('active');}

(function(){
  var F = window.FIELD, S = F.series, last = S[S.length - 1], first = S[0];
  var meas = F.wells.filter(function(w){ return w.obv !== null; });
  var ours = meas.filter(function(w){ return w.ut9; });
  var fmt = function(v, d){ return (v === null || v === undefined) ? '—' : v.toFixed(d === undefined ? 1 : d).replace('.', ','); };

  /* ── шапка ─────────────────────────────────────────────────────────────── */
  document.getElementById('mWells').textContent = F.wells.length;
  document.getElementById('mWc').textContent = fmt(last.wc) + '%';
  document.getElementById('mUt9').textContent = F.ut9.length;

  /* ── KPI ───────────────────────────────────────────────────────────────── */
  var sorted = meas.map(function(w){ return w.obv; }).sort(function(a, b){ return a - b; });
  var median = sorted[Math.floor(sorted.length / 2)];
  var delta = last.wc - first.wc;
  var kpi = [
    ['Обводнённость фонда', fmt(last.wc) + '%', 'сумма воды к сумме жидкости', ''],
    ['Медиана по скважинам', fmt(median) + '%', 'половина фонда выше, половина ниже', ''],
    ['С начала года', (delta >= 0 ? '+' : '−') + fmt(Math.abs(delta)) + ' п.п.', fmt(first.wc) + '% в январе → ' + fmt(last.wc) + '% в сентябре', delta > 0 ? 'red' : ''],
    ['Добыча нефти', fmt(last.qn, 0) + ' т/сут', 'по ' + last.wells + ' скважинам с замером', '']
  ];
  document.getElementById('kpis').innerHTML = kpi.map(function(k){
    return '<div class="kpi"><div class="kpi-label">' + k[0] + '</div>' +
           '<div class="kpi-value' + (k[3] ? ' ' + k[3] : '') + '">' + k[1] + '</div>' +
           '<div class="kpi-unit">' + k[2] + '</div></div>';
  }).join('');

  /* ── распределение ─────────────────────────────────────────────────────── */
  var BINS = [[0, 20, 'до 20%'], [20, 40, '20–40%'], [40, 60, '40–60%'], [60, 80, '60–80%'], [80, 101, 'от 80%']];
  var maxN = 0;
  var bins = BINS.map(function(b){
    var g = meas.filter(function(w){ return w.obv >= b[0] && w.obv < b[1]; });
    maxN = Math.max(maxN, g.length);
    return { label: b[2], n: g.length, ours: g.filter(function(w){ return w.ut9; }).map(function(w){ return w.w; }) };
  });
  document.getElementById('dist').innerHTML = bins.map(function(b){
    return '<div class="dist-col"><div class="dist-range">' + b.label + '</div>' +
      '<div class="dist-n">' + b.n + '</div>' +
      '<div class="dist-sub">' + (b.n === 1 ? 'скважина' : (b.n >= 2 && b.n <= 4 ? 'скважины' : 'скважин')) +
      ' · ' + Math.round(b.n / meas.length * 100) + '% фонда</div>' +
      '<div class="dist-bar"><i style="width:' + (b.n / maxN * 100) + '%"></i></div>' +
      '<div class="dist-ours">' + b.ours.map(function(w){ return '<span class="dist-chip">' + w + '</span>'; }).join('') + '</div></div>';
  }).join('');

  /* ── горизонты ─────────────────────────────────────────────────────────── */
  var hz = {};
  meas.forEach(function(w){
    var k = (w.gor || '—').trim();
    hz[k] = hz[k] || { qv: 0, qzh: 0, n: 0 };
    hz[k].qv += w.qv || 0; hz[k].qzh += w.qzh || 0; hz[k].n++;
  });
  var hzArr = Object.keys(hz).map(function(k){
    return { name: k, n: hz[k].n, wc: hz[k].qzh ? hz[k].qv / hz[k].qzh * 100 : 0 };
  }).sort(function(a, b){ return b.n - a.n; });
  document.getElementById('hz').innerHTML = hzArr.map(function(h){
    return '<div class="hz-row"><div class="hz-name">' + h.name + '</div>' +
      '<div class="hz-track"><div class="hz-fill" style="width:' + h.wc.toFixed(0) + '%"></div></div>' +
      '<div class="hz-val">' + fmt(h.wc) + '%</div>' +
      '<div class="hz-n">' + h.n + ' скв.</div></div>';
  }).join('');

  /* ── наблюдения ────────────────────────────────────────────────────────── */
  var lo = bins[0].n + bins[1].n, hi = bins[3].n + bins[4].n;
  document.getElementById('obs1').textContent =
    'За девять месяцев обводнённость фонда прошла путь ' + fmt(first.wc) + '% → ' + fmt(last.wc) +
    '%, то есть изменилась на ' + fmt(Math.abs(delta)) + ' пункта. Добыча нефти при этом ' +
    (last.qn >= first.qn ? 'выросла' : 'снизилась') + ' с ' + fmt(first.qn, 0) + ' до ' + fmt(last.qn, 0) +
    ' т/сут. Фонд в целом держится, но сам по себе не улучшается — значит, прирост может дать только адресная работа по скважинам.';
  document.getElementById('obs2').textContent =
    'В диапазоне до 40% воды — ' + lo + ' скважин, выше 60% — ' + hi + '. Это две разные группы с разной экономикой: ' +
    'первая даёт нефть, вторая гоняет воду. Кандидаты на изоляцию — во второй, и их в фонде ' + hi + '.';

  /* ── график ────────────────────────────────────────────────────────────── */
  Chart.defaults.color = '#AAAAAA';
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 11;
  new Chart(document.getElementById('wcChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: F.monthsLabels,
      datasets: [
        { label: 'Весь фонд', data: S.map(function(x){ return x.wc; }), borderColor: '#111111',
          backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointHoverRadius: 5, tension: 0.25 },
        { label: 'С заходами UT-9', data: S.map(function(x){ return x.wcOurs; }), borderColor: '#16A34A',
          backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointHoverRadius: 5, tension: 0.25 },
        { label: 'Фонд без наших', data: S.map(function(x){ return x.wcRest; }), borderColor: '#C4C4C4',
          backgroundColor: 'transparent', borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
          tension: 0.25, borderDash: [5, 4] }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17,17,17,0.92)', titleColor: '#fff', bodyColor: '#ddd', padding: 11,
          callbacks: {
            title: function(c){ return S[c[0].dataIndex].full + ' · замер ' + S[c[0].dataIndex].date; },
            label: function(c){ return c.dataset.label + ': ' + c.parsed.y.toFixed(1).replace('.', ',') + '%'; },
            afterBody: function(c){
              var s = S[c[0].dataIndex];
              return 'Скважин с замером: ' + s.wells + ' (наших ' + s.ours + ')';
            }
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(0,0,0,0.05)', tickLength: 0 }, border: { color: 'rgba(0,0,0,0.12)' } },
        y: { min: 30, max: 70, grid: { color: 'rgba(0,0,0,0.05)' }, border: { color: 'transparent' },
             ticks: { stepSize: 5, callback: function(v){ return v + '%'; } } }
      }
    }
  });

  /* ── таблица ───────────────────────────────────────────────────────────── */
  function spark(series){
    var pts = series.map(function(v, i){ return [i, v]; }).filter(function(p){ return p[1] !== null; });
    if (pts.length < 2) return '<span class="tf-idle">—</span>';
    var n = series.length - 1, d = pts.map(function(p){
      return (p[0] / n * 62 + 1).toFixed(1) + ',' + (15 - (p[1] / 100 * 13)).toFixed(1);
    }).join(' L');
    return '<svg class="tf-mini" viewBox="0 0 64 16"><polyline points="" fill="none"/>' +
           '<path d="M' + d + '" fill="none" stroke="#111" stroke-width="1.2"/></svg>';
  }
  var FILTERS = [
    ['all', 'Весь фонд', function(){ return true; }],
    ['ut9', 'Наши заходы', function(w){ return w.ut9; }],
    ['hi', 'Выше 60%', function(w){ return w.obv !== null && w.obv >= 60; }],
    ['mid', '40–60%', function(w){ return w.obv !== null && w.obv >= 40 && w.obv < 60; }],
    ['lo', 'Ниже 40%', function(w){ return w.obv !== null && w.obv < 40; }],
    ['idle', 'Без замера', function(w){ return w.obv === null; }]
  ];
  document.getElementById('tfFilters').innerHTML = FILTERS.map(function(f, i){
    return '<button class="tf-btn' + (i === 0 ? ' on' : '') + '" data-f="' + f[0] + '">' + f[1] + '</button>';
  }).join('');

  function render(key){
    var f = FILTERS.filter(function(x){ return x[0] === key; })[0];
    var rows = F.wells.filter(f[2]);
    document.getElementById('tfBody').innerHTML = rows.map(function(w){
      return '<tr' + (w.ut9 ? ' class="ours"' : '') + '>' +
        '<td class="tf-well">' + w.w + (w.ut9 ? '<span class="tf-tag">UT-9</span>' : '') + '</td>' +
        '<td>' + (w.gor || '—') + '</td>' +
        '<td>' + (w.area === 'основной' ? 'Основной' : 'Западный склон') + '</td>' +
        '<td class="num">' + (w.obv === null ? '<span class="tf-idle">в ремонте</span>' : '<b>' + fmt(w.obv) + '</b>') + '</td>' +
        '<td class="num">' + fmt(w.qn, 2) + '</td>' +
        '<td class="num">' + fmt(w.qzh) + '</td>' +
        '<td>' + spark(w.series) + '</td></tr>';
    }).join('');
    document.getElementById('tfCount').textContent = 'Показано скважин: ' + rows.length + ' из ' + F.wells.length;
  }
  document.getElementById('tfFilters').addEventListener('click', function(e){
    var b = e.target.closest('.tf-btn'); if (!b) return;
    document.querySelectorAll('.tf-btn').forEach(function(x){ x.classList.remove('on'); });
    b.classList.add('on'); render(b.dataset.f);
  });
  render('all');
})();
</script>
<script src="i18n.js?v=20261004b" defer></script>
<script src="backend.js?v=20260910" defer></script>
</body>
</html>
'''

io.open(PUB + 'water-cut.html', 'w', encoding='utf-8').write(head + BODY + JS)
print('water-cut.html собрана')
