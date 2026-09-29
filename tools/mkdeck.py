# -*- coding: utf-8 -*-
"""Сборка презентаций NanoCem UT-9 (RU и EN) в HTML под печать в PDF."""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS  = io.open(os.path.join(ROOT, "tools/deck-base.css"), encoding="utf-8").read()
CSS_M = io.open(os.path.join(ROOT, "tools/deck-mobile.css"), encoding="utf-8").read()

# ─────────────────────────────────────────────────────────────────────────────
# Схема «обычный цемент против ультратонкого» — та же идея, что на сайте
# ─────────────────────────────────────────────────────────────────────────────
def grind_svg(t):
    return f'''<svg viewBox="0 0 560 210" width="100%">
  <text x="0" y="12" font-family="Inter" font-size="9.5" letter-spacing="2" fill="#AAAAAA">{t['g1']}</text>
  <rect x="0" y="24" width="560" height="62" fill="#F4F4F4" stroke="#D8D8D8"/>
  <path d="M0 55 L250 55 L286 41 L286 69 L250 55" fill="none" stroke="#C4C4C4" stroke-width="1.5"/>
  <circle cx="258" cy="48" r="9" fill="#777"/><circle cx="262" cy="63" r="8" fill="#777"/>
  <circle cx="246" cy="56" r="7" fill="#999"/>
  <rect x="290" y="30" width="266" height="50" fill="#fff" stroke="#EBEBEB" stroke-dasharray="3 3"/>
  <text x="300" y="59" font-family="Inter" font-size="10" fill="#AAAAAA">{t['g1s']}</text>

  <text x="0" y="122" font-family="Inter" font-size="9.5" letter-spacing="2" fill="#111">{t['g2']}</text>
  <rect x="0" y="134" width="560" height="62" fill="#F4F4F4" stroke="#D8D8D8"/>
  <path d="M0 165 L250 165 L286 151 L286 179 L250 165" fill="none" stroke="#C4C4C4" stroke-width="1.5"/>
  <rect x="250" y="140" width="306" height="50" fill="#111"/>
  <text x="300" y="169" font-family="Inter" font-size="10" font-weight="600" fill="#fff">{t['g2s']}</text>
</svg>'''

# ─────────────────────────────────────────────────────────────────────────────
# Кейс 343: база → пик → сейчас
# ─────────────────────────────────────────────────────────────────────────────
def case_svg(t):
    bars = [(t['c1'], 1.10, 89.4, "#C4C4C4"), (t['c2'], 16.40, 27.5, "#111111"),
            (t['c3'], 10.61, 48.1, "#16A34A")]
    H, Y0, W, GAP = 196, 250, 150, 46
    out = [f'<svg viewBox="0 0 620 336" width="100%">']
    for i, (lab, q, o, col) in enumerate(bars):
        x = i * (W + GAP)
        h = q / 16.40 * H
        out.append(f'<rect x="{x}" y="{Y0-h:.0f}" width="{W}" height="{h:.0f}" fill="{col}"/>')
        out.append(f'<text x="{x}" y="{Y0-h-12:.0f}" font-family="Oswald" font-size="30" '
                   f'font-weight="700" fill="#111">{("%.2f"%q).replace(".",",")}</text>')
        out.append(f'<text x="{x}" y="{Y0+20}" font-family="Inter" font-size="10.5" '
                   f'letter-spacing="1.5" fill="#777">{lab}</text>')
        # обводнённость в презентации не показываем — только дебит нефти
    out.append(f'<text x="0" y="{Y0+72}" font-family="Inter" font-size="10.5" fill="#AAAAAA">{t["cnote"]}</text>')
    out.append('</svg>')
    return "\n".join(out)

