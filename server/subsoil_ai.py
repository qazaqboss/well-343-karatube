#!/usr/bin/env python3
"""
Subsoil AI — Интеллектуальный помощник недропользователя РК
Использует базу знаний Obsidian vault + Claude API

Режимы запуска:
  python subsoil_ai.py           # интерактивный CLI
  python subsoil_ai.py --watch   # синхронизация с AI-Chat.md (Obsidian)
  python subsoil_ai.py --web     # веб-интерфейс на localhost:8765
"""

from __future__ import annotations

import os
import sys
import re
import time
import json
import argparse
import textwrap
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict

# ─────────────────────────────────────────────────────────────────────────────
# Константы
# ─────────────────────────────────────────────────────────────────────────────

SERVER_DIR = Path(__file__).resolve().parent          # server/
SITE_ROOT  = SERVER_DIR.parent                        # корень репозитория (статика сайта)
VAULT_ROOT = SITE_ROOT / "vault"                      # Obsidian-мозг
CHAT_FILE  = VAULT_ROOT / "AI-Chat.md"
LOGS_DIR   = VAULT_ROOT / "99-Chat-Logs"
MODEL      = "claude-sonnet-4-6"

PLACEHOLDER = "_введи вопрос здесь_"
QUESTION_MARKER = "<!-- ВОПРОС -->"
QUESTION_END    = "<!-- КОНЕЦ_ВОПРОСА -->"

# ─────────────────────────────────────────────────────────────────────────────
# Приоритетные файлы базы знаний (всегда включаются в контекст)
# ─────────────────────────────────────────────────────────────────────────────

PRIORITY_FILES = [
    "90-AI-Training/90.01-System-Prompt.md",
    "90-AI-Training/90.03-Few-Shot-Examples.md",
    "90-AI-Training/90.06-Reasoning-Chains.md",
    "90-AI-Training/90.07-Edge-Cases.md",
    "00-MOC/00-Home.md",
    "10-Foundations/10.04-Key-Terminology.md",
    "10-Foundations/10.03-Contract-Complexity.md",
    "10-Foundations/10.07-Mental-Models.md",
    "10-Foundations/10.05-Regulatory-Map.md",
    "25-Wells/25.00-Karatobe-Fund-MOC.md",
]

# Ключевые слова → этапы (для умного выбора контекста)
STAGE_KEYWORDS = {
    "1": ["разведк", "поисков", "exploration", "первый этап", "этап 1"],
    "2": ["оценк", "оценочн", "evaluation", "залеж", "приток", "этап 2"],
    "3": ["баланс", "гкз", "запас", "подсчёт", "пересчёт", "этап 3"],
    "4": ["подготовит", "preparatory", "этап 4"],
    "5": ["полномасшт", "добыч", "разработк", "full", "этап 5", "крупн"],
    "6": ["ликвидац", "ликвидир", "liquidat", "этап 6"],
    "7": ["сдач", "возврат", "return", "этап 7", "территори"],
}

STAGE_DIRS = {
    "1": "20-Stages/20.01-Exploration/",
    "2": "20-Stages/20.02-Evaluation/",
    "3": "20-Stages/20.03-State-Balance/",
    "4": "20-Stages/20.04-Preparatory/",
    "5": "20-Stages/20.05-Full-Development/",
    "6": "20-Stages/20.06-Liquidation/",
    "7": "20-Stages/20.07-Territory-Return/",
}

# Ключевые слова для тематических разделов
TOPIC_KEYWORDS = {
    "regulation": ["конн", "ст.", "статья", "кодекс", "эк рк", "епркин", "приказ", "закон", "норм"],
    "authority":  ["орган", "мэипр", "гкз", "цкрр", "мд ", "нгс", "согласован", "экспертиз", "министер"],
    "workflow":   ["платеж", "паспорт", "надзор", "скважин", "подрядчик", "срок", "штраф", "90 дн", "веха"],
    "role":       ["оператор", "буровой", "геофизич", "тампонаж", "юрист", "подрядчик"],
    "wells":      ["скважин", "обводнён", "обводнен", "дебит", "рир", "цпд", "изоляц", "водоприток",
                   "nanocem", "нанацем", "ut-9", "ut9", "каратюбе", "каратобе", "343", "342", "301",
                   "303", "305", "311", "акц", "эмдс", "заколон", "перфорац", "насос", "об/мин",
                   "фонд", "добыч", "ндин", "цемент"],
}


# ─────────────────────────────────────────────────────────────────────────────
# Загрузка базы знаний
# ─────────────────────────────────────────────────────────────────────────────

