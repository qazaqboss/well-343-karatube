#!/usr/bin/env python3
"""
Subsoil ERP — Управление скважинами, лицензиями и этапами недропользования
"""
from __future__ import annotations
import sqlite3, json, os, subprocess, sys, tempfile
from pathlib import Path
from datetime import date, timedelta
from typing import Optional, List
import uvicorn

VAULT       = Path(__file__).resolve().parent                 # server/
DB_PATH     = Path(os.getenv("DB_PATH", str(VAULT / "erp.db")))   # на проде — том Railway
REPORTS_DIR = Path(os.getenv("REPORTS_DIR", str(VAULT / "stage-reports")))
PORT        = int(os.getenv("ERP_PORT", "7778"))

STAGE_NAMES = {
    1: "Разведка", 2: "Оценка", 3: "Гос. Баланс",
    4: "Подготовительный", 5: "Полномасштабная добыча",
    6: "Ликвидация", 7: "Сдача территории",
}

# ── Pydantic models (module-level — required for FastAPI body parsing) ─────────
try:
    from pydantic import BaseModel as _BM
    class ContractCreate(_BM):
        number: str; company: str; territory: Optional[str]=None
        region: Optional[str]=None; contract_type: str="standard"
        current_stage: int=1; start_date: Optional[str]=None
        end_date: Optional[str]=None; notes: Optional[str]=None

    class WellCreate(_BM):
        contract_id: int; number: str; well_type: str="поисковая"
        category: str="C2"; depth_m: Optional[float]=None
        lat: Optional[float]=None; lng: Optional[float]=None
        spud_date: Optional[str]=None; notes: Optional[str]=None

    class DeadlineCreate(_BM):
        contract_id: int; stage_num: int; obligation: str
        due_date: str; risk_level: str="medium"; law_ref: Optional[str]=None

    class StatusPatch(_BM):
        status: str; notes: Optional[str]=None

    class ChatMsg(_BM):
        message: str; history: list=[]
        context: Optional[str]=None   # e.g. "contract:КЗ-2023-042"
except ImportError:
    ContractCreate=WellCreate=DeadlineCreate=StatusPatch=ChatMsg=None

# ── Первый запуск на постоянном томе: переносим стартовую базу ────────────────
def _seed_db_if_needed() -> None:
    """DB_PATH на проде указывает на том Railway, где при первом деплое пусто.

    Чтобы не потерять контракты и скважины, один раз копируем базу из репозитория.
    """
    seed = Path(__file__).resolve().parent / "erp.db"
    if DB_PATH == seed or DB_PATH.exists() or not seed.exists():
        return
    try:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        DB_PATH.write_bytes(seed.read_bytes())
        print(f"  ERP: стартовая база скопирована в {DB_PATH}")
    except Exception as e:
        print(f"⚠️  ERP: не удалось скопировать стартовую базу: {e}")


_seed_db_if_needed()


# ── DB helpers ─────────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

def row2dict(row):
    return dict(row) if row else None

def rows2list(rows):
    return [dict(r) for r in rows]

# ── Schema ─────────────────────────────────────────────────────────────────────
SCHEMA = """
CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY, number TEXT UNIQUE NOT NULL,
    company TEXT NOT NULL, territory TEXT, region TEXT,
    contract_type TEXT DEFAULT 'standard',
    current_stage INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    start_date TEXT, end_date TEXT, notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS stages (
    id INTEGER PRIMARY KEY, contract_id INTEGER REFERENCES contracts(id),
    num INTEGER NOT NULL, name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    planned_start TEXT, planned_end TEXT,
    actual_start TEXT, actual_end TEXT,
    budget_kzt REAL DEFAULT 0, budget_spent REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY,
    stage_id INTEGER REFERENCES stages(id),
    contract_id INTEGER REFERENCES contracts(id),
    name TEXT NOT NULL, doc_type TEXT DEFAULT 'project',
    deadline TEXT, authority TEXT,
    law_refs TEXT DEFAULT '[]',
    status TEXT DEFAULT 'pending',
    submitted_date TEXT, approved_date TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS wells (
    id INTEGER PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id),
    number TEXT NOT NULL, well_type TEXT DEFAULT 'поисковая',
    category TEXT DEFAULT 'C2', depth_m REAL,
    lat REAL, lng REAL,
    spud_date TEXT, completion_date TEXT,
    status TEXT DEFAULT 'active', notes TEXT
);
CREATE TABLE IF NOT EXISTS passports (
    id INTEGER PRIMARY KEY,
    well_id INTEGER REFERENCES wells(id),
    passport_type TEXT DEFAULT 'exploration',
    status TEXT DEFAULT 'draft',
    submitted_date TEXT, approved_date TEXT,
    registry_number TEXT,
    approving_authority TEXT DEFAULT 'МЭиПР РК', notes TEXT
);
CREATE TABLE IF NOT EXISTS test_objects (
    id INTEGER PRIMARY KEY,
    well_id INTEGER REFERENCES wells(id),
    obj_number INTEGER, layer_name TEXT,
    interval_top REAL, interval_bot REAL,
    fluid_type TEXT DEFAULT 'нефть',
    flow_rate REAL, pressure_reservoir REAL, pressure_bottom REAL,
    test_date TEXT, result TEXT DEFAULT 'продуктивный'
);
CREATE TABLE IF NOT EXISTS deadlines (
    id INTEGER PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id),
    stage_num INTEGER, obligation TEXT NOT NULL,
    due_date TEXT NOT NULL,
    risk_level TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    law_ref TEXT, notes TEXT
);
"""