# ─────────────────────────────────────────────────────────────────────────────
# Тексты
# ─────────────────────────────────────────────────────────────────────────────
RU = dict(
 lang="ru", file="nanocem-ut9-presentation.pdf",
 title="NanoCem UT-9 — презентация продукта",
 foot_l="NanoCem UT-9 · ТУ 5745-001-171140033124-2025",
 foot_r="ТОО «ЭкоМикс» · EASYMIX · nanocem.app",
 g1="ОБЫЧНЫЙ ЦЕМЕНТ · 40–80 МКМ", g1s="частицы сводятся в перемычку у стенки",
 g2="NANOCEM UT-9 · D95 ≤ 9 МКМ",  g2s="твёрдая фаза проникает в интервал",
 c1="ДО ИЗОЛЯЦИИ · 28.01", c2="ПИК · 19.03", c3="СЕЙЧАС · 27.09",
 cnote="Дебит нефти, т/сут. Восьмой месяц после изоляции — эффект держится.",
 s=[
  # 1. Титул
  dict(kind="title", eyebrow="ТОО «ЭкоМикс» · EASYMIX · селективная изоляция пласта",
       h1='NANOCEM <span class="light">UT-9</span>',
       lead="Ультратонкая изоляционно-инъекционная смесь для селективной изоляции интервалов. "
            "Помол D95 ≤ 9 мкм — проникает в микротрещины и поры, недоступные обычному "
            "тампонажному цементу.",
       stats=[("Тонкость помола","D95 ≤ 9 мкм","D50 ~3,5 мкм"),
              ("Прочность 28 сут","65–75 МПа","марка М500"),
              ("Выполнено заходов","7 скважин","январь — сентябрь 2026"),
              ("Опорный результат","1,1 → 16,4","т/сут на скважине 343")]),
  # 3. Помол
  dict(kind="grind", kicker="Принцип", h2="Решает помол, а не давление закачки",
       lead="Изолирует не объём закачки, а твёрдая фаза, дошедшая до места.",
       note="Под давлением раствор фильтруется: жидкость затворения отжимается в пласт, "
            "а частицы движутся к каналам. Частица проходит в канал, если она примерно втрое "
            "мельче его раскрытия. Если крупнее — частицы сводятся в перемычку у стенки скважины, "
            "образуют наружную корку, и дальше идёт один фильтрат. Обычный тампонажный цемент "
            "с частицами 40–80 мкм упирается в этот предел на любом давлении.\n\n"
            "D50 ~3,5 мкм и D95 ≤ 9 мкм переводят задачу в другой диапазон: часть закачанной "
            "порции проникает в микротрещины и поровое пространство призабойной зоны, остальное "
            "формирует камень в перфорационных каналах. После ОЗЦ экран стоит внутри интервала, "
            "а не поверх него."),
  # 4. Характеристики
  dict(kind="spec", kicker="Технические характеристики", h2="Паспорт продукта",
       sub="ТУ 5745-001-171140033124-2025 · сухая смесь, порошок серого цвета · 25 кг / 1000 кг",
       rows=[("Тонкость помола D50 / D95","~3,5 мкм / ≤ 9 мкм"),
             ("Плотность сухого продукта","2,95 г/см³"),
             ("Плотность суспензии","1,85–1,95 г/см³"),
             ("Жизнеспособность раствора","4–5 часов"),
             ("Первичное твердение","~60 мин"),
             ("Полное твердение","24 часа при +25 °C"),
             ("Прочность через 24 часа","≥ 12 МПа"),
             ("Прочность через 28 суток","65–75 МПа · марка М500"),
             ("Адгезия к бетону","≥ 2,5 МПа"),
             ("Водонепроницаемость","W14–W16"),
             ("Толщина слоя","5–100 мм"),
             ("Химическая стойкость","нефть, солевые растворы, сульфаты"),
             ("Хранение","12 месяцев")]),
  # 5. Задачи
  dict(kind="text", kicker="Применение", h2="Что изолирует NanoCem UT-9",
       lead="Три направления, отработанные на действующем эксплуатационном фонде.",
       cols=[("Задача 01","Селективная изоляция интервалов","Отсечение отработавших интервалов "
              "перфорации. Нефтенасыщенная часть пласта остаётся работающей — скважина "
              "возвращается в добычу с более высоким дебитом."),
             ("Задача 02","Разобщение горизонтов","Герметизация каналов за обсадной колонной, "
              "связывающих выше- и нижележащие пласты. Ультратонкость позволяет заполнить "
              "узкие зазоры, недоступные обычному тампонажному цементу."),
             ("Задача 03","Ремонт цементного кольца","Заполнение трещин и микрозазоров в крепи, "
              "восстановление разобщения пластов. Адгезия от 2,5 МПа даёт сцепление "
              "с существующим камнем.")]),
  # 6. Технология
  dict(kind="tech", kicker="Технология", h2="Как это делается на скважине",
       sub="Отработанная схема ЦПД — на примере скважины 357, сентябрь 2026",
       steps=[("01","Подготовка","Остановка, ГИС, определение интервалов притока. Раствор "
               "затворяется при В/Ц около 0,87 — раствор намеренно подвижный, иначе твёрдая фаза не войдёт "
               "в каналы, ради которых его и берут."),
              ("02","Закачка в три ступени","Сначала порция при открытом затрубе — раствор "
               "расставляется по всем интервалам. Затем подъём НКТ и вторая порция. И только "
               "потом пакеровка и додавка в закрытую."),
              ("03","Контроль по давлению","На закрытой ступени давление растёт и останавливается: "
               "пласт перестал принимать. Это рабочий признак герметизации — пока каналы открыты, "
               "давление при постоянной подаче не растёт."),
              ("04","ОЗЦ под давлением","Скважина остаётся под давлением весь срок — цемент "
               "набирает прочность в сжатом состоянии, а не просто стоит в стволе."),
              ("05","Разбурка и опрессовка","Мост разбуривают и каждый интервал опрессовывают "
               "отдельно, по мере вскрытия. Так негерметичный интервал сразу локализуется."),
              ("06","Перфорация и запуск","ГИС, прострелочно-взрывные работы, вывод на режим. "
               "Эффект оценивается по динамике дебита нефти за две-три недели.")]),
  # 7. Фонд
  dict(kind="fund", kicker="Результаты на промысле", h2="Семь заходов на эксплуатационном фонде",
       sub="Терригенный коллектор, глубины 620–760 м · данные суточных режимных листов на 27.09.2026",
       head=("Скв.","Заходов","Итог изоляции","Дата","Результат"),
       rows=[("343","1","d-ok","Герметично с 1-го","янв 2026","1,10 → 16,40 т/сут на пике · ×9,6 к базе, восьмой месяц"),
             ("301","1","d-ok","Герметично с 1-го","06.06.2026","10,28 т/сут — ровный режим без остановок"),
             ("303","1","d-ok","Герметично с 1-го","13.07.2026","2,86 т/сут — рекорд скважины за всё время наблюдений"),
             ("342","2","d-mid","Герметично со 2-го","10.05 → 31.05","7,86 т/сут · ×13,3 к базе 0,59 т/сут"),
             ("311","1","d-mid","Подтверждено после освоения","09.07.2026","6,31 т/сут — дебит вырос втрое после вывода на режим"),
             ("357","1","d-ok","Герметично по опрессовке","24.09.2026","прямое испытание: 3 из 3 интервалов держат"),
             ("305","1","d-no","Оценить нельзя — объект сменён","18.07.2026","в сентябре переведена на вышележащий горизонт")]),
  # 8. Кейс 343
  dict(kind="case", kicker="Опорный кейс", h2="Скважина 343",
       lead="Изоляция в январе 2026. Дебит нефти вырос почти в пятнадцать раз — с 1,10 "
            "до 16,40 т/сут на пике. Эффект держится восьмой месяц.",
       stats=[("Накоплено после изоляции","≈3 033 т","за 235 суток работы"),
              ("Рост от базы","×9,6","1,10 → 10,61 т/сут"),
              ("Текущий режим","10,61 т/сут","на 27.09.2026"),
              ("Срок эффекта","8 месяцев","и продолжается")]),
  # 9. Честно
  dict(kind="text", kicker="Границы метода", h2="Честная граница применимости",
       lead="Изоляция перфорации даёт полный эффект только там, где цементное кольцо за "
            "колонной целое.",
       note="По заключениям ПГИ на двух краевых скважинах заколонный цементный камень "
            "некачественный: сплошной контакт всего 6,25% и 30,4% ствола. При таком контакте "
            "приток обходит изолированную перфорацию по каналам за колонной, и закрытие "
            "отверстий полной герметичности не даёт — прирост дебита получается частичным.",
       cols=[("Признак","Плохой заколонный цемент","Сплошной контакт менее трети ствола по АКЦ. "
              "До захода нужна оценка качества крепи, иначе результат будет частичным."),
             ("Признак","Краевое положение скважины","Центрально-восточное ядро залежи "
              "герметизируется с первого захода. На краях требуется второй заход или другая схема."),
             ("Что это меняет","Отбор кандидатов","Планировать заход нужно по положению скважины "
              "и состоянию колонны. Показатели режима сами по себе исход не предсказывают — "
              "нужна оценка крепи по АКЦ до начала работ.")]),
  # 10. Верификация
  dict(kind="verify", kicker="Верификация", h2="Герметичность можно проверить сразу",
       lead="На скважине 357 изоляцию подтвердили прямым испытанием — до запуска, не дожидаясь "
            "промысловой статистики.",
       rows=[("Цементный мост","40 атм · 15 мин","герметично"),
             ("Интервалы 657–663 и 669,5–672 м","30 атм","герметично"),
             ("Интервал 679–684 м","40 атм · 15 мин","герметично")],
       note="Опрессовку вели ступенями, по мере разбурки моста: каждый интервал проверяли сразу "
            "после вскрытия. При опрессовке всего ствола разом негерметичный интервал "
            "не локализуешь. Оговорка: испытание на 30–40 атм при давлении закачки 80 атм "
            "и отдельно от вопроса заколонного перетока."),
  # 11. Итог
  dict(kind="final", kicker="Итог", h2="Что мы предлагаем",
       lead="Цемент, отработанная технология закачки и прозрачная аналитика по каждому заходу.",
       cols=[("01","Цемент","Ультратонкая смесь собственного производства, ТУ 5745-001-171140033124-2025. "
              "Фасовка 25 кг и 1000 кг, срок хранения 12 месяцев."),
             ("02","Технология","Схема ЦПД в три ступени с контролем по давлению, опрессовкой "
              "каждого интервала и последующей реперфорацией."),
             ("03","Аналитика","Суточный мониторинг фонда, оценка эффекта по приросту дебита "
              "нефти, разбор отказов. Всё открыто на nanocem.app.")],
       cta="nanocem.app — фонд скважин, разбор герметичности и программа работ"),
 ])

