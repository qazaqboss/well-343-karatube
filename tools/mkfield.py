# -*- coding: utf-8 -*-
"""Сборка public/field.js — срез фонда и помесячная динамика обводнённости."""
import json, io
from collections import defaultdict

D = json.load(open('/tmp/field.json'))
UT9 = ["343", "342", "301", "303", "305", "311", "357"]
MN = {'01':'Январь','02':'Февраль','03':'Март','04':'Апрель','05':'Май',
      '06':'Июнь','07':'Июль','08':'Август','09':'Сентябрь'}
MS = {'01':'Янв','02':'Фев','03':'Мар','04':'Апр','05':'Май',
      '06':'Июн','07':'Июл','08':'Авг','09':'Сен'}
months = sorted(D)

def wc(group):
    """Обводнённость группы — по сумме потоков, а не среднее по скважинам."""
    qv  = sum(x['qv']  for x in group if x['qv']  is not None)
    qzh = sum(x['qzh'] for x in group if x['qzh'] is not None)
    return round(qv / qzh * 100, 1) if qzh else None

def num(v, d=2):
    return None if v is None else round(float(v), d)

# ── помесячный ряд ───────────────────────────────────────────────────────────
series = []
for mm in months:
    rows = [x for x in D[mm]['rows'] if x['obv'] is not None]
    ours = [x for x in rows if x['w'] in UT9]
    rest = [x for x in rows if x['w'] not in UT9]
    series.append(dict(m=MS[mm], full=MN[mm], date=D[mm]['sheet'].rstrip('г.'),
                       wells=len(rows), ours=len(ours),
                       qn=round(sum(x['qn'] for x in rows if x['qn'] is not None), 1),
                       qzh=round(sum(x['qzh'] for x in rows if x['qzh'] is not None), 1),
                       wc=wc(rows), wcOurs=wc(ours), wcRest=wc(rest)))

# ── срез на последний месяц + серия обводнённости по каждой скважине ─────────
last = months[-1]
hist = defaultdict(dict)
for mm in months:
    for x in D[mm]['rows']:
        if x['obv'] is not None: hist[x['w']][mm] = round(float(x['obv']), 1)

wells = []
for x in D[last]['rows']:
    wells.append(dict(w=x['w'], gor=(x['gor'] or '—').strip(), area=x['area'],
                      perf=x['perf'], ndin=x['ndin'], rpm=x['rpm'], note=x['note'],
                      qn=num(x['qn']), qzh=num(x['qzh'], 1), obv=num(x['obv'], 1),
                      qv=num(x['qv'], 2), ut9=x['w'] in UT9,
                      series=[hist[x['w']].get(mm) for mm in months]))
wells.sort(key=lambda r: (r['obv'] is None, -(r['obv'] or 0)))

out = dict(updated='27.09.2026', monthsLabels=[MS[m] for m in months],
           ut9=UT9, series=series, wells=wells)

js = ("/* Срез фонда и динамика обводнённости. Источник: помесячные режимные листы ICP.\n"
      "   Пересобирается скриптом tools/mkfield.py. Обновлено: 27.09.2026. */\n"
      "window.FIELD = " + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ";\n")
io.open('/Users/damirsultan/Desktop/Wibecoding/nanocem.app/public/field.js', 'w', encoding='utf-8').write(js)
print('field.js: скважин %d, месяцев %d, размер %.1f КБ' % (len(wells), len(series), len(js)/1024))
print('наши в срезе:', [w['w'] for w in wells if w['ut9']])