def init_db():
    conn = get_db()
    conn.executescript(SCHEMA)
    if conn.execute("SELECT COUNT(*) FROM contracts").fetchone()[0] == 0:
        _seed(conn)
    conn.commit(); conn.close()

def _seed(conn):
    c = conn.cursor()
    today = date.today()

    def add_contract(num, company, terr, region, ctype, stage, start, end_y):
        c.execute("INSERT INTO contracts(number,company,territory,region,contract_type,"
                  "current_stage,status,start_date,end_date) VALUES(?,?,?,?,?,?,?,?,?)",
                  (num, company, terr, region, ctype, stage, "active", start,
                   str(date(today.year + end_y, today.month, today.day))))
        return c.lastrowid

    c1 = add_contract("КЗ-2023-042","IC Petroleum LLP","Блок Жазык",
                       "Актюбинская обл.","standard",2,"2023-03-15",3)
    c2 = add_contract("КЗ-2020-018","КазМунай Эксплор","Месторождение Каракол",
                       "Мангистауская обл.","complex",4,"2020-09-01",6)
    c3 = add_contract("КЗ-2017-007","МунайГаз Оператинг","Южный Карабасак",
                       "Кызылординская обл.","complex",5,"2017-05-20",8)

    # ── Stages for IC Petroleum (c1) ──
    stage_data = [
        (1,"Разведка","completed","2023-03-15","2024-03-14",150_000_000,142_000_000),
        (2,"Оценка","active","2024-03-15",str(date(today.year+1,3,14)),280_000_000,97_000_000),
        (3,"Гос. Баланс","pending",None,None,0,0),
        (4,"Подготовительный","pending",None,None,0,0),
        (5,"Полномасштабная добыча","pending",None,None,0,0),
        (6,"Ликвидация","pending",None,None,0,0),
        (7,"Сдача территории","pending",None,None,0,0),
    ]
    s_ids = {}
    for num, name, status, ps, pe, bgt, bsp in stage_data:
        c.execute("INSERT INTO stages(contract_id,num,name,status,planned_start,planned_end,"
                  "actual_start,actual_end,budget_kzt,budget_spent) VALUES(?,?,?,?,?,?,?,?,?,?)",
                  (c1, num, name, status, ps, pe,
                   ps if status in ("completed","active") else None,
                   pe if status=="completed" else None, bgt, bsp))
        s_ids[num] = c.lastrowid

    # ── Documents for Stage 2 ──
    for name, dtype, days, auth, refs, status in [
        ("Проект разведочных работ (оценочный)","project",45,"МЭиПР РК",
         '["КОНН ст.134","КОНН ст.135"]',"submitted"),
        ("Проект пробной эксплуатации","project",90,"МЭиПР РК",
         '["КОНН ст.136"]',"pending"),
        ("Паспорт скважины (оценочная ЖЗ-2)","passport",30,"МЭиПР РК",
         '["КОНН ст.134","Приказ МЭ №355"]',"pending"),
        ("Оперативный подсчёт запасов","geological",120,"ГКЗ МЭиПР РК",
         '["КОНН ст.109"]',"pending"),
        ("Отчёт авторского надзора (ПЭ)","report",180,"МЭиПР РК",
         '["КОНН ст.142"]',"pending"),
        ("ОВОС / РООС","project",20,"Уполномоченный орган ООС",
         '["ЭК РК ст.67"]',"pending"),
    ]:
        c.execute("INSERT INTO documents(stage_id,contract_id,name,doc_type,deadline,"
                  "authority,law_refs,status) VALUES(?,?,?,?,?,?,?,?)",
                  (s_ids[2], c1, name, dtype,
                   str(today + timedelta(days=days)), auth, refs, status))

    # ── Wells for IC Petroleum ──
    wells_c1 = [
        ("ЖЗ-1","поисковая","C2",2850.0,48.3421,57.8843,"2023-06-10","2023-10-15","completed"),
        ("ЖЗ-2","оценочная","C1",3120.0,48.3512,57.9021,"2024-02-20","2024-07-30","active"),
        ("ЖЗ-3","оценочная","C2",3050.0,48.3298,57.8754,"2024-06-01",None,"active"),
    ]
    w_ids = []
    for num, wt, cat, d, lat, lng, spud, compl, st in wells_c1:
        c.execute("INSERT INTO wells(contract_id,number,well_type,category,depth_m,"
                  "lat,lng,spud_date,completion_date,status) VALUES(?,?,?,?,?,?,?,?,?,?)",
                  (c1, num, wt, cat, d, lat, lng, spud, compl, st))
        w_ids.append(c.lastrowid)

    # Passport for ЖЗ-2
    c.execute("INSERT INTO passports(well_id,passport_type,status,submitted_date) VALUES(?,?,?,?)",
              (w_ids[1],"exploration","submitted",str(today-timedelta(days=10))))

    # Test objects for ЖЗ-2
    for n, layer, top, bot, fluid, flow, pr, pb in [
        (1,"П-1",2100.0,2140.0,"газ",15.2,198.5,182.1),
        (2,"К-2",2380.0,2410.0,"нефть",48.7,245.3,228.8),
        (3,"К-3",2540.0,2580.0,"нефть",72.3,268.9,251.2),
        (4,"Ю-4",2780.0,2820.0,"нефть",91.5,287.4,269.8),
        (5,"Ю-5",3050.0,3095.0,"нефть",58.2,301.7,284.3),
    ]:
        c.execute("INSERT INTO test_objects(well_id,obj_number,layer_name,interval_top,"
                  "interval_bot,fluid_type,flow_rate,pressure_reservoir,pressure_bottom,test_date)"
                  " VALUES(?,?,?,?,?,?,?,?,?,?)",
                  (w_ids[1],n,layer,top,bot,fluid,flow,pr,pb,str(today-timedelta(days=30))))

    # ── Deadlines for IC Petroleum ──
    for stage_n, obl, days, risk, law in [
        (2,"Согласование ОВОС/РООС",20,"critical","ЭК РК ст.67"),
        (2,"Паспорт скважины ЖЗ-2",30,"high","КОНН ст.134 + Приказ МЭ №355"),
        (2,"Подача проекта разведочных работ (оценочный)",45,"high","КОНН ст.134"),
        (2,"Квартальный отчёт по ПЭ",15,"medium","ЕПРКИН п.47"),
        (2,"Уплата бонуса за коммерческое обнаружение",-5,"critical","КОНН ст.98"),
        (2,"Передача данных о запасах в фонды",120,"medium","КОНН ст.109"),
        (2,"Авторнадзор — квартальный выезд",60,"low","КОНН ст.142"),
    ]:
        due = today + timedelta(days=days)
        status = "overdue" if due < today else "pending"
        c.execute("INSERT INTO deadlines(contract_id,stage_num,obligation,due_date,"
                  "risk_level,status,law_ref) VALUES(?,?,?,?,?,?,?)",
                  (c1, stage_n, obl, str(due), risk, status, law))

    # ── Wells for KazMunai (c2, Stage 4) ──
    for num, wt, cat, d in [
        ("КР-1","добывающая","B",4200.0),("КР-2","добывающая","B",4180.0),
        ("КР-3","нагнетательная","B",4220.0),("КР-4","добывающая","C1",4150.0),
        ("КР-5","опережающе-добывающая","C1",4300.0),
    ]:
        c.execute("INSERT INTO wells(contract_id,number,well_type,category,depth_m,status)"
                  " VALUES(?,?,?,?,?,?)",(c2,num,wt,cat,d,"active"))

    # ── Wells for MunaiGaz (c3, Stage 5) ──
    for num, wt, cat, d in [
        ("КБ-1","добывающая","A",3800.0),("КБ-2","добывающая","A",3750.0),
        ("КБ-3","нагнетательная","A",3820.0),("КБ-4","добывающая","B",3790.0),
        ("КБ-5","добывающая","B",3810.0),("КБ-6","наблюдательная","B",3760.0),
    ]:
        c.execute("INSERT INTO wells(contract_id,number,well_type,category,depth_m,status)"
                  " VALUES(?,?,?,?,?,?)",(c3,num,wt,cat,d,"active"))

