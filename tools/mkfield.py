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

# ── агрегаты по последнему месяцу (поскважинные данные наружу не выносим) ───
last = months[-1]
meas = [x for x in D[last]['rows'] if x['obv'] is not None]

BINS = [(0, 20, 'до 20%'), (20, 40, '20–40%'), (40, 60, '40–60%'),
        (60, 80, '60–80%'), (80, 101, 'от 80%')]
dist = []
for lo, hi, label in BINS:
    g = [x for x in meas if lo <= x['obv'] < hi]
    dist.append(dict(label=label, n=len(g),
                     ours=sorted(x['w'] for x in g if x['w'] in UT9)))

hz = {}
for x in meas:
    k = (x['gor'] or '—').strip()
    hz.setdefault(k, []).append(x)
horizons = sorted((dict(name=k, n=len(v), wc=wc(v)) for k, v in hz.items()),
                  key=lambda h: -h['n'])

# ── наши скважины — поимённо: это наши собственные работы ───────────────────
hist = {}
for mm in months:
    for x in D[mm]['rows']:
        if x['w'] in UT9 and x['obv'] is not None:
            hist.setdefault(x['w'], {})[mm] = round(float(x['obv']), 1)

def num(v, d=2):
    return None if v is None else round(float(v), d)

ours = []
for x in D[last]['rows']:
    if x['w'] not in UT9: continue
    ours.append(dict(w=x['w'], gor=(x['gor'] or '—').strip(),
                     qn=num(x['qn']), qzh=num(x['qzh'], 1), obv=num(x['obv'], 1),
                     series=[hist.get(x['w'], {}).get(mm) for mm in months]))
ours.sort(key=lambda r: (r['obv'] is None, -(r['obv'] or 0)))

# ── вклад наших скважин в обводнённость фонда ───────────────────────────────
# Замеры до работ, задокументированные на страницах скважин.
BEFORE = {'343': 89.4, '342': 91.0, '311': 90.5, '303': 95.0}
tot_qzh = sum(x['qzh'] for x in meas if x['qzh'] is not None)
tot_qv  = sum(x['qv']  for x in meas if x['qv']  is not None)
extra_qv = 0.0
counted = []
for x in meas:
    b = BEFORE.get(x['w'])
    if b is None or x['qzh'] is None: continue
    extra_qv += x['qzh'] * b / 100 - (x['qv'] or 0)
    counted.append(x['w'])
effect = dict(wells=sorted(counted),
              wcNow=round(tot_qv / tot_qzh * 100, 2),
              wcAlt=round((tot_qv + extra_qv) / tot_qzh * 100, 2),
              waterSaved=round(extra_qv, 1))
effect['delta'] = round(effect['wcAlt'] - effect['wcNow'], 2)

out = dict(updated='27.09.2026', monthsLabels=[MS[m] for m in months],
           ut9=UT9, wellsTotal=len(D[last]['rows']), measured=len(meas),
           series=series, dist=dist, horizons=horizons, ours=ours, effect=effect)

js = ("/* Обводнённость фонда: агрегаты по месяцам и собственные скважины ЭкоМикс.\n"
      "   Поскважинные данные остального фонда намеренно не выгружаются.\n"
      "   Пересобирается скриптом tools/mkfield.py. Обновлено: 27.09.2026. */\n"
      "window.FIELD = " + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ";\n")
io.open('/Users/damirsultan/Desktop/Wibecoding/nanocem.app/public/field.js', 'w', encoding='utf-8').write(js)
print('field.js: агрегатов по месяцам %d, наших скважин %d, размер %.1f КБ'
      % (len(series), len(ours), len(js) / 1024))
print('вклад: %s%% вместо %s%% (%s п.п.), вода %s м³/сут'
      % (effect['wcNow'], effect['wcAlt'], effect['delta'], effect['waterSaved']))