EN = dict(
 lang="en", file="nanocem-ut9-presentation-en.pdf",
 title="NanoCem UT-9 — product presentation",
 foot_l="NanoCem UT-9 · TU 5745-001-171140033124-2025",
 foot_r="EcoMix LLP · EASYMIX · nanocem.app",
 g1="ORDINARY CEMENT · 40–80 µm", g1s="particles bridge at the wall",
 g2="NANOCEM UT-9 · D95 ≤ 9 µm",  g2s="the solid phase enters the interval",
 c1="BEFORE · 28.01", c2="PEAK · 19.03", c3="NOW · 27.09",
 cnote="Oil rate, t/day. Eighth month after the treatment — the effect is holding.",
 s=[
  dict(kind="title", eyebrow="EcoMix LLP · EASYMIX · selective zonal isolation",
       h1='NANOCEM <span class="light">UT-9</span>',
       lead="An ultra-fine injection grout for selective zonal isolation. A D95 of 9 µm or finer "
            "penetrates the microfractures and pores that ordinary oil-well cement cannot reach.",
       stats=[("Particle fineness","D95 ≤ 9 µm","D50 ~3.5 µm"),
              ("28-day strength","65–75 MPa","grade M500"),
              ("Treatments completed","7 wells","January — September 2026"),
              ("Reference result","1.1 → 16.4","t/day on well 343")]),
  dict(kind="grind", kicker="The principle", h2="Fineness decides it, not pump pressure",
       lead="What isolates the interval is the solid phase that reaches it, not the volume pumped.",
       note="Under squeeze pressure the slurry dehydrates: the mixing water is forced off into the "
            "formation while the particles travel towards the channels. A particle enters a channel "
            "only if it is roughly three times finer than the aperture. If it is coarser, the particles "
            "bridge at the borehole wall, build an external filter cake, and nothing but filtrate goes "
            "further. Ordinary oil-well cement at 40–80 µm runs into that limit at any pressure.\n\n"
            "A D50 of ~3.5 µm and a D95 of 9 µm or finer move the job into a different range: part of "
            "the pumped volume penetrates the microfractures and pore space of the near-wellbore zone, "
            "the rest builds set cement in the perforation channels. After WOC the barrier sits inside "
            "the interval, not on top of it."),
  dict(kind="spec", kicker="Technical data", h2="Product data sheet",
       sub="TU 5745-001-171140033124-2025 · dry blend, grey powder · 25 kg / 1000 kg",
       rows=[("Fineness D50 / D95","~3.5 µm / ≤ 9 µm"),
             ("Dry product density","2.95 g/cm³"),
             ("Slurry density","1.85–1.95 g/cm³"),
             ("Working life of the slurry","4–5 hours"),
             ("Initial set","~60 min"),
             ("Full set","24 hours at +25 °C"),
             ("Strength after 24 hours","≥ 12 MPa"),
             ("Strength after 28 days","65–75 MPa · grade M500"),
             ("Bond to concrete","≥ 2.5 MPa"),
             ("Water resistance","W14–W16"),
             ("Layer thickness","5–100 mm"),
             ("Chemical resistance","oil, brines, sulphates"),
             ("Shelf life","12 months")]),
  dict(kind="text", kicker="Applications", h2="What NanoCem UT-9 isolates",
       lead="Three uses proven on a producing well stock.",
       cols=[("Use 01","Selective interval isolation","Cutting off spent perforation intervals. "
              "The oil-bearing part of the reservoir keeps working — the well returns to "
              "production at a higher rate."),
             ("Use 02","Zonal separation","Sealing the channels behind the casing that connect "
              "horizons above and below. The ultra-fine grind fills narrow gaps that an ordinary "
              "oil-well cement cannot reach."),
             ("Use 03","Repairing the cement sheath","Filling cracks and micro-gaps in the sheath and "
              "restoring zonal isolation. A bond of 2.5 MPa or better grips the existing stone.")]),
  dict(kind="tech", kicker="Procedure", h2="How it is done at the well",
       sub="The established squeeze sequence — as run on well 357, September 2026",
       steps=[("01","Preparation","Shut in, log, identify the inflow intervals. The slurry is mixed at "
               "a W/C ratio of about 0.87 — deliberately mobile, or it will not enter the "
               "channels it is chosen for."),
              ("02","A three-stage squeeze","First a portion with the annulus open — the grout is "
               "distributed across all the intervals. Then the tubing is pulled and a second portion "
               "goes in. Only then is the packer set and the rest squeezed in closed."),
              ("03","Pressure as the control","On the closed-in stage the pressure builds and then stops: "
               "the formation has stopped taking. That is the working sign of a seal — while the channels "
               "are open, pressure does not build at a constant pump rate."),
              ("04","Waiting on cement under pressure","The well stays under pressure throughout — the "
               "cement gains strength under compression rather than simply standing in the hole."),
              ("05","Drill-out and pressure test","The bridge is drilled out and each interval is tested "
               "separately as it is opened, so a leaking interval is located immediately."),
              ("06","Perforation and start-up","Logging, perforation, ramp-up. The effect is judged from "
               "the oil-rate trend over two to three weeks.")]),
  dict(kind="fund", kicker="Field results", h2="Seven treatments on a producing well stock",
       sub="Clastic reservoir, 620–760 m · daily operating logs as of 27.09.2026",
       head=("Well","Entries","Isolation outcome","Date","Result"),
       rows=[("343","1","d-ok","Tight on the 1st","Jan 2026","1.10 → 16.40 t/day at the peak · ×9.6 over baseline, eighth month"),
             ("301","1","d-ok","Tight on the 1st","06.06.2026","10.28 t/day — a steady regime, no stoppages"),
             ("303","1","d-ok","Tight on the 1st","13.07.2026","2.86 t/day — the well's record over the whole record"),
             ("342","2","d-mid","Tight on the 2nd","10.05 → 31.05","7.86 t/day · ×13.3 over a baseline of 0.59 t/day"),
             ("311","1","d-mid","Confirmed after ramp-up","09.07.2026","6.31 t/day — the rate tripled after ramp-up"),
             ("357","1","d-ok","Tight on pressure test","24.09.2026","direct test: 3 of 3 intervals hold"),
             ("305","1","d-no","Cannot be assessed — target changed","18.07.2026","switched to a shallower horizon in September")]),
  dict(kind="case", kicker="Reference case", h2="Well 343",
       lead="Treated in January 2026. The oil rate rose almost fifteenfold — from 1.10 to "
            "16.40 t/day at the peak. The effect is holding into its eighth month.",
       stats=[("Produced since the job","≈3,033 t","over 235 days on stream"),
              ("Gain over baseline","×9.6","1.10 → 10.61 t/day"),
              ("Current rate","10.61 t/day","as of 27.09.2026"),
              ("Effect duration","8 months","and continuing")]),
  dict(kind="text", kicker="Where it does not help", h2="An honest limit of applicability",
       lead="Isolating the perforations delivers its full effect only where the cement sheath "
            "behind the casing is intact.",
       note="Logging reports on two edge wells show poor cement behind casing: continuous contact over "
            "only 6.25% and 30.4% of the hole. With contact like that, inflow bypasses the isolated "
            "perforations through channels behind the casing, so closing the holes does not produce "
            "a full seal — and the gain in rate is only partial.",
       cols=[("Indicator","Poor cement behind casing","Continuous contact over less than a third of the "
              "hole on the bond log. The sheath must be assessed before the job, or the result will be partial."),
             ("Indicator","An edge position in the pool","The central-eastern core seals on the first "
              "entry. At the edges a second entry or a different scheme is required."),
             ("What follows","Candidate selection","Candidates should be picked by position and casing "
              "condition. Operating figures on their own do not predict the outcome — the sheath must "
              "be assessed by bond log before the job.")]),
  dict(kind="verify", kicker="Verification", h2="Tightness can be proven straight away",
       lead="On well 357 the isolation was confirmed by direct test — before start-up, without waiting "
            "for production statistics.",
       rows=[("Cement bridge","40 atm · 15 min","tight"),
             ("Intervals 657–663 and 669.5–672 m","30 atm","tight"),
             ("Interval 679–684 m","40 atm · 15 min","tight")],
       note="The testing was done in stages as the bridge was drilled out: each interval was checked as "
            "soon as it was opened. Testing the whole hole at once would not locate a leaking interval. "
            "A caveat: the test was at 30–40 atm against a squeeze pressure of 80 atm, and it says "
            "nothing about crossflow behind the casing."),
  dict(kind="final", kicker="Summary", h2="What we offer",
       lead="The cement, a proven squeeze procedure and transparent analytics on every treatment.",
       cols=[("01","The cement","An ultra-fine blend of our own manufacture, TU 5745-001-171140033124-2025. "
              "Supplied in 25 kg and 1000 kg packs, 12-month shelf life."),
             ("02","The procedure","A three-stage squeeze with pressure control, a separate pressure test "
              "on each interval and subsequent re-perforation."),
             ("03","The analytics","Daily monitoring of the well stock, effect measured from the "
              "oil-rate trend, failures analysed. All of it open at nanocem.app.")],
       cta="nanocem.app — the well stock, the tightness review and the work programme"),
 ])