# ── FastAPI app ────────────────────────────────────────────────────────────────
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Subsoil ERP", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root(request: Request):
    """Отдаём UI, подставив базовый путь.

    Приложение работает и самостоятельно (root_path == ""), и смонтированным
    внутрь сайта под /erp — тогда все ссылки сами уезжают на /erp/...
    """
    html = (VAULT / "erp.html").read_text(encoding="utf-8")
    base = (request.scope.get("root_path") or "").rstrip("/")
    if base:
        html = html.replace("const API = '';", f"const API = '{base}';", 1)
        html = html.replace('href="/reports/', f'href="{base}/reports/')
        html = html.replace("window.open(`/reports/", f"window.open(`{base}/reports/")
        html = html.replace('href="/stage-reports/', f'href="{base}/stage-reports/')
    return HTMLResponse(html)

# ── Dashboard ──────────────────────────────────────────────────────────────────
@app.get("/api/dashboard")
def dashboard():
    db = get_db(); today = str(date.today())
    in30 = str(date.today() + timedelta(days=30))

    contracts    = db.execute("SELECT COUNT(*) FROM contracts WHERE status='active'").fetchone()[0]
    wells        = db.execute("SELECT COUNT(*) FROM wells WHERE status='active'").fetchone()[0]
    pending_pass = db.execute("SELECT COUNT(*) FROM passports WHERE status IN ('draft','submitted')").fetchone()[0]
    overdue      = db.execute("SELECT COUNT(*) FROM deadlines WHERE status='overdue'").fetchone()[0]

    deadlines = rows2list(db.execute(
        "SELECT d.*, c.company, c.number AS contract_number FROM deadlines d "
        "JOIN contracts c ON c.id=d.contract_id "
        "WHERE d.due_date <= ? AND d.status!='completed' ORDER BY d.due_date LIMIT 10",
        (in30,)).fetchall())

    stage_dist = rows2list(db.execute(
        "SELECT current_stage, COUNT(*) as cnt FROM contracts "
        "GROUP BY current_stage ORDER BY current_stage").fetchall())

    passports = rows2list(db.execute(
        "SELECT p.*, w.number AS well_number, c.company FROM passports p "
        "JOIN wells w ON w.id=p.well_id "
        "JOIN contracts c ON c.id=w.contract_id "
        "WHERE p.status IN ('draft','submitted') LIMIT 5").fetchall())

    db.close()
    return {"contracts": contracts, "wells": wells,
            "pending_passports": pending_pass, "overdue_deadlines": overdue,
            "upcoming_deadlines": deadlines, "stage_distribution": stage_dist,
            "pending_passport_list": passports}

