#!/usr/bin/env python3
"""
Генератор PDF: 90-дневный цикл испытания скважины (5 объектов)
Компания: IC Petroleum
"""

from fpdf import FPDF
from datetime import datetime
from pathlib import Path

VAULT = Path(__file__).parent
OUT  = VAULT / "IC_Petroleum_90day_Testing.pdf"

# ─── Цветовая палитра ────────────────────────────────────────
DARK_BLUE  = (10,  40,  80)
MID_BLUE   = (30,  80, 160)
LIGHT_BLUE = (220, 235, 255)
ACCENT     = (200, 50,  30)
WHITE      = (255, 255, 255)
GRAY_DARK  = (60,  60,  60)
GRAY_LIGHT = (245, 245, 248)
BLACK      = (20,  20,  20)
GREEN      = (20, 140,  70)
ORANGE     = (210, 120,  10)

# ─── Данные объектов испытания ───────────────────────────────
OBJECTS = [
    {
        "num": 5,
        "name": "Объект 5 (Нижний)",
        "interval": "3 850 – 3 920 м",
        "formation": "Горизонт Ю-5 (Юрский)",
        "days": "1 – 16",
        "start": 1, "end": 16,
        "type": "Поисковый (нижний)",
        "steps": [
            ("Дни 1–2",   "Перфорация интервала (кумулятивный перфоратор, плотность 10 отв/м)"),
            ("Дни 3–5",   "Вызов притока: свабирование / аэрация компрессором"),
            ("Дни 6–9",   "КВД — кривая восстановления давления (глубинные манометры)"),
            ("Дни 10–12", "ГДИС: КПД, определение Рпл, Кпр, скин-фактора"),
            ("Дни 13–14", "Отбор глубинных проб (PVT): нефть, газ, вода"),
            ("Дни 15–16", "Изоляция: установка цементного моста / пакера"),
        ],
        "expected": "Ожидаемый флюид: нефть. Предполагаемый дебит: 15–40 м³/сут.",
        "color": (50, 130, 200),
    },
    {
        "num": 4,
        "name": "Объект 4",
        "interval": "3 600 – 3 680 м",
        "formation": "Горизонт Ю-4 (Юрский)",
        "days": "17 – 32",
        "start": 17, "end": 32,
        "type": "Поисковый",
        "steps": [
            ("Дни 17–18", "Перфорация интервала"),
            ("Дни 19–21", "Вызов притока: свабирование"),
            ("Дни 22–25", "КВД — кривая восстановления давления"),
            ("Дни 26–28", "ГДИС: КПД, фильтрационные параметры"),
            ("Дни 29–30", "Отбор глубинных проб (PVT)"),
            ("Дни 31–32", "Изоляция: цементный мост"),
        ],
        "expected": "Ожидаемый флюид: нефть/газоконденсат. Дебит: 10–25 м³/сут.",
        "color": (70, 150, 100),
    },
    {
        "num": 3,
        "name": "Объект 3",
        "interval": "3 200 – 3 280 м",
        "formation": "Горизонт К-3 (Меловой)",
        "days": "33 – 48",
        "start": 33, "end": 48,
        "type": "Основной",
        "steps": [
            ("Дни 33–34", "Перфорация интервала"),
            ("Дни 35–37", "Вызов притока: свабирование / аэрация"),
            ("Дни 38–41", "КВД — кривая восстановления давления"),
            ("Дни 42–44", "ГДИС: индикаторная кривая, Рзаб"),
            ("Дни 45–46", "Отбор глубинных и поверхностных проб"),
            ("Дни 47–48", "Изоляция: пакер / цементный мост"),
        ],
        "expected": "Ожидаемый флюид: нефть. Дебит: 20–60 м³/сут.",
        "color": (160, 100, 30),
    },
    {
        "num": 2,
        "name": "Объект 2",
        "interval": "2 700 – 2 760 м",
        "formation": "Горизонт К-2 (Меловой)",
        "days": "49 – 64",
        "start": 49, "end": 64,
        "type": "Основной",
        "steps": [
            ("Дни 49–50", "Перфорация интервала"),
            ("Дни 51–53", "Вызов притока"),
            ("Дни 54–57", "КВД и КПД — давление, проницаемость"),
            ("Дни 58–60", "ГДИС: установившиеся режимы фильтрации"),
            ("Дни 61–62", "Отбор глубинных проб (PVT-анализ)"),
            ("Дни 63–64", "Изоляция объекта"),
        ],
        "expected": "Ожидаемый флюид: нефть с газовой шапкой. Дебит: 30–80 м³/сут.",
        "color": (130, 60, 160),
    },
    {
        "num": 1,
        "name": "Объект 1 (Верхний)",
        "interval": "1 900 – 1 960 м",
        "formation": "Горизонт П-1 (Палеоген)",
        "days": "65 – 80",
        "start": 65, "end": 80,
        "type": "Перспективный (верхний)",
        "steps": [
            ("Дни 65–66", "Перфорация интервала (верхний объект)"),
            ("Дни 67–69", "Вызов притока: свабирование"),
            ("Дни 70–73", "КВД — кривая восстановления давления"),
            ("Дни 74–76", "ГДИС: КПД, фильтрационные характеристики"),
            ("Дни 77–78", "Отбор глубинных проб"),
            ("Дни 79–80", "Завершение испытания объекта 1"),
        ],
        "expected": "Ожидаемый флюид: нефть. Дебит: 5–20 м³/сут.",
        "color": (40, 130, 160),
    },
]