# ─────────────────────────────────────────────────────────────────────────────
def slide(t, s, n, total, m=False):
    head = (f'<div class="s-head"><div class="mark"><i></i></div>'
            f'<div class="s-brand">NanoCem UT-9</div><div class="s-spacer"></div>'
            f'<div class="s-kicker">{s.get("kicker","")}</div></div>')
    foot = (f'<div class="s-foot"><div>{t["foot_l"]}</div>'
            f'<div>{t["foot_r"]} · {n} / {total}</div></div>')

    def cols(items, cls="c3"):
        cells = "".join(f'<div class="cell"><div class="cell-idx">{a}</div>'
                        f'<div class="cell-h">{b}</div><div class="cell-t">{c}</div></div>'
                        for a, b, c in items)
        return f'<div class="cols {cls}">{cells}</div>'

    def note(txt, style=""):
        """Примечание с абзацами: пустая строка в тексте разбивает его на блоки."""
        parts = [x.strip() for x in txt.split("\n\n") if x.strip()]
        first = f' style="{style}"' if style else ""
        out = [f'<div class="note"{first}>{parts[0]}</div>']
        out += [f'<div class="note" style="margin-top:14px">{x}</div>' for x in parts[1:]]
        return "".join(out)

    def stats(items):
        cells = "".join(f'<div class="stat"><div class="stat-k">{a}</div>'
                        f'<div class="stat-v">{b}</div><div class="stat-s">{c}</div></div>'
                        for a, b, c in items)
        return f'<div class="stats">{cells}</div>'

    k = s["kind"]
    if k == "title":
        body = (f'<div class="watermark">UT-9</div><div class="s-body">'
                f'<div class="eyebrow">{s["eyebrow"]}</div><h1>{s["h1"]}</h1>'
                f'<div class="lead">{s["lead"]}</div></div>'
                f'<div class="stats-wrap">{stats(s["stats"])}</div>')
    elif k == "text":
        body = (f'<div class="s-body"><h2>{s["h2"]}</h2><div class="lead">{s["lead"]}</div>'
                + (note(s["note"]) if s.get("note") else "")
                + cols(s["cols"]) + '</div>')
    elif k == "grind":
        body = (f'<div class="s-body"><h2>{s["h2"]}</h2><div class="lead">{s["lead"]}</div>'
                f'<div style="display:grid;grid-template-columns:{"1fr" if m else "1.1fr 1fr"};gap:{44 if m else 52}px;align-items:center;margin-top:30px">'
                f'<div>{grind_svg(t)}</div><div>{note(s["note"], "margin:0")}</div></div></div>')
    elif k == "spec":
        half = (len(s["rows"]) + 1) // 2
        def tbl(rows):
            if m:
                return ("<table>" + "".join(
                    f'<tr style="padding:0;border:none;margin:0;'
                    f'border-bottom:1px solid var(--border-dim)">'
                    f'<td style="padding:16px 0;text-align:left">'
                    f'<span style="color:var(--grey)">{a}</span>'
                    f'<span style="font-weight:600;margin-left:auto;padding-left:24px;'
                    f'text-align:right">{b}</span></td></tr>'
                    for a, b in rows) + "</table>")
            return ("<table>" + "".join(
                f'<tr><td style="color:var(--grey)">{a}</td>'
                f'<td class="num" style="text-align:right;font-weight:600">{b}</td></tr>'
                for a, b in rows) + "</table>")
        grid = ("1fr", 0) if m else ("1fr 1fr", 48)
        rows_html = tbl(s["rows"]) if m else (tbl(s["rows"][:half]) + tbl(s["rows"][half:]))
        body = (f'<div class="s-body"><h2>{s["h2"]}</h2>'
                f'<div class="note" style="margin-top:10px">{s["sub"]}</div>'
                f'<div style="display:grid;grid-template-columns:{grid[0]};gap:{grid[1]}px;margin-top:8px">'
                f'{rows_html}</div></div>')
    elif k == "tech":
        items = [(a, b, c) for a, b, c in s["steps"]]
        body = (f'<div class="s-body top"><h2>{s["h2"]}</h2>'
                f'<div class="note" style="margin-top:10px">{s["sub"]}</div>'
                + cols(items[:3]) + cols(items[3:]).replace('class="cols c3"','class="cols c3" style="margin-top:1px"')
                + '</div>')
    elif k == "fund":
        head_row = "".join(f"<th>{h}</th>" for h in s["head"])
        hk = s["head"]
        rows = "".join(
            f'<tr><td class="w">{w}</td>'
            f'<td class="num" data-k="{hk[1]}">{e}</td>'
            f'<td data-k="{hk[2]}"><span class="cv"><span class="dot {d}"></span>{lab}</span></td>'
            f'<td class="num" data-k="{hk[3]}">{dt}</td>'
            f'<td class="wide" data-k="{hk[4]}" style="color:var(--ink-dim)">{res}</td></tr>'
            for w, e, d, lab, dt, res in s["rows"])
        body = (f'<div class="s-body"><h2>{s["h2"]}</h2>'
                f'<div class="note" style="margin-top:10px">{s["sub"]}</div>'
                f'<table><thead><tr>{head_row}</tr></thead><tbody>{rows}</tbody></table></div>')
    elif k == "case":
        body = (f'<div class="s-body"><h2>{s["h2"]}</h2>'
                f'<div style="display:grid;grid-template-columns:{"1fr" if m else "1.15fr 1fr"};gap:{40 if m else 52}px;align-items:center;margin-top:18px">'
                f'<div>{case_svg(t)}</div><div class="lead" style="margin:0">{s["lead"]}</div></div></div>'
                f'<div class="stats-wrap">{stats(s["stats"])}</div>')
    elif k == "verify":
        if m:
            rows = "".join(f'<tr><td class="w" style="font-size:30px">{a}</td>'
                           f'<td data-k="Давление">{b}</td>'
                           f'<td data-k="Итог" style="color:var(--ok);font-weight:600">{c}</td></tr>'
                           for a, b, c in s["rows"])
        else:
            rows = "".join(f'<tr><td style="color:var(--grey)">{a}</td>'
                           f'<td class="num" style="text-align:right">{b}</td>'
                           f'<td style="text-align:right;color:var(--ok);font-weight:600;width:130px">{c}</td></tr>'
                           for a, b, c in s["rows"])
        body = (f'<div class="s-body"><h2>{s["h2"]}</h2><div class="lead">{s["lead"]}</div>'
                f'<div style="display:grid;grid-template-columns:{"1fr" if m else "1fr 1fr"};gap:{36 if m else 52}px;margin-top:26px;align-items:start">'
                f'<table style="margin-top:0">{rows}</table>'
                f'<div>{note(s["note"], "margin-top:0")}</div></div></div>')
    else:  # final
        body = (f'<div class="watermark">UT-9</div><div class="s-body"><h2>{s["h2"]}</h2>'
                f'<div class="lead">{s["lead"]}</div>' + cols(s["cols"]) +
                f'<div style="margin-top:30px"><span class="pill ok">{s["cta"]}</span></div></div>')
    return f'<section class="slide">{head}{body}{foot}</section>'