# ── Contracts ─────────────────────────────────────────────────────────────────
@app.get("/api/contracts")
def list_contracts(stage: Optional[int]=None, status: Optional[str]=None):
    db = get_db()
    q = "SELECT * FROM contracts WHERE 1=1"
    p = []
    if stage:  q += " AND current_stage=?"; p.append(stage)
    if status: q += " AND status=?";        p.append(status)
    rows = rows2list(db.execute(q + " ORDER BY id", p).fetchall())
    db.close()
    return rows

@app.get("/api/contracts/{cid}")
def get_contract(cid: int):
    db = get_db()
    c = row2dict(db.execute("SELECT * FROM contracts WHERE id=?", (cid,)).fetchone())
    if not c: raise HTTPException(404, "Contract not found")
    c["stages"]    = rows2list(db.execute(
        "SELECT * FROM stages WHERE contract_id=? ORDER BY num", (cid,)).fetchall())
    c["wells"]     = rows2list(db.execute(
        "SELECT w.*, p.status AS passport_status FROM wells w "
        "LEFT JOIN passports p ON p.well_id=w.id "
        "WHERE w.contract_id=? ORDER BY w.id", (cid,)).fetchall())
    c["deadlines"] = rows2list(db.execute(
        "SELECT * FROM deadlines WHERE contract_id=? ORDER BY due_date", (cid,)).fetchall())
    # Documents per stage
    stage_ids = [s["id"] for s in c["stages"]]
    if stage_ids:
        placeholders = ",".join("?" * len(stage_ids))
        c["documents"] = rows2list(db.execute(
            f"SELECT * FROM documents WHERE stage_id IN ({placeholders}) ORDER BY deadline",
            stage_ids).fetchall())
    else:
        c["documents"] = []
    db.close()
    return c