FONT_PATH = "/Library/Fonts/Arial Unicode.ttf"

class PDF(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(18, 15, 18)
        # Регистрируем Unicode шрифт с поддержкой кириллицы
        self.add_font("U", style="",  fname=FONT_PATH)
        self.add_font("U", style="B", fname=FONT_PATH)
        self.add_font("U", style="I", fname=FONT_PATH)
        self.set_font("U", "", 10)

    # ── Верхний колонтитул ────────────────────────────────────
    def header(self):
        if self.page_no() == 1:
            return
        # Тонкая полоса сверху
        self.set_fill_color(*DARK_BLUE)
        self.rect(0, 0, 210, 8, "F")
        self.set_xy(18, 10)
        self.set_font("U", "B", 7)
        self.set_text_color(*WHITE)
        self.cell(0, 4, "IC Petroleum — 90-дневный цикл испытания скважины / 5 объектов", ln=True)
        self.set_text_color(*BLACK)
        self.ln(5)

    # ── Нижний колонтитул ─────────────────────────────────────
    def footer(self):
        self.set_y(-13)
        self.set_fill_color(*DARK_BLUE)
        self.rect(0, self.get_y(), 210, 15, "F")
        self.set_font("U", "", 7)
        self.set_text_color(*WHITE)
        self.cell(0, 8,
            f"IC Petroleum  |  Конфиденциально  |  Стр. {self.page_no()}  |  {datetime.now().strftime('%d.%m.%Y')}",
            align="C")

    # ── Вспомогательные методы ───────────────────────────────
    def h1(self, text):
        self.set_fill_color(*DARK_BLUE)
        self.set_text_color(*WHITE)
        self.set_font("U", "B", 13)
        self.cell(0, 9, f"  {text}", ln=True, fill=True)
        self.set_text_color(*BLACK)
        self.ln(3)

    def h2(self, text, color=MID_BLUE):
        self.set_fill_color(*color)
        self.set_text_color(*WHITE)
        self.set_font("U", "B", 10)
        self.cell(0, 7, f"  {text}", ln=True, fill=True)
        self.set_text_color(*BLACK)
        self.ln(2)

    def label_value(self, label, value, label_w=55):
        self.set_font("U", "B", 9)
        self.set_text_color(*MID_BLUE)
        self.cell(label_w, 6, label)
        self.set_font("U", "", 9)
        self.set_text_color(*GRAY_DARK)
        self.multi_cell(0, 6, value)
        self.set_text_color(*BLACK)

    def divider(self):
        self.set_draw_color(*MID_BLUE)
        self.set_line_width(0.3)
        self.line(18, self.get_y(), 192, self.get_y())
        self.ln(3)


def cover_page(pdf: PDF):
    # Полная заливка верхней части
    pdf.set_fill_color(*DARK_BLUE)
    pdf.rect(0, 0, 210, 90, "F")

    # Акцентная полоса
    pdf.set_fill_color(*ACCENT)
    pdf.rect(0, 90, 210, 4, "F")

    # Логотип / название компании
    pdf.set_xy(0, 18)
    pdf.set_font("U", "B", 32)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 14, "IC PETROLEUM", align="C", ln=True)

    pdf.set_font("U", "", 12)
    pdf.set_text_color(200, 220, 255)
    pdf.cell(0, 7, "IC Petroleum LLP  |  Республика Казахстан", align="C", ln=True)

    # Горизонтальный разделитель
    pdf.set_draw_color(100, 150, 220)
    pdf.set_line_width(0.5)
    pdf.line(40, 52, 170, 52)
    pdf.ln(4)

    # Название документа
    pdf.set_font("U", "B", 17)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 9, "ПРОГРАММА ИСПЫТАНИЯ СКВАЖИНЫ", align="C", ln=True)
    pdf.set_font("U", "B", 14)
    pdf.cell(0, 8, "90-дневный цикл · 5 объектов испытания", align="C", ln=True)

    # Метаданные документа
    pdf.set_xy(0, 105)
    pdf.set_font("U", "B", 10)
    pdf.set_text_color(*DARK_BLUE)

    meta = [
        ("Скважина",        "Поисково-оценочная скважина № [_____]"),
        ("Месторождение",   "[Название месторождения], Республика Казахстан"),
        ("Оператор",        "IC Petroleum LLP"),
        ("Буровой подрядчик", "[Название подрядчика]"),
        ("Контракт на Н/Д", "№ [_____] от [ДД.ММ.ГГГГ]"),
        ("Дата начала",     "День 0: [ДД.ММ.ГГГГ] (завершение бурения)"),
        ("Дата окончания",  "День 90: [ДД.ММ.ГГГГ] (подача паспорта в МЭиПР)"),
        ("Нормативная база","КОНН РК №125-VI (изм. 10.06.2025), ст. 134, 137"),
        ("Документ №",      "ICP-WELL-TEST-001"),
        ("Версия",          "1.0  |  Статус: Рабочая"),
    ]

    col_w = 60
    row_h = 8
    x0 = 25

    for i, (label, value) in enumerate(meta):
        y = 108 + i * (row_h + 1)
        pdf.set_xy(x0, y)
        # Фон строки
        fill = GRAY_LIGHT if i % 2 == 0 else WHITE
        pdf.set_fill_color(*fill)
        pdf.rect(x0, y, 165, row_h, "F")
        pdf.set_xy(x0 + 2, y + 1)
        pdf.set_font("U", "B", 8.5)
        pdf.set_text_color(*MID_BLUE)
        pdf.cell(col_w, row_h - 2, label + ":")
        pdf.set_font("U", "", 8.5)
        pdf.set_text_color(*GRAY_DARK)
        pdf.cell(0, row_h - 2, value)

    # Подписи
    pdf.set_xy(25, 205)
    pdf.set_font("U", "B", 9)
    pdf.set_text_color(*DARK_BLUE)

    sigs = [
        ("Составил", "Геолог / Геофизик", "_________________"),
        ("Проверил", "Главный геолог",     "_________________"),
        ("Утвердил", "Директор операций",  "_________________"),
    ]
    for s_label, s_role, s_line in sigs:
        pdf.cell(60, 6, s_label + ":", ln=False)
        pdf.cell(50, 6, s_role, ln=False)
        pdf.set_font("U", "", 9)
        pdf.cell(40, 6, s_line, ln=True)
        pdf.set_font("U", "B", 9)
        pdf.ln(1)

    # Нижняя плашка
    pdf.set_fill_color(*DARK_BLUE)
    pdf.rect(0, 277, 210, 20, "F")
    pdf.set_xy(0, 280)
    pdf.set_font("U", "", 8)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 5, f"IC Petroleum LLP  |  Конфиденциально  |  {datetime.now().strftime('%d.%m.%Y')}", align="C")