def split_for_mobile(deck):
    """Плотные слайды делим пополам: в вертикальный формат шесть карточек не влезают."""
    out = []
    for s in deck:
        if s["kind"] == "tech" and len(s.get("steps", [])) > 3:
            a = dict(s); a["steps"] = s["steps"][:3]
            b = dict(s); b["steps"] = s["steps"][3:]; b["sub"] = ""
            b["h2"] = s["h2"] + " · 2"
            a["h2"] = s["h2"] + " · 1"
            out += [a, b]
        elif s["kind"] == "fund" and len(s.get("rows", [])) > 4:
            a = dict(s); a["rows"] = s["rows"][:4]
            b = dict(s); b["rows"] = s["rows"][4:]; b["sub"] = ""
            out += [a, b]
        else:
            out.append(s)
    return out

def build(t, mobile=False):
    deck = split_for_mobile(t["s"]) if mobile else t["s"]
    total = len(deck)
    slides = "\n".join(slide(t, s, i + 1, total, mobile) for i, s in enumerate(deck))
    html = (f'<!DOCTYPE html><html lang="{t["lang"]}"><head><meta charset="UTF-8">'
            f'<title>{t["title"]}</title>'
            f'<link rel="preconnect" href="https://fonts.googleapis.com">'
            f'<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700'
            f'&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">'
            f'<style>{CSS_M if mobile else CSS}</style></head><body>{slides}</body></html>')
    name = "tools/_deck-%s%s.html" % (t["lang"], "-m" if mobile else "")
    out = os.path.join(ROOT, name)
    io.open(out, "w", encoding="utf-8").write(html)
    print("%s — %d слайдов" % (os.path.basename(out), total))
    return out

if __name__ == "__main__":
    for t in (RU, EN):
        build(t)
    build(RU, mobile=True)