@app.post("/api/contracts")
def create_contract(body: ContractCreate):
    db = get_db()
    try:
        db.execute(
            "INSERT INTO contracts(number,company,territory,region,contract_type,"
            "current_stage,start_date,end_date,notes) VALUES(?,?,?,?,?,?,?,?,?)",
            (body.number, body.company, body.territory, body.region, body.contract_type,
             body.current_stage, body.start_date, body.end_date, body.notes))
        cid = db.execute("SELECT last_insert_rowid()").fetchone()[0]
        # auto-create 7 stages
        for n, name in STAGE_NAMES.items():
            status = "active" if n == body.current_stage else "pending"
            db.execute("INSERT INTO stages(contract_id,num,name,status) VALUES(?,?,?,?)",
                       (cid, n, name, status))
        db.commit(); db.close()
        return {"id": cid, "message": "created"}
    except sqlite3.IntegrityError:
        raise HTTPException(409, "Contract number already exists")

@app.patch("/api/contracts/{cid}")
def patch_contract(cid: int, body: StatusPatch):
    db = get_db()
    db.execute("UPDATE contracts SET status=? WHERE id=?", (body.status, cid))
    db.commit(); db.close()
    return {"ok": True}

# ── Documents ─────────────────────────────────────────────────────────────────
@app.patch("/api/documents/{did}")
def patch_document(did: int, body: StatusPatch):
    db = get_db()
    today = str(date.today())
    if body.status == "submitted":
        db.execute("UPDATE documents SET status=?,submitted_date=?,notes=? WHERE id=?",
                   (body.status, today, body.notes, did))
    elif body.status == "approved":
        db.execute("UPDATE documents SET status=?,approved_date=?,notes=? WHERE id=?",
                   (body.status, today, body.notes, did))
    else:
        db.execute("UPDATE documents SET status=?,notes=? WHERE id=?",
                   (body.status, body.notes, did))
    db.commit(); db.close()
    return {"ok": True}

# ── Deadlines ─────────────────────────────────────────────────────────────────
@app.get("/api/deadlines")
def list_deadlines(days: int=30, contract_id: Optional[int]=None):
    db = get_db()
    cutoff = str(date.today() + timedelta(days=days))
    q = ("SELECT d.*,c.company,c.number AS contract_number FROM deadlines d "
         "JOIN contracts c ON c.id=d.contract_id WHERE d.due_date<=? AND d.status!='completed'")
    p = [cutoff]
    if contract_id: q += " AND d.contract_id=?"; p.append(contract_id)
    rows = rows2list(db.execute(q + " ORDER BY d.due_date", p).fetchall())
    db.close()
    return rows

@app.patch("/api/deadlines/{did}")
def patch_deadline(did: int, body: StatusPatch):
    db = get_db()
    db.execute("UPDATE deadlines SET status=? WHERE id=?", (body.status, did))
    db.commit(); db.close()
    return {"ok": True}

@app.post("/api/deadlines")
def create_deadline(body: DeadlineCreate):
    db = get_db()
    db.execute("INSERT INTO deadlines(contract_id,stage_num,obligation,due_date,"
               "risk_level,law_ref) VALUES(?,?,?,?,?,?)",
               (body.contract_id, body.stage_num, body.obligation, body.due_date,
                body.risk_level, body.law_ref))
    db.commit(); db.close()
    return {"ok": True}