def summary_page(pdf: PDF):
    pdf.add_page()
    pdf.h1("1. СВОДНАЯ ИНФОРМАЦИЯ И НОРМАТИВНАЯ БАЗА")
    pdf.ln(2)

    # Цель
    pdf.set_font("U", "B", 10)
    pdf.set_text_color(*MID_BLUE)
    pdf.cell(0, 6, "Цель испытания:", ln=True)
    pdf.set_font("U", "", 9)
    pdf.set_text_color(*GRAY_DARK)
    pdf.multi_cell(174, 5.5,
        "Определение нефте- и газонасыщённости разреза, фильтрационно-ёмкостных свойств (ФЕС) "
        "каждого из 5 продуктивных объектов, получение проб пластовых флюидов для PVT-анализа, "
        "оценка промышленного потенциала залежей и получение данных для постановки на Государственный "
        "баланс запасов (ГБЗ) в соответствии со ст. 134–135 КОНН РК №125-VI."
    )
    pdf.ln(3)

    # Нормативная база
    pdf.h2("Нормативная база")
    regs = [
        ("КОНН РК №125-VI от 27.12.2017 (изм. 10.06.2025)",
         "Ст. 134, 135 — проект разведочных работ\nСт. 137 — проект разработки\nСт. 142 — авторский надзор"),
        ("ЭК РК №400-VI от 02.01.2021 (изм. 29.07.2025)",
         "Ст. 67, 68 — ОВВ / РООС, заявление о намечаемой деятельности"),
        ("ЕПРКИН №239 от 15.06.2018 (изм. 24.09.2024)",
         "Гл. 5 — требования к авторскому надзору\nП. 55 — уведомительный порядок"),
        ("Приказ МЭ №355 от 30.12.2014",
         "Правила промышленной безопасности нефтегазовой отрасли"),
        ("Приказ МИИР №71 от 02.02.2023",
         "Классификация запасов и ресурсов УВ"),
        ("Приказ МИИР №419 от 31.05.2018 (изм. №200 от 25.08.2020)",
         "Формы отчётов по разведочным скважинам"),
    ]
    for norm, desc in regs:
        pdf.set_fill_color(*LIGHT_BLUE)
        pdf.set_font("U", "B", 8.5)
        pdf.set_text_color(*DARK_BLUE)
        pdf.cell(0, 6, f"  {norm}", ln=True, fill=True)
        pdf.set_font("U", "", 8)
        pdf.set_text_color(*GRAY_DARK)
        for line in desc.split("\n"):
            pdf.cell(5, 5, "")
            pdf.cell(0, 5, f"• {line}", ln=True)
        pdf.ln(1)

    pdf.ln(2)
    pdf.divider()
    pdf.h2("Сводная таблица объектов испытания")

    # Таблица
    headers = ["№", "Объект", "Интервал, м", "Горизонт", "Дни", "Тип"]
    widths  = [8,   52,        30,            40,          18,    22]
    pdf.set_fill_color(*DARK_BLUE)
    pdf.set_text_color(*WHITE)
    pdf.set_font("U", "B", 8.5)
    for h, w in zip(headers, widths):
        pdf.cell(w, 7, h, border=0, align="C", fill=True)
    pdf.ln()

    for i, obj in enumerate(OBJECTS):
        fill = GRAY_LIGHT if i % 2 == 0 else WHITE
        pdf.set_fill_color(*fill)
        pdf.set_text_color(*GRAY_DARK)
        pdf.set_font("U", "B" if i % 2 == 0 else "", 8.5)
        row = [
            str(obj["num"]),
            obj["name"],
            obj["interval"],
            obj["formation"],
            obj["days"],
            obj["type"],
        ]
        for val, w in zip(row, widths):
            pdf.cell(w, 6.5, val, border=0, align="C", fill=True)
        pdf.ln()

    # Итог
    pdf.set_fill_color(*MID_BLUE)
    pdf.set_text_color(*WHITE)
    pdf.set_font("U", "B", 8.5)
    totals = ["—", "ИТОГО 5 объектов", "1 900 – 3 920 м", "4 горизонта", "1–80", "—"]
    for val, w in zip(totals, widths):
        pdf.cell(w, 7, val, border=0, align="C", fill=True)
    pdf.ln(8)

    # Порядок испытания
    pdf.h2("Принцип порядка испытания: СНИЗУ ВВЕРХ")
    pdf.set_font("U", "", 9)
    pdf.set_text_color(*GRAY_DARK)
    pdf.multi_cell(174, 5.5,
        "Испытание проводится последовательно снизу вверх (от объекта 5 к объекту 1). "
        "Это обеспечивает: (1) отсутствие флюидных перетоков между горизонтами; "
        "(2) надёжную изоляцию нижних объектов после испытания цементными мостами; "
        "(3) соответствие требованиям промышленной безопасности (Приказ МЭ №355)."
    )