def read_md(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return ""


def detect_stages(query: str) -> list[str]:
    q = query.lower()
    stages = []
    for stage_num, keywords in STAGE_KEYWORDS.items():
        if any(kw in q for kw in keywords):
            stages.append(stage_num)
    for m in re.findall(r"(?:этап[еа]?|phase|стади[яи])\s*[№#]?\s*([1-7])", q):
        if m not in stages:
            stages.append(m)
    return stages


def build_knowledge_base(query: str) -> str:
    """Собрать релевантные файлы vault'а в строку контекста."""
    parts: list[str] = []
    included: set[str] = set()

    def add(rel: str) -> None:
        if rel in included:
            return
        included.add(rel)
        text = read_md(VAULT_ROOT / rel)
        if text.strip():
            sep = "─" * 60
            parts.append(f"\n\n{sep}\n📄 ФАЙЛ: {rel}\n{sep}\n{text.strip()}")

    # 1. Приоритетные файлы
    for p in PRIORITY_FILES:
        add(p)

    # 2. Все FAQ
    faq_dir = VAULT_ROOT / "95-FAQ"
    if faq_dir.exists():
        for f in sorted(faq_dir.glob("*.md")):
            add(f"95-FAQ/{f.name}")

    # 3. Обзорные файлы регуляторики
    for r in ["40-KONN-Overview.md", "40-EK-Overview.md", "40-EPRKIN-Overview.md"]:
        add(f"40-Regulations/{r}")

    # 4. Ключевые статьи — всегда
    for art in [
        "40-KONN-Art-134.md", "40-KONN-Art-135.md", "40-KONN-Art-136.md",
        "40-KONN-Art-137.md", "40-KONN-Art-138.md", "40-KONN-Art-142.md",
        "40-KONN-Art-119.md", "40-KONN-Art-107.md",
        "40-EK-Art-67.md",    "40-EK-Art-68.md",
    ]:
        add(f"40-Regulations/{art}")

    # 5. Все обзоры этапов 20.X.00-Overview (лёгкие файлы)
    for stage_dir in STAGE_DIRS.values():
        for f in sorted((VAULT_ROOT / stage_dir).glob("20.*00-Overview.md")):
            add(f"{stage_dir}{f.name}")

    # 6. Детали этапов по запросу
    for stage in detect_stages(query):
        sd = STAGE_DIRS.get(stage)
        if sd and (VAULT_ROOT / sd).exists():
            for f in sorted((VAULT_ROOT / sd).glob("*.md")):
                add(f"{sd}{f.name}")

    # 7. Тематические разделы по ключевым словам
    q = query.lower()
    if any(kw in q for kw in TOPIC_KEYWORDS["regulation"]):
        for f in sorted((VAULT_ROOT / "40-Regulations").glob("*.md")):
            add(f"40-Regulations/{f.name}")

    if any(kw in q for kw in TOPIC_KEYWORDS["authority"]):
        for f in sorted((VAULT_ROOT / "50-Authorities").glob("*.md")):
            add(f"50-Authorities/{f.name}")

    if any(kw in q for kw in TOPIC_KEYWORDS["workflow"]):
        for f in sorted((VAULT_ROOT / "70-Workflows").glob("*.md")):
            add(f"70-Workflows/{f.name}")

    if any(kw in q for kw in TOPIC_KEYWORDS["role"]):
        for f in sorted((VAULT_ROOT / "60-Roles").glob("*.md")):
            add(f"60-Roles/{f.name}")

    # Промысел: фонд Каратюбе, изоляция водопритока, режимы скважин
    if any(kw in q for kw in TOPIC_KEYWORDS["wells"]):
        for f in sorted((VAULT_ROOT / "25-Wells").glob("*.md")):
            add(f"25-Wells/{f.name}")

    return "".join(parts)


# ─────────────────────────────────────────────────────────────────────────────
# Живые данные ERP (erp.db) — реальные контракты, скважины, сроки
# ─────────────────────────────────────────────────────────────────────────────

ERP_DB = Path(os.getenv("DB_PATH", str(SERVER_DIR / "erp.db")))


def _erp_rows(conn, sql: str, params: tuple = ()) -> list:
    try:
        return conn.execute(sql, params).fetchall()
    except Exception:
        return []


def build_erp_context() -> str:
    """Снимок реальных данных ERP для системного промпта.

    Бот отвечает не только по нормативке, но и по фактическому портфелю:
    какие контракты ведём, на каком этапе, что горит по срокам.
    """
    if not ERP_DB.exists():
        return ""

    import sqlite3
    try:
        conn = sqlite3.connect(f"file:{ERP_DB}?mode=ro", uri=True)
        conn.row_factory = sqlite3.Row
    except Exception:
        return ""

    today = datetime.now().date().isoformat()
    out: list[str] = []

    try:
        contracts = _erp_rows(conn,
            "SELECT id, number, company, territory, region, contract_type, "
            "current_stage, status, start_date, end_date FROM contracts ORDER BY number")
        if not contracts:
            return ""

        out.append("Это фактические данные из ERP-системы компании (erp.db). "
                   "Используй их, когда вопрос про «наши»/конкретные контракты, "
                   "скважины или сроки. Нормативные выводы всё равно подкрепляй статьями.")

        for c in contracts:
            out.append(
                f"\n▸ КОНТРАКТ {c['number']} — {c['company']}\n"
                f"  Этап: {c['current_stage']} ({STAGE_NAMES_ERP.get(c['current_stage'], '?')})"
                f" | Статус: {c['status']} | Тип: {c['contract_type']}\n"
                f"  Территория: {c['territory'] or '—'}, {c['region'] or '—'}\n"
                f"  Срок: {c['start_date'] or '—'} → {c['end_date'] or '—'}"
            )

            wells = _erp_rows(conn,
                "SELECT number, well_type, category, depth_m, status, spud_date "
                "FROM wells WHERE contract_id=? ORDER BY number", (c["id"],))
            if wells:
                out.append("  Скважины:")
                for w in wells:
                    depth = f"{w['depth_m']:.0f} м" if w["depth_m"] is not None else "глубина —"
                    out.append(
                        f"    • {w['number']} — {w['well_type']}, кат. {w['category']}, "
                        f"{depth}, статус {w['status']}, забурена {w['spud_date'] or '—'}"
                    )

            dls = _erp_rows(conn,
                "SELECT obligation, due_date, risk_level, status, law_ref, stage_num "
                "FROM deadlines WHERE contract_id=? ORDER BY due_date", (c["id"],))
            if dls:
                out.append("  Сроки и обязательства:")
                for d in dls:
                    mark = "ПРОСРОЧЕНО" if (d["due_date"] or "") < today and d["status"] != "completed" else d["status"]
                    out.append(
                        f"    • до {d['due_date']} — {d['obligation']} "
                        f"(этап {d['stage_num']}, риск {d['risk_level']}, {mark}"
                        + (f", {d['law_ref']}" if d["law_ref"] else "") + ")"
                    )

            docs = _erp_rows(conn,
                "SELECT name, doc_type, authority, status, deadline "
                "FROM documents WHERE contract_id=? ORDER BY deadline", (c["id"],))
            if docs:
                out.append("  Документы:")
                for d in docs:
                    out.append(
                        f"    • {d['name']} ({d['doc_type']}) — {d['authority'] or 'орган —'}, "
                        f"статус {d['status']}, срок {d['deadline'] or '—'}"
                    )

        passports = _erp_rows(conn,
            "SELECT p.passport_type, p.status, p.registry_number, p.approving_authority, "
            "w.number AS well_number FROM passports p JOIN wells w ON w.id = p.well_id")
        if passports:
            out.append("\n▸ ПАСПОРТА СКВАЖИН:")
            for p in passports:
                out.append(
                    f"    • скв. {p['well_number']} — {p['passport_type']}, статус {p['status']}, "
                    f"рег. № {p['registry_number'] or '—'}, орган {p['approving_authority'] or '—'}"
                )

        tests = _erp_rows(conn,
            "SELECT t.obj_number, t.layer_name, t.interval_top, t.interval_bot, t.fluid_type, "
            "t.flow_rate, t.result, w.number AS well_number "
            "FROM test_objects t JOIN wells w ON w.id = t.well_id "
            "ORDER BY w.number, t.obj_number DESC")
        if tests:
            out.append("\n▸ ОБЪЕКТЫ ИСПЫТАНИЯ (снизу вверх):")
            for t in tests:
                out.append(
                    f"    • скв. {t['well_number']}, об. {t['obj_number']} — {t['layer_name'] or '—'}, "
                    f"интервал {t['interval_top'] or '—'}–{t['interval_bot'] or '—'} м, "
                    f"флюид {t['fluid_type'] or '—'}, дебит {t['flow_rate'] or '—'}, "
                    f"результат: {t['result'] or '—'}"
                )
    except Exception:
        return ""
    finally:
        conn.close()

    return "\n".join(out)


STAGE_NAMES_ERP = {
    1: "Разведка", 2: "Оценка", 3: "Гос. Баланс", 4: "Подготовительный",
    5: "Полномасштабная добыча", 6: "Ликвидация", 7: "Сдача территории",
}


SYSTEM_PROMPT_TEMPLATE = """\
Ты — Subsoil AI, интеллектуальный помощник по недропользованию Республики Казахстан.

Работаешь на основе актуальной базы знаний Obsidian-vault, содержащей:
• Кодекс о недрах и недропользовании (КОНН РК №125-VI, изм. 10.06.2025)
• Экологический кодекс (ЭК РК №400-VI, изм. 29.07.2025)
• ЕПРКИН №239, изм. 24.09.2024
• Подзаконные акты: Приказы МИИР №71, №419, МЭ №200, №356, №355, №27-н/к
• Все 7 этапов недропользования с документами, сроками, госорганами

═══ ПРАВИЛА ═══
1. Отвечай ТОЛЬКО на основе базы знаний. Не выдумывай статьи.
2. ВСЕГДА указывай конкретную статью и закон с датой редакции.
3. ВСЕГДА указывай номер этапа (1-7) если вопрос касается этапов.
4. Считай конкретные сроки если даны даты контракта/события.
5. Определяй роль спрашивающего: оператор → сроки/ответственность, подрядчик → платёжные вехи/документооборот.
6. ⚠️ При признаках сложного проекта (глубина >5000м, H₂S>6%, море, доля иностр. >50%) — рекомендуй STOP + обновление контракта.
7. Если информации нет в базе — честно скажи: «В базе знаний нет данных по этому вопросу».
8. Для сложных юридических вопросов перенаправляй к специалисту.
9. НЕ помогай обходить регуляторику или скрывать нарушения.
10. Если вопрос про «наши»/конкретные контракты, скважины, паспорта или сроки —
    отвечай по разделу ДАННЫЕ ERP, называй номер контракта и скважины.
    Просроченные и близкие сроки помечай явно.

═══ ФОРМАТ ОТВЕТА ═══
**Краткий вывод:** (1-2 предложения)

**Подробно:**
• пункт 1
• пункт 2

**Применимые нормы:** ст. X КОНН РК (изм. дата)

**Связанные документы/процессы:** ...

**Следующие шаги:** ...

═══ ДАННЫЕ ERP (фактический портфель компании) ═══
{erp_context}

═══ БАЗА ЗНАНИЙ ═══
{knowledge_base}
"""


# ─────────────────────────────────────────────────────────────────────────────
# AI Engine
# ─────────────────────────────────────────────────────────────────────────────

class SubsoilAI:
    def __init__(self) -> None:
        try:
            import anthropic as _anthropic
        except ImportError:
            raise RuntimeError("Установи anthropic: pip install anthropic")

        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            env_file = SITE_ROOT / ".env"
            if env_file.exists():
                for line in env_file.read_text().splitlines():
                    if line.startswith("ANTHROPIC_API_KEY="):
                        api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
        if not api_key:
            raise RuntimeError(
                "API ключ не найден. Создай файл .env с содержимым:\n"
                "ANTHROPIC_API_KEY=sk-ant-..."
            )

        self._client = _anthropic.Anthropic(api_key=api_key)
        self._history: List[Dict] = []

    def ask(self, question: str, stream_cb=None) -> str:
        """Задать вопрос. stream_cb(chunk) вызывается при каждом chunk'е если указан."""
        kb = build_knowledge_base(question)
        erp = build_erp_context() or "(нет доступа к данным ERP)"
        system = SYSTEM_PROMPT_TEMPLATE.format(knowledge_base=kb, erp_context=erp)

        messages = self._history.copy()
        messages.append({"role": "user", "content": question})

        if stream_cb:
            answer_parts: list[str] = []
            with self._client.messages.stream(
                model=MODEL,
                max_tokens=4096,
                system=system,
                messages=messages,
            ) as stream:
                for text in stream.text_stream:
                    stream_cb(text)
                    answer_parts.append(text)
            answer = "".join(answer_parts)
        else:
            response = self._client.messages.create(
                model=MODEL,
                max_tokens=4096,
                system=system,
                messages=messages,
            )
            answer = response.content[0].text

        self._history.append({"role": "user",      "content": question})
        self._history.append({"role": "assistant",  "content": answer})

        # Ограничиваем историю последними 20 сообщениями (10 диалогов)
        if len(self._history) > 20:
            self._history = self._history[-20:]

        return answer

    def reset(self) -> None:
        self._history.clear()


# ─────────────────────────────────────────────────────────────────────────────
# Утилита: сохранение лога в vault
# ─────────────────────────────────────────────────────────────────────────────

def save_log(question: str, answer: str) -> None:
    LOGS_DIR.mkdir(exist_ok=True)
    today = datetime.now().strftime("%Y-%m-%d")
    log_file = LOGS_DIR / f"{today}.md"
    ts = datetime.now().strftime("%H:%M:%S")
    entry = f"\n\n## {ts}\n\n**Вопрос:** {question}\n\n**Ответ:**\n\n{answer}\n\n---"
    if log_file.exists():
        with log_file.open("a", encoding="utf-8") as f:
            f.write(entry)
    else:
        header = f"---\ntitle: Лог {today}\ntags: [chat-log]\n---\n\n# Лог чата {today}\n"
        log_file.write_text(header + entry, encoding="utf-8")


# ─────────────────────────────────────────────────────────────────────────────
# Режим 1: Интерактивный CLI
# ─────────────────────────────────────────────────────────────────────────────

def run_cli() -> None:
    print("=" * 60)
    print("  Subsoil AI — Помощник недропользователя РК")
    print("  Модель:", MODEL)
    print("  Команды: 'выход' — завершить | 'сброс' — очистить историю")
    print("=" * 60)
    print()

    try:
        ai = SubsoilAI()
    except RuntimeError as e:
        print(f"❌ {e}")
        sys.exit(1)

    while True:
        try:
            question = input("Вы: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nДо свидания!")
            break

        if not question:
            continue
        if question.lower() in ("выход", "exit", "quit", "q"):
            print("До свидания!")
            break
        if question.lower() in ("сброс", "reset", "clear"):
            ai.reset()
            print("[История очищена]\n")
            continue

        print("\nSubsoil AI: ", end="", flush=True)

        def print_chunk(text: str) -> None:
            print(text, end="", flush=True)

        answer = ai.ask(question, stream_cb=print_chunk)
        print("\n")
        save_log(question, answer)


# ─────────────────────────────────────────────────────────────────────────────
# Режим 2: Синхронизация с Obsidian (file watch)
# ─────────────────────────────────────────────────────────────────────────────

CHAT_TEMPLATE = """\
---
title: Subsoil AI Chat
tags: [ai-chat, assistant]
aliases: [ИИ Помощник]
---

# 🤖 Subsoil AI — Помощник недропользователя

> **Как использовать:**
> 1. Замени текст ниже своим вопросом
> 2. Сохрани файл (⌘S / Ctrl+S)
> 3. Ответ появится автоматически через несколько секунд

---

## ✏️ Твой вопрос

{QUESTION_MARKER}
{PLACEHOLDER}
{QUESTION_END}

---

## 💬 История диалога

_Ответы появятся здесь._

""".format(
    QUESTION_MARKER=QUESTION_MARKER,
    PLACEHOLDER=PLACEHOLDER,
    QUESTION_END=QUESTION_END,
)


def _read_chat() -> str:
    if not CHAT_FILE.exists():
        CHAT_FILE.write_text(CHAT_TEMPLATE, encoding="utf-8")
    return CHAT_FILE.read_text(encoding="utf-8")


def _extract_question(content: str) -> Optional[str]:
    """Извлечь вопрос между маркерами из AI-Chat.md."""
    m = re.search(
        re.escape(QUESTION_MARKER) + r"\n(.*?)\n" + re.escape(QUESTION_END),
        content,
        flags=re.DOTALL,
    )
    if not m:
        return None
    q = m.group(1).strip()
    if q == PLACEHOLDER or not q:
        return None
    return q


def _update_chat(content: str, question: str, answer: str) -> str:
    """Вернуть обновлённый контент: вопрос сброшен, ответ добавлен в историю."""
    # Сбрасываем вопрос
    content = re.sub(
        re.escape(QUESTION_MARKER) + r"\n.*?\n" + re.escape(QUESTION_END),
        f"{QUESTION_MARKER}\n{PLACEHOLDER}\n{QUESTION_END}",
        content,
        flags=re.DOTALL,
    )

    # Добавляем в историю
    ts = datetime.now().strftime("%d.%m.%Y %H:%M")
    entry = (
        f"\n### 📅 {ts}\n\n"
        f"**Вопрос:** {question}\n\n"
        f"**Ответ:**\n\n{answer}\n\n---"
    )

    history_anchor = "## 💬 История диалога"
    placeholder_anchor = "_Ответы появятся здесь._"

    if placeholder_anchor in content:
        content = content.replace(placeholder_anchor, entry.strip())
    elif history_anchor in content:
        # Вставить после заголовка истории
        idx = content.index(history_anchor) + len(history_anchor)
        content = content[:idx] + entry + content[idx:]
    else:
        content += entry

    return content


def run_watch() -> None:
    print("=" * 60)
    print("  Subsoil AI — Режим синхронизации с Obsidian")
    print("  Файл:", CHAT_FILE)
    print("  Нажми Ctrl+C для выхода")
    print("=" * 60)
    print()

    if not CHAT_FILE.exists():
        CHAT_FILE.write_text(CHAT_TEMPLATE, encoding="utf-8")
        print(f"✅ Создан файл AI-Chat.md. Открой его в Obsidian.")
    else:
        print(f"📂 Мониторинг: {CHAT_FILE.name}")

    try:
        ai = SubsoilAI()
    except RuntimeError as e:
        print(f"❌ {e}")
        sys.exit(1)
    last_mtime = CHAT_FILE.stat().st_mtime
    last_question: Optional[str] = None

    print("👀 Жду вопроса...\n")

    while True:
        try:
            time.sleep(0.8)
            current_mtime = CHAT_FILE.stat().st_mtime

            if current_mtime <= last_mtime:
                continue

            last_mtime = current_mtime
            content = _read_chat()
            question = _extract_question(content)

            if not question or question == last_question:
                continue

            last_question = question
            print(f"❓ Вопрос: {question}")
            print("⏳ Обрабатываю...", end="", flush=True)

            answer = ai.ask(question)
            updated = _update_chat(content, question, answer)
            CHAT_FILE.write_text(updated, encoding="utf-8")
            last_mtime = CHAT_FILE.stat().st_mtime

            save_log(question, answer)
            print(f"\r✅ Ответ добавлен в AI-Chat.md\n")
            print("👀 Жду следующего вопроса...\n")

        except KeyboardInterrupt:
            print("\nОстановлено. До свидания!")
            break
        except Exception as e:
            print(f"\n⚠️ Ошибка: {e}")
            time.sleep(2)


# ─────────────────────────────────────────────────────────────────────────────
# Режим 3: Веб-интерфейс (FastAPI)
# ─────────────────────────────────────────────────────────────────────────────

try:
    from pydantic import BaseModel as _BaseModel

    class ChatRequest(_BaseModel):
        message: str
        history: list = []
except ImportError:
    ChatRequest = None  # type: ignore


HTML_PAGE = r"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI-помощник недропользователя — Каратюбе</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#FFFFFF;--bg-2:#F8F8F8;--surface:#F4F4F4;--surface-2:#ECECEC;
    --border:#D8D8D8;--border-dim:#EBEBEB;
    --white:#111111;--white-dim:#2A2A2A;--grey:#777777;--grey-dim:#AAAAAA;--grey-muted:#CCCCCC;
    --green:#16A34A;--red:#EF4444;
    --font-h:'Oswald',sans-serif;--font-data:'Inter',sans-serif;
  }
  body{background:var(--bg);color:var(--white);font-family:var(--font-data);
       height:100vh;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
  a{text-decoration:none;color:inherit}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:var(--bg)}
  ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

  /* ── Шапка как на сайте ── */
  header{display:flex;align-items:center;justify-content:space-between;gap:16px;
         padding:0 40px;height:60px;border-bottom:1px solid var(--border);background:var(--bg);flex-shrink:0}
  .logo{display:flex;align-items:center;gap:14px;flex-shrink:0;cursor:pointer;transition:opacity .15s}
  .logo:hover{opacity:.65}
  .logo-mark{width:28px;height:28px;border:1.5px solid var(--border);transform:rotate(45deg);
             display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .logo-mark i{width:10px;height:10px;background:var(--white);display:block}
  .logo-eyebrow{font-size:9px;color:var(--grey-dim);letter-spacing:2px;
                text-transform:uppercase;margin-bottom:1px;white-space:nowrap}
  .logo-text{font-family:var(--font-h);font-size:15px;font-weight:400;letter-spacing:4px;
             text-transform:uppercase;white-space:nowrap}
  nav.nav{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  nav.nav a{font-family:var(--font-h);font-size:12px;font-weight:300;letter-spacing:2px;
            text-transform:uppercase;color:var(--grey);border:1px solid var(--border);
            padding:4px 10px;border-radius:2px;transition:.2s}
  nav.nav a:hover{border-color:var(--grey);color:var(--white)}
  nav.nav a.active{border-color:var(--white);color:var(--white)}
  nav.nav a.home{border-color:var(--white);color:var(--white);font-weight:400}
  .header-right{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--white-dim);
                letter-spacing:2px;text-transform:uppercase;white-space:nowrap}
  .live-dot{width:6px;height:6px;border-radius:50%;background:var(--white-dim);animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}

  /* ── Быстрые запросы ── */
  .stage-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;
             padding:12px 40px;border-bottom:1px solid var(--border);background:var(--bg-2);flex-shrink:0}
  .stage-bar > span{font-size:9px;letter-spacing:2px;text-transform:uppercase;
                    color:var(--grey-dim);margin-right:6px}
  .stage-btn{background:var(--bg);border:1px solid var(--border);color:var(--grey);
             border-radius:2px;padding:5px 11px;font-family:var(--font-data);font-size:11px;
             letter-spacing:.5px;cursor:pointer;transition:.15s}
  .stage-btn:hover{border-color:var(--grey);color:var(--white)}

  /* ── Диалог ── */
  #chat{flex:1;overflow-y:auto;padding:28px 40px;display:flex;flex-direction:column;gap:16px}
  .msg{max-width:820px;line-height:1.65;font-size:13px}
  .msg.user{align-self:flex-end;background:var(--white);color:#fff;padding:11px 16px;border-radius:2px}
  .msg.ai{align-self:flex-start;background:var(--bg);border:1px solid var(--border);
          padding:16px 18px;border-radius:2px;white-space:pre-wrap;color:var(--white-dim)}
  .msg.system{align-self:center;color:var(--grey-dim);font-size:11px;letter-spacing:1.5px;
              text-transform:uppercase;text-align:center;padding:20px 0}
  .msg.ai strong{color:var(--white);font-weight:600}
  .msg.ai code{background:var(--surface);border:1px solid var(--border-dim);padding:1px 5px;
               border-radius:2px;font-size:.9em;font-family:var(--font-data)}
  .typing{color:var(--grey-dim);font-style:normal;letter-spacing:1px}

  /* ── Ввод ── */
  footer{background:var(--bg-2);border-top:1px solid var(--border);padding:14px 40px;
         display:flex;gap:8px;align-items:flex-end;flex-shrink:0}
  #input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:2px;
         color:var(--white);padding:11px 14px;font-family:var(--font-data);font-size:13px;
         resize:none;min-height:44px;max-height:180px;outline:none;transition:border-color .15s}
  #input:focus{border-color:var(--white)}
  #input::placeholder{color:var(--grey-dim)}
  button#send{background:var(--white);border:1px solid var(--white);color:#fff;border-radius:2px;
              padding:12px 20px;cursor:pointer;font-family:var(--font-data);font-size:11px;
              font-weight:500;letter-spacing:1.5px;text-transform:uppercase;transition:.15s}
  button#send:hover{background:#000}
  button#send:disabled{background:var(--grey-muted);border-color:var(--grey-muted);cursor:default}
  button#clear{background:var(--bg);border:1px solid var(--border);color:var(--grey);
               border-radius:2px;padding:12px 14px;cursor:pointer;font-size:12px;transition:.15s}
  button#clear:hover{border-color:var(--red);color:var(--red)}

  @media(max-width:900px){
    header{padding:0 20px}
    nav.nav a:not(.home){display:none}
    .header-right{display:none}
    .stage-bar{padding:10px 20px}#chat{padding:20px}footer{padding:12px 20px}
    .header-right{font-size:10px}
  }