# ── Wells ─────────────────────────────────────────────────────────────────────
@app.get("/api/wells")
def list_wells(contract_id: Optional[int]=None):
    db = get_db()
    if contract_id:
        rows = rows2list(db.execute(
            "SELECT w.*,c.company,c.number AS contract_number,"
            "p.status AS passport_status FROM wells w "
            "JOIN contracts c ON c.id=w.contract_id "
            "LEFT JOIN passports p ON p.well_id=w.id "
            "WHERE w.contract_id=? ORDER BY w.id", (contract_id,)).fetchall())
    else:
        rows = rows2list(db.execute(
            "SELECT w.*,c.company,c.number AS contract_number,"
            "p.status AS passport_status FROM wells w "
            "JOIN contracts c ON c.id=w.contract_id "
            "LEFT JOIN passports p ON p.well_id=w.id ORDER BY w.id").fetchall())
    db.close()
    return rows

@app.get("/api/wells/{wid}")
def get_well(wid: int):
    db = get_db()
    w = row2dict(db.execute(
        "SELECT w.*,c.company,c.number AS contract_number FROM wells w "
        "JOIN contracts c ON c.id=w.contract_id WHERE w.id=?", (wid,)).fetchone())
    if not w: raise HTTPException(404, "Well not found")
    w["passport"]     = row2dict(db.execute(
        "SELECT * FROM passports WHERE well_id=?", (wid,)).fetchone())
    w["test_objects"] = rows2list(db.execute(
        "SELECT * FROM test_objects WHERE well_id=? ORDER BY obj_number", (wid,)).fetchall())
    db.close()
    return w

@app.post("/api/wells")
def create_well(body: WellCreate):
    db = get_db()
    db.execute("INSERT INTO wells(contract_id,number,well_type,category,depth_m,"
               "lat,lng,spud_date,notes) VALUES(?,?,?,?,?,?,?,?,?)",
               (body.contract_id, body.number, body.well_type, body.category,
                body.depth_m, body.lat, body.lng, body.spud_date, body.notes))
    wid = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    # auto-create draft passport
    db.execute("INSERT INTO passports(well_id,passport_type) VALUES(?,?)",
               (wid, "exploration"))
    db.commit(); db.close()
    return {"id": wid, "message": "created"}

@app.patch("/api/wells/{wid}")
def patch_well(wid: int, body: StatusPatch):
    db = get_db()
    db.execute("UPDATE wells SET status=?,notes=? WHERE id=?", (body.status, body.notes, wid))
    db.commit(); db.close()
    return {"ok": True}

# ── Passports ─────────────────────────────────────────────────────────────────
@app.patch("/api/passports/{pid}")
def patch_passport(pid: int, body: StatusPatch):
    db = get_db(); today = str(date.today())
    if body.status == "submitted":
        db.execute("UPDATE passports SET status=?,submitted_date=? WHERE id=?",
                   (body.status, today, pid))
    elif body.status == "approved":
        db.execute("UPDATE passports SET status=?,approved_date=? WHERE id=?",
                   (body.status, today, pid))
    else:
        db.execute("UPDATE passports SET status=? WHERE id=?", (body.status, pid))
    db.commit(); db.close()
    return {"ok": True}

# ── PDF Reports ────────────────────────────────────────────────────────────────
@app.get("/reports/stage/{n}")
def stage_report(n: int):
    pdfs = list(REPORTS_DIR.glob(f"Otchet-Etap-{n}-*.pdf"))
    if pdfs:
        return FileResponse(str(pdfs[0]), media_type="application/pdf",
                            headers={"Content-Disposition": f"inline; filename=Otchet-Etap-{n}.pdf"})
    raise HTTPException(404, f"Отчёт по Этапу {n} не найден")

@app.get("/reports/stages-complete")
def stages_complete():
    pdf = VAULT / "IC_Petroleum_Stages_Complete.pdf"
    if pdf.exists():
        return FileResponse(str(pdf), media_type="application/pdf")
    raise HTTPException(404, "Полный отчёт по этапам не найден")

@app.get("/reports/welltest")
def welltest_report():
    pdf = VAULT / "IC_Petroleum_90day_Testing.pdf"
    if pdf.exists():
        return FileResponse(str(pdf), media_type="application/pdf")
    raise HTTPException(404, "Отчёт об испытании скважины не найден")