def schedule_page(pdf: PDF):
    pdf.add_page()
    pdf.h1("2. СВОДНЫЙ КАЛЕНДАРНЫЙ ГРАФИК (90 ДНЕЙ)")
    pdf.ln(2)

    # Gantt-таблица
    pdf.set_font("U", "B", 8)
    pdf.set_fill_color(*DARK_BLUE)
    pdf.set_text_color(*WHITE)

    col_obj  = 48
    col_days = 3.5
    n_days   = 42  # Дни 1–90 (сжатые группами по ~2 дня = 45 ячеек)

    # Заголовок: "Объект" + декады
    pdf.cell(col_obj, 7, "Объект / Операция", border=0, fill=True, align="C")
    for d_start in range(1, 91, 2):
        d_end = min(d_start + 1, 90)
        label = str(d_start) if d_start % 10 == 1 else ""
        pdf.cell(col_days, 7, label, border=0, fill=True, align="C")
    pdf.ln()

    # Декадные метки
    pdf.set_fill_color(*MID_BLUE)
    pdf.cell(col_obj, 5, "", fill=True)
    for d_start in range(1, 91, 2):
        label = ""
        if d_start in (1, 11, 21, 31, 41, 51, 61, 71, 81):
            label = f"д{d_start}"
        pdf.cell(col_days, 5, label, fill=True, align="C")
    pdf.ln()

    # Строки объектов
    obj_ops = [
        (5, "Объект 5 (Нижний)  3 850–3 920 м",  1,  16, (50, 130, 200)),
        (4, "Объект 4           3 600–3 680 м",  17,  32, (70, 150, 100)),
        (3, "Объект 3           3 200–3 280 м",  33,  48, (160,100,  30)),
        (2, "Объект 2           2 700–2 760 м",  49,  64, (130, 60, 160)),
        (1, "Объект 1 (Верхний) 1 900–1 960 м",  65,  80, (40, 130, 160)),
        (0, "Обработка данных / PVT-анализ",     81,  88, (100, 100, 100)),
        (0, "Составление паспорта скважины",      89,  90, ACCENT),
    ]

    for i, (num, label, d1, d2, color) in enumerate(obj_ops):
        bg = GRAY_LIGHT if i % 2 == 0 else WHITE
        pdf.set_fill_color(*bg)
        pdf.set_text_color(*GRAY_DARK)
        pdf.set_font("U", "B" if num > 0 else "", 7.5)
        pdf.cell(col_obj, 6, f"  {label}", fill=True)

        for d_start in range(1, 91, 2):
            d_end = min(d_start + 1, 90)
            # Попадает ли этот двухдневный блок в диапазон объекта?
            overlap = not (d_end < d1 or d_start > d2)
            if overlap:
                pdf.set_fill_color(*color)
                pdf.cell(col_days, 6, "", fill=True)
                pdf.set_fill_color(*bg)
            else:
                pdf.cell(col_days, 6, "", fill=True)
        pdf.ln()

    pdf.ln(4)

    # Легенда
    pdf.set_font("U", "B", 8.5)
    pdf.set_text_color(*DARK_BLUE)
    pdf.cell(0, 6, "Легенда:", ln=True)
    pdf.ln(1)

    legend = [
        ((50, 130, 200), "Объект 5 — Горизонт Ю-5 (Дни 1–16)"),
        ((70, 150, 100), "Объект 4 — Горизонт Ю-4 (Дни 17–32)"),
        ((160,100,  30), "Объект 3 — Горизонт К-3 (Дни 33–48)"),
        ((130, 60, 160), "Объект 2 — Горизонт К-2 (Дни 49–64)"),
        ((40, 130, 160), "Объект 1 — Горизонт П-1 (Дни 65–80)"),
        ((100,100, 100), "Обработка данных / PVT (Дни 81–88)"),
        (ACCENT,         "Составление паспорта скважины (Дни 89–90)"),
    ]
    for color, text in legend:
        pdf.set_fill_color(*color)
        pdf.rect(pdf.get_x(), pdf.get_y() + 1, 7, 4, "F")
        pdf.set_x(pdf.get_x() + 10)
        pdf.set_font("U", "", 8)
        pdf.set_text_color(*GRAY_DARK)
        pdf.cell(80, 6, text)
        if legend.index((color, text)) % 2 == 1:
            pdf.ln()
        else:
            pdf.cell(5, 6, "")
    pdf.ln(6)

    # Ключевые этапы
    pdf.h2("Ключевые контрольные точки")
    milestones = [
        ("День 0",  "Завершение бурения, подписание акта, старт 90-дневного цикла"),
        ("День 16", "Завершение испытания Объекта 5, установка моста"),
        ("День 32", "Завершение испытания Объекта 4, установка моста"),
        ("День 48", "Завершение испытания Объекта 3, установка моста"),
        ("День 64", "Завершение испытания Объекта 2, установка моста"),
        ("День 80", "Завершение испытания Объекта 1"),
        ("День 88", "Завершение обработки данных, получение PVT-результатов"),
        ("День 90", "Подписание паспорта скважины, подача в МЭиПР РК"),
    ]
    pdf.set_font("U", "B", 8.5)
    header_row = ["День", "Контрольная точка / Событие"]
    widths_m = [18, 156]
    pdf.set_fill_color(*DARK_BLUE)
    pdf.set_text_color(*WHITE)
    for h, w in zip(header_row, widths_m):
        pdf.cell(w, 6, h, fill=True, align="C")
    pdf.ln()

    for i, (day, event) in enumerate(milestones):
        bg = GRAY_LIGHT if i % 2 == 0 else WHITE
        pdf.set_fill_color(*bg)
        pdf.set_text_color(*GRAY_DARK)
        is_key = day in ("День 0", "День 90")
        pdf.set_font("U", "B", 8.5 if is_key else 8)
        pdf.set_text_color(*ACCENT if is_key else GRAY_DARK)
        pdf.cell(18, 6, day, fill=True, align="C")
        pdf.set_text_color(*GRAY_DARK)
        pdf.cell(156, 6, event, fill=True)
        pdf.ln()