</style>
</head>
<body>
<header>
  <a class="logo" href="/" title="На главную">
    <div class="logo-mark"><i></i></div>
    <div>
      <div class="logo-eyebrow">Месторождение Каратюбе</div>
      <div class="logo-text">IC Petroleum</div>
    </div>
  </a>
  <nav class="nav">
    <a href="/" class="home">&#8592; На главную</a>
    <a href="/sealing.html">Герметичность</a>
    <a href="/plan.html">Программа</a>
    <a href="/stages.html">Этапы</a>
    <a href="/erp/">ERP</a>
    <a href="/ai" class="active">AI</a>
  </nav>
  <div class="header-right"><span class="live-dot"></span>Помощник недропользователя</div>
</header>
<div class="stage-bar">
  <span>Быстрые запросы</span>
  <button class="stage-btn" onclick="quickQ('Что делать в первый день после регистрации контракта?')">День 1</button>
  <button class="stage-btn" onclick="quickQ('Какое состояние фонда Каратюбе и что с обводнённостью на 343?')">Фонд 343</button>
  <button class="stage-btn" onclick="quickQ('По каким скважинам изоляция NanoCem UT-9 держит, а по каким нет и почему?')">Изоляция UT-9</button>
  <button class="stage-btn" onclick="quickQ('Кто согласовывает проект разведочных работ?')">Разведка</button>
  <button class="stage-btn" onclick="quickQ('Нашли залежь на разведке, что делать дальше?')">Залежь найдена</button>
  <button class="stage-btn" onclick="quickQ('Запасы изменились на 25%, что делать?')">&#916; запасов &gt;20%</button>
  <button class="stage-btn" onclick="quickQ('Когда нужно подавать отчёт авторского надзора?')">Авторнадзор</button>
  <button class="stage-btn" onclick="quickQ('Подрядчику не платят, почему и что делать?')">Оплата</button>
  <button class="stage-btn" onclick="quickQ('Когда обязательна ликвидация скважин?')">Ликвидация</button>
  <button class="stage-btn" onclick="quickQ('Что значит сложный проект по КОНН?')">Сложный проект</button>