def _disposition(filename: str, ascii_fallback: str, inline: bool = True) -> str:
    """Content-Disposition, переживающий кириллицу в имени файла.

    HTTP-заголовки кодируются latin-1, поэтому «ЖЗ-2» роняет ответ. Даём
    ASCII-имя для старых клиентов и UTF-8 по RFC 5987 для остальных.
    """
    from urllib.parse import quote
    kind = "inline" if inline else "attachment"
    return f"{kind}; filename=\"{ascii_fallback}\"; filename*=UTF-8''{quote(filename)}"


@app.get("/reports/passport/{wid}")
def passport_report(wid: int):
    db = get_db()
    w = row2dict(db.execute(
        "SELECT w.*,c.company,c.number AS cn FROM wells w "
        "JOIN contracts c ON c.id=w.contract_id WHERE w.id=?", (wid,)).fetchone())
    p = row2dict(db.execute("SELECT * FROM passports WHERE well_id=?", (wid,)).fetchone())
    objs = rows2list(db.execute(
        "SELECT * FROM test_objects WHERE well_id=? ORDER BY obj_number", (wid,)).fetchall())
    db.close()
    if not w: raise HTTPException(404, "Well not found")

    out = _gen_passport_pdf(w, p, objs)
    name = f"Passport_{w['number'].replace('-', '')}.pdf"
    return FileResponse(str(out), media_type="application/pdf",
                        headers={"Content-Disposition": _disposition(name, f"Passport_{wid}.pdf")})

# ── Шрифт для PDF ─────────────────────────────────────────────────────────────
_FONT_CANDIDATES = [
    "/Library/Fonts/Arial Unicode.ttf",                       # macOS
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",   # macOS (новые)
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",        # Debian/Ubuntu
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",                 # прочие Linux
]


def _font_path() -> str:
    """Первый доступный юникодный TTF. Без него кириллица в PDF не отрисуется."""
    env = os.getenv("PDF_FONT")
    if env and Path(env).exists():
        return env
    for c in _FONT_CANDIDATES:
        if Path(c).exists():
            return c
    return ""


def _gen_passport_pdf(w, p, objs) -> Path:
    """Generate a well passport PDF via /tmp/pdf_venv to avoid iCloud mmap issue."""
    _FONT = _font_path()
    _pd = p or {}
    _ptype = _pd.get("passport_type", "exploration")
    _pstatus = _pd.get("status", "draft")
    script = f"""
from fpdf import FPDF
from pathlib import Path
import json

FONT = "{_FONT}"
OUT  = "/tmp/passport_{w['id']}.pdf"

class PDF(FPDF):
    def header(self):
        self.add_font("U","",FONT)
        self.set_font("U",size=7)
        self.set_fill_color(8,38,78)
        self.set_text_color(255,255,255)
        self.cell(0,8,"  ПАСПОРТ СКВАЖИНЫ  |  {w.get('company','')}  |  Контракт {w.get('cn','')}",fill=True,new_x="LMARGIN",new_y="NEXT")
        self.set_text_color(15,15,15)

pdf = PDF("P","mm","A4")
pdf.add_font("U","",FONT)
pdf.add_page()
pdf.set_font("U",size=13)
pdf.set_fill_color(8,38,78); pdf.set_text_color(255,255,255)
pdf.cell(0,12,"  ПАСПОРТ СКВАЖИНЫ",fill=True,new_x="LMARGIN",new_y="NEXT")
pdf.set_text_color(15,15,15); pdf.ln(3)

pdf.set_font("U",size=10)
pdf.set_fill_color(218,232,255)
rows = [
    ("Номер скважины", "{w['number']}"),
    ("Тип скважины",   "{w['well_type']}"),
    ("Категория",      "{w['category']}"),
    ("Глубина, м",     "{w.get('depth_m','—')}"),
    ("Статус",         "{w.get('status','—')}"),
    ("Дата забуривания","{w.get('spud_date','—')}"),
    ("Дата завершения", "{w.get('completion_date','—')}"),
    ("Тип паспорта",   "{_ptype}"),
    ("Статус паспорта","{_pstatus}"),
    ("Утверждающий орган","МЭиПР РК"),
    ("Нормативная база","КОНН РК ст.134-135 | Приказ МЭ РК №355"),
]
for label, val in rows:
    pdf.set_fill_color(218,232,255)
    pdf.cell(70,7,f"  {{label}}",fill=True,border="B")
    pdf.set_fill_color(255,255,255)
    pdf.cell(114,7,f"  {{val}}",fill=True,border="B",new_x="LMARGIN",new_y="NEXT")

objs = {json.dumps(objs)}
if objs:
    pdf.ln(5)
    pdf.set_font("U",size=10)
    pdf.set_fill_color(8,38,78); pdf.set_text_color(255,255,255)
    pdf.cell(0,8,"  ОБЪЕКТЫ ИСПЫТАНИЯ",fill=True,new_x="LMARGIN",new_y="NEXT")
    pdf.set_text_color(15,15,15); pdf.set_font("U",size=8)
    for hdr,w_ in [("№",10),("Пласт",28),("Кров,м",25),("Под,м",25),("Флюид",25),("Дебит,м³/сут",37),("Рпл,атм",24)]:
        pdf.set_fill_color(25,80,160); pdf.set_text_color(255,255,255)
        pdf.cell(w_,7,hdr,fill=True,border=1)
    pdf.ln()
    pdf.set_text_color(15,15,15)
    for o in objs:
        pdf.set_fill_color(255,255,255)
        for val,w_ in [(str(o.get('obj_number','')),10),(str(o.get('layer_name','')),28),
                       (str(o.get('interval_top','')),25),(str(o.get('interval_bot','')),25),
                       (str(o.get('fluid_type','')),25),(str(o.get('flow_rate','')),37),
                       (str(o.get('pressure_reservoir','')),24)]:
            pdf.cell(w_,6,val,border=1)
        pdf.ln()

pdf.output(OUT)
print("OK:" + OUT)
"""
    venv_py = Path("/tmp/pdf_venv/bin/python3")
    py = str(venv_py) if venv_py.exists() else sys.executable
    try:
        result = subprocess.run([py, "-c", script], capture_output=True,
                                text=True, timeout=30)
    except subprocess.TimeoutExpired:
        raise HTTPException(504, "Генерация PDF заняла слишком долго")
    for line in result.stdout.splitlines():
        if line.startswith("OK:"):
            return Path(line[3:])
    raise HTTPException(503, "Не удалось сгенерировать паспорт: "
                             f"{(result.stderr or '').strip()[-300:] or 'неизвестная ошибка'}")