def object_page(pdf: PDF, obj: dict):
    pdf.add_page()
    # Цветная шапка объекта
    pdf.set_fill_color(*obj["color"])
    pdf.rect(0, 0, 210, 28, "F")
    pdf.set_fill_color(*DARK_BLUE)
    pdf.rect(0, 28, 210, 8, "F")

    pdf.set_xy(0, 6)
    pdf.set_font("U", "B", 18)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 9, f"  ОБЪЕКТ {obj['num']}: {obj['name'].upper()}", ln=True)
    pdf.set_font("U", "", 10)
    pdf.cell(0, 6, f"  {obj['formation']}  |  Интервал: {obj['interval']}  |  Дни испытания: {obj['days']}", ln=True)
    pdf.set_xy(0, 29)
    pdf.set_font("U", "B", 8)
    pdf.cell(0, 7, f"  Тип: {obj['type']}  |  {obj['expected']}", align="L")
    pdf.set_text_color(*BLACK)
    pdf.ln(14)

    # Детальная программа
    pdf.h2(f"Детальная программа испытания — Объект {obj['num']}")

    for i, (period, desc) in enumerate(obj["steps"]):
        bg = GRAY_LIGHT if i % 2 == 0 else WHITE
        pdf.set_fill_color(*bg)
        pdf.set_font("U", "B", 9)
        pdf.set_text_color(*obj["color"])
        pdf.cell(28, 7, period, fill=True)
        pdf.set_font("U", "", 9)
        pdf.set_text_color(*GRAY_DARK)
        pdf.cell(0, 7, desc, fill=True, ln=True)
    pdf.ln(4)

    # Детализация по операциям
    pdf.h2("Состав геофизических и гидродинамических исследований")

    ops = [
        ("ГИС (каротаж)",
         "Стандартный каротажный комплекс: ПС, КС, БК, ИК, ГК, НГК, АК, ГГК-п, инклинометрия. "
         "Интерпретация: определение коллекторов, Кп, Кн, характера насыщения."),
        ("КВД (Кривая Восстановления Давления)",
         "После остановки скважины регистрируется восстановление забойного давления. "
         "Обработка методом КВД позволяет определить: Рпл (пластовое давление), "
         "Кпр·h (проводимость), скин-фактор S, радиус исследования Rисс."),
        ("ГДИС (Гидродинамические исследования)",
         "КПД — кривая падения давления при отборе. "
         "Индикаторная кривая (ИК) — зависимость дебита от депрессии. "
         "Установившиеся режимы: определение Кпр, Кприём, коэффициента продуктивности."),
        ("PVT-анализ проб",
         "Отбор глубинных (рекомбинированных) и поверхностных проб. "
         "Определение: давления насыщения Рнас, ГФ, усадки нефти bo, вязкости μ, "
         "состава нефти/газа. Лабораторные анализы в сертифицированной лаборатории."),
        ("Испытание на приток",
         "Вызов притока: свабирование, аэрация, замена бурового раствора водой. "
         "Измерение дебита сепаратором устьевым. Отбор проб нефти/газа/воды на поверхности. "
         "Определение обводнённости, ГФ, устьевых давлений."),
    ]

    for i, (op_name, op_desc) in enumerate(ops):
        pdf.set_fill_color(*(LIGHT_BLUE if i % 2 == 0 else WHITE))
        pdf.set_font("U", "B", 9)
        pdf.set_text_color(*MID_BLUE)
        pdf.cell(0, 6, f"  {op_name}", fill=True, ln=True)
        pdf.set_font("U", "", 8.5)
        pdf.set_text_color(*GRAY_DARK)
        pdf.set_x(pdf.get_x() + 5)
        pdf.multi_cell(174, 5, op_desc)
        pdf.ln(1)

    pdf.ln(2)
    # Критерии оценки
    pdf.h2(f"Критерии оценки и решения по Объекту {obj['num']}", color=(30, 120, 60))
    criteria = [
        ("Промышленный приток",
         "Дебит нефти ≥ 5 м³/сут при депрессии ≤ 5 МПа → рекомендуется включить в подсчёт запасов"),
        ("Непромышленный приток",
         "Дебит < 5 м³/сут или высокая обводнённость → объект учитывается как перспективный"),
        ("Сухая скважина",
         "Отсутствие притока → установка цементного моста, объект исключается из подсчёта"),
        ("Признаки сложного проекта",
         "H₂S > 6%, давление > 60 МПа → СТОП, обновление контракта (ст. 10 КОНН РК)"),
    ]
    for label, desc in criteria:
        pdf.set_font("U", "B", 8.5)
        pdf.set_text_color(*DARK_BLUE)
        pdf.cell(5, 6, "▸")
        pdf.cell(50, 6, label + ":")
        pdf.set_font("U", "", 8.5)
        pdf.set_text_color(*GRAY_DARK)
        pdf.multi_cell(174, 6, desc)