</div>
<div id="chat">
  <div class="msg system">Спросите об этапах недропользования, документах и сроках — или о фонде Каратюбе и изоляции водопритока</div>
</div>
<footer>
  <textarea id="input" rows="1" placeholder="Введите вопрос... (Enter — отправить, Shift+Enter — новая строка)"></textarea>
  <button id="clear" title="Очистить историю" onclick="clearHistory()">&#10005;</button>
  <button id="send" onclick="sendMessage()">Отправить</button>
</footer>
<script>
const chat = document.getElementById('chat');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');
let history = [];

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 180) + 'px';
});
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

function addMsg(role, text) {
  const d = document.createElement('div');
  d.className = 'msg ' + role;
  d.textContent = text;
  if (role === 'ai') {
    d.innerHTML = formatMd(text);
  }
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  return d;
}

function formatMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^## (.+)$/gm, '<strong style="font-size:1rem">$1</strong>')
    .replace(/^• /gm, '  • ')
    .replace(/⚠️/g, '<span style="color:var(--red)">⚠️</span>')
    .replace(/✅/g, '<span style="color:var(--green)">✅</span>');
}

async function sendMessage() {
  const q = input.value.trim();
  if (!q || sendBtn.disabled) return;
  input.value = ''; input.style.height = 'auto';
  sendBtn.disabled = true;
  addMsg('user', q);
  const typing = addMsg('ai', '⏳ Думаю...');
  typing.classList.add('typing');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message: q, history}),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await res.json();
    chat.removeChild(typing);
    addMsg('ai', data.answer);
    history.push({role:'user', content:q});
    history.push({role:'assistant', content:data.answer});
    if (history.length > 20) history = history.slice(-20);
  } catch(e) {
    clearTimeout(timeout);
    typing.textContent = e.name === 'AbortError'
      ? '⚠️ Запрос занял слишком долго. Попробуй ещё раз.'
      : '⚠️ Ошибка соединения: ' + e.message;
    typing.classList.remove('typing');
  }
  sendBtn.disabled = false;
  input.focus();
}