# ── AI Chat proxy ──────────────────────────────────────────────────────────────
_AI_CACHE: list = []


def _get_ai():
    """Один экземпляр SubsoilAI на процесс.

    Когда ERP смонтирован внутрь сайта, subsoil_ai уже загружен — берём его из
    sys.modules, а не перечитываем файл на каждый запрос.
    """
    if _AI_CACHE:
        return _AI_CACHE[0]

    mod = sys.modules.get("subsoil_ai") or sys.modules.get("__main__")
    if mod is None or not hasattr(mod, "SubsoilAI"):
        ai_mod = VAULT / "subsoil_ai.py"
        if not ai_mod.exists():
            raise RuntimeError("AI-модуль не найден. Запустите subsoil_ai.py.")
        importlib = __import__("importlib.util", fromlist=["util"])
        spec = importlib.spec_from_file_location("subsoil_ai", str(ai_mod))
        mod = importlib.module_from_spec(spec)
        sys.modules["subsoil_ai"] = mod
        spec.loader.exec_module(mod)

    _AI_CACHE.append(mod.SubsoilAI())
    return _AI_CACHE[0]


@app.post("/api/chat")
async def chat(req: ChatMsg):
    import asyncio
    try:
        ai = _get_ai()
        ai._history = list(req.history)
        ctx = f"\n\n[Контекст ERP: {req.context}]" if req.context else ""
        loop = asyncio.get_event_loop()
        answer = await loop.run_in_executor(None, ai.ask, req.message + ctx)
        return {"answer": answer}
    except Exception as e:
        return JSONResponse({"answer": f"Ошибка AI: {e}"})

# ── Static stage-reports ───────────────────────────────────────────────────────
from fastapi.staticfiles import StaticFiles
if REPORTS_DIR.exists():
    app.mount("/stage-reports", StaticFiles(directory=str(REPORTS_DIR)), name="stage-reports")

# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    is_prod = bool(os.getenv("RAILWAY_ENVIRONMENT") or os.getenv("RENDER"))
    host = "0.0.0.0" if is_prod else "127.0.0.1"
    print(f"\n{'='*60}")
    print(f"  Subsoil ERP — Открой в браузере: http://localhost:{PORT}")
    print(f"{'='*60}\n")
    uvicorn.run(app, host=host, port=PORT, log_level="warning")