def payments_page(pdf: PDF):
    pdf.add_page()
    pdf.h1("3. ПЛАТЁЖНЫЕ ВЕХИ ПОДРЯДЧИКОВ")
    pdf.ln(2)

    pdf.set_font("U", "", 9)
    pdf.set_text_color(*GRAY_DARK)
    pdf.multi_cell(174, 5.5,
        "Оплата буровому, геофизическому и тампонажному подрядчикам привязана к "
        "документально подтверждённым вехам. Финальные 10% по каждому виду работ "
        "блокируются до утверждения паспорта скважины МЭиПР РК."
    )
    pdf.ln(3)

    # Таблица вех
    headers = ["Веха", "% от суммы", "Триггер / Документ"]
    widths  = [70, 22, 82]

    contractors = [
        ("Буровой подрядчик", [
            ("Мобилизация оборудования",            "10%", "Акт начала буровых работ"),
            ("Бурение до проектной глубины",         "40%", "Акт достижения проектной глубины"),
            ("Завершение ГИС",                       "20%", "Отчёт геофизического подрядчика"),
            ("Испытание всех 5 объектов",            "20%", "Акты испытания объектов 1–5"),
            ("Паспорт скважины утверждён МЭиПР",    "10%", "⚠️ Только после утверждения МЭиПР"),
        ]),
        ("Геофизический подрядчик (ГИС)", [
            ("Мобилизация, подготовка",              "15%", "Акт начала работ"),
            ("Выполнение каротажа (ГИС)",            "50%", "Каротажные диаграммы, сданы в МД"),
            ("Интерпретация, отчёт по ГИС",          "25%", "Отчёт передан оператору"),
            ("Паспорт скважины утверждён МЭиПР",    "10%", "⚠️ Только после утверждения МЭиПР"),
        ]),
        ("Тампонажный подрядчик", [
            ("Подготовка, мобилизация",              "10%", "Акт начала работ"),
            ("Цементирование обсадных колонн",       "55%", "Акт цементирования"),
            ("Установка цементных мостов (5 объект.)","25%", "Акты изоляции объектов 1–5"),
            ("Паспорт скважины утверждён МЭиПР",    "10%", "⚠️ Только после утверждения МЭиПР"),
        ]),
    ]

    for contractor, milestones in contractors:
        pdf.h2(contractor, color=MID_BLUE)
        pdf.set_fill_color(*DARK_BLUE)
        pdf.set_text_color(*WHITE)
        pdf.set_font("U", "B", 8.5)
        for h, w in zip(headers, widths):
            pdf.cell(w, 6, h, fill=True, align="C")
        pdf.ln()

        for i, (veha, pct, trigger) in enumerate(milestones):
            is_final = "МЭиПР" in trigger
            bg = (255, 240, 240) if is_final else (GRAY_LIGHT if i % 2 == 0 else WHITE)
            pdf.set_fill_color(*bg)
            pdf.set_font("U", "B" if is_final else "", 8.5)
            pdf.set_text_color(*ACCENT if is_final else GRAY_DARK)
            pdf.cell(widths[0], 6, veha, fill=True)
            pdf.set_font("U", "B", 8.5)
            pdf.set_text_color(*(GREEN if not is_final else ACCENT))
            pdf.cell(widths[1], 6, pct, fill=True, align="C")
            pdf.set_font("U", "", 8.5)
            pdf.set_text_color(*GRAY_DARK)
            pdf.cell(widths[2], 6, trigger, fill=True)
            pdf.ln()
        pdf.ln(4)

    # Важное предупреждение
    pdf.set_fill_color(255, 240, 230)
    pdf.set_draw_color(*ACCENT)
    pdf.rect(18, pdf.get_y(), 174, 20, "F")
    pdf.set_xy(21, pdf.get_y() + 2)
    pdf.set_font("U", "B", 9)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 5, "⚠️  КРИТИЧЕСКИ ВАЖНО:", ln=True)
    pdf.set_xy(21, pdf.get_y())
    pdf.set_font("U", "", 8.5)
    pdf.set_text_color(*GRAY_DARK)
    pdf.multi_cell(168, 5,
        "Финальные 10% всем подрядчикам выплачиваются ТОЛЬКО после утверждения паспорта "
        "скважины в МЭиПР РК. Субподрядчики обязаны передать все данные (ГИС, тампонаж) "
        "буровому подрядчику до составления паспорта."
    )