function quickQ(q) { input.value = q; sendMessage(); }

async function clearHistory() {
  history = [];
  await fetch('/reset', {method:'POST'});
  chat.innerHTML = '<div class="msg system">История очищена.</div>';
}
</script>
</body>
</html>
"""


def run_web(port: int = 8765) -> None:
    try:
        from fastapi import FastAPI
        from fastapi.responses import HTMLResponse, JSONResponse
        import uvicorn
        import asyncio
        from concurrent.futures import ThreadPoolExecutor
    except ImportError:
        print("❌ Для веб-режима установи: pip install fastapi uvicorn[standard]")
        sys.exit(1)

    app = FastAPI()

    # ── ERP: готовая программа подключается как под-приложение на /erp ──────
    try:
        import erp_server

        erp_server.init_db()
        app.mount("/erp", erp_server.app)
        print("  ERP подключён:  /erp")
    except Exception as e:
        print(f"⚠️  ERP не подключён: {e}")

    @app.get("/erp")
    async def erp_redirect():
        """Без слеша Starlette не попадает в под-приложение — уводим сами."""
        from fastapi.responses import RedirectResponse
        return RedirectResponse("/erp/")

    @app.get("/ai", response_class=HTMLResponse)
    async def ai_page():
        """AI-помощник недропользователя. Корень / отдан сайту аналитики."""
        return HTML_PAGE

    # Ленивая инициализация — AI создаётся при первом запросе
    _ai: list = []

    def get_ai() -> SubsoilAI:
        if not _ai:
            _ai.append(SubsoilAI())
        return _ai[0]

    @app.post("/chat")
    async def chat(req: ChatRequest):
        question = req.message.strip()
        if not question:
            return JSONResponse({"error": "empty"}, status_code=400)
        try:
            instance = get_ai()
        except RuntimeError:
            return JSONResponse({
                "answer": (
                    "⚠️ **API ключ не настроен.**\n\n"
                    "Создай файл `.env`:\n"
                    "ANTHROPIC_API_KEY=sk-ant-...\n\n"
                    "Затем перезапусти: `./start.sh --web`"
                )
            })
        instance._history = req.history
        try:
            loop = asyncio.get_event_loop()
            answer = await loop.run_in_executor(None, instance.ask, question)
        except Exception as e:
            err = str(e)
            if "credit balance is too low" in err or "insufficient" in err.lower():
                return JSONResponse({
                    "answer": (
                        "⚠️ **На счёте Anthropic недостаточно кредитов.**\n\n"
                        "Для пополнения:\n"
                        "1. Зайди на **console.anthropic.com**\n"
                        "2. Перейди в **Plans & Billing**\n"
                        "3. Добавь кредиты (минимум $5)\n\n"
                        "После пополнения всё заработает автоматически."
                    )
                })
            return JSONResponse({"answer": f"⚠️ Ошибка API: {err[:300]}"})
        save_log(question, answer)
        return {"answer": answer}

    @app.post("/reset")
    async def reset():
        _ai.clear()
        return {"ok": True}

    # ── Статика: сайт аналитики скважин в public/, отчёты по этапам ─────────
    from fastapi.staticfiles import StaticFiles

    reports_dir = Path(os.getenv("REPORTS_DIR", str(SERVER_DIR / "stage-reports")))
    if reports_dir.exists():
        app.mount("/stage-reports", StaticFiles(directory=str(reports_dir)), name="reports")

    public_dir = SITE_ROOT / "public"
    if public_dir.exists():
        # html=True → / отдаёт index.html (скважина 343)
        app.mount("/", StaticFiles(directory=str(public_dir), html=True), name="site")
        print("  Сайт подключён: /")

    is_prod = bool(os.getenv("RAILWAY_ENVIRONMENT") or os.getenv("RENDER") or os.getenv("FLY_APP_NAME"))
    host = "0.0.0.0" if is_prod else "127.0.0.1"
    print("=" * 60)
    print("  nanocem.app — аналитика скважин + недропользование")
    if not is_prod:
        print(f"  Открой в браузере: http://localhost:{port}")
    print("  Нажми Ctrl+C для выхода")
    print("=" * 60)
    uvicorn.run(app, host=host, port=port, log_level="warning")


# ─────────────────────────────────────────────────────────────────────────────
# Точка входа
# ─────────────────────────────────────────────────────────────────────────────

def main() -> None:
    # Загрузить .env если есть
    env_file = SITE_ROOT / ".env"
    if env_file.exists() and not os.getenv("ANTHROPIC_API_KEY"):
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

    parser = argparse.ArgumentParser(
        description="Subsoil AI — Помощник недропользователя РК",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Примеры:
              python subsoil_ai.py              # CLI чат в терминале
              python subsoil_ai.py --watch      # синхронизация с AI-Chat.md (Obsidian)
              python subsoil_ai.py --web        # веб-интерфейс на localhost:8765
              python subsoil_ai.py --web --port 9000
        """),
    )
    parser.add_argument("--watch", action="store_true", help="Режим синхронизации с Obsidian")
    parser.add_argument("--web",   action="store_true", help="Запустить веб-интерфейс")
    parser.add_argument("--port",  type=int, default=8765, help="Порт для веб-режима (default: 8765)")
    args = parser.parse_args()

    if args.web:
        port = int(os.getenv("PORT", args.port))
        run_web(port)
    elif args.watch:
        run_watch()
    else:
        run_cli()


if __name__ == "__main__":
    main()