def passport_page(pdf: PDF):
    pdf.add_page()
    pdf.h1("4. СОСТАВ ПАСПОРТА СКВАЖИНЫ И ПОРЯДОК ПОДАЧИ В МЭиПР")
    pdf.ln(2)

    pdf.h2("Структура паспорта скважины")
    sections = [
        ("1. Идентификация скважины",
         "Номер, тип, координаты (WGS-84), глубина, дата начала/окончания бурения, "
         "недропользователь, контракт на Н/Д"),
        ("2. Конструкция скважины",
         "Диаметры и глубины спуска обсадных колонн (направление, кондуктор, "
         "промежуточная, эксплуатационная), интервалы цементирования"),
        ("3. Литолого-стратиграфический разрез",
         "Описание пород по интервалам: литология, стратиграфия, возраст, "
         "коллекторские свойства (Кп, Кпр, Кн)"),
        ("4. Результаты ГИС",
         "Интерпретация каротажа по всем 5 объектам: "
         "выделение коллекторов, характер насыщения, подсчётные параметры"),
        ("5. Результаты ГДИС",
         "По каждому объекту: Рпл, Кпр, скин-фактор, коэффициент продуктивности, "
         "тип фильтрационной модели"),
        ("6. Результаты испытания",
         "По каждому из 5 объектов: дебит нефти/газа/воды, устьевые давления, "
         "ГФ, обводнённость, интервалы перфорации"),
        ("7. PVT-характеристики",
         "Давление насыщения, объёмный коэффициент нефти, ГФ, вязкость, "
         "состав нефти/газа, результаты хроматографии"),
        ("8. Категория скважины",
         "Присваивается на основании результатов: поисковая/оценочная/добывающая/"
         "нагнетательная/контрольная/ликвидированная"),
        ("9. Связь с проектным документом",
         "Ссылка на утверждённый проект разведочных работ (ст. 134 КОНН РК), "
         "соответствие проектным показателям"),
        ("10. Заключение и рекомендации",
         "Оценка продуктивности объектов, рекомендации по включению в ГБЗ, "
         "предложения по дальнейшим работам"),
    ]

    for i, (sec, desc) in enumerate(sections):
        pdf.set_fill_color(*(LIGHT_BLUE if i % 2 == 0 else WHITE))
        pdf.set_font("U", "B", 9)
        pdf.set_text_color(*MID_BLUE)
        pdf.cell(0, 6, f"  {sec}", fill=True, ln=True)
        pdf.set_font("U", "", 8.5)
        pdf.set_text_color(*GRAY_DARK)
        pdf.set_x(pdf.get_x() + 5)
        pdf.multi_cell(174, 5, desc)
        pdf.ln(0.5)

    pdf.ln(2)
    pdf.h2("Порядок подачи в МЭиПР РК")
    steps_submit = [
        ("Шаг 1: Подготовка комплекта",
         "Паспорт + Акт завершения бурения + Отчёты ГИС + Отчёты ГДИС + "
         "Лабораторные анализы + Акты испытания (по каждому объекту)"),
        ("Шаг 2: Подача",
         "Электронно через портал МЭиПР РК или в бумажном виде (2 экз.) "
         "в уполномоченный орган"),
        ("Шаг 3: Рассмотрение",
         "МЭиПР рассматривает в течение 15–30 рабочих дней. "
         "Возможны запросы на уточнение данных"),
        ("Шаг 4: Утверждение",
         "Паспорт утверждается, скважина вносится в реестр МЭиПР. "
         "Получение уведомления об утверждении"),
        ("Шаг 5: Финансовые последствия",
         "После получения утверждённого паспорта — разблокировка финальных "
         "10% оплаты всем подрядчикам"),
    ]

    for i, (step, desc) in enumerate(steps_submit):
        pdf.set_fill_color(*(GRAY_LIGHT if i % 2 == 0 else WHITE))
        y0 = pdf.get_y()
        pdf.set_font("U", "B", 9)
        pdf.set_text_color(*DARK_BLUE)
        pdf.cell(0, 6, f"  {step}", fill=True, ln=True)
        pdf.set_font("U", "", 8.5)
        pdf.set_text_color(*GRAY_DARK)
        pdf.set_x(pdf.get_x() + 5)
        pdf.multi_cell(174, 5, desc)
        pdf.ln(1)


def build_pdf():
    pdf = PDF()
    pdf.set_title("IC Petroleum — 90-дневный цикл испытания скважины")
    pdf.set_author("IC Petroleum LLP")
    pdf.set_creator("Subsoil AI — IC Petroleum")

    # 1. Титульный лист
    pdf.add_page()
    cover_page(pdf)

    # 2. Сводная информация
    summary_page(pdf)

    # 3. График
    schedule_page(pdf)

    # 4. Каждый объект
    for obj in OBJECTS:
        object_page(pdf, obj)

    # 5. Платёжные вехи
    payments_page(pdf)

    # 6. Паспорт скважины
    passport_page(pdf)

    pdf.output(str(OUT))
    print(f"✅ PDF создан: {OUT}")
    return OUT


if __name__ == "__main__":
    build_pdf()
