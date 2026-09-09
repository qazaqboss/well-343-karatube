#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_rag_index.py — индексация Subsoil Vault в pgvector для RAG-чатбота.

Использование:
    pip install openai psycopg2-binary python-frontmatter
    export OPENAI_API_KEY=sk-...
    export DATABASE_URL=postgresql://user:pass@localhost:5432/subsoil
    python build_rag_index.py /path/to/Subsoil-Vault

Перед первым запуском создайте таблицу (см. SQL ниже или 90.13-Production-RAG-Pipeline.md):

    CREATE EXTENSION IF NOT EXISTS vector;
    CREATE TABLE subsoil_chunks (
        id TEXT PRIMARY KEY, file_path TEXT, title TEXT, stage TEXT,
        tags TEXT[], content TEXT, embedding vector(3072)
    );
    CREATE INDEX ON subsoil_chunks USING hnsw (embedding vector_cosine_ops);
"""
import os, sys, glob, json

try:
    import frontmatter
    from openai import OpenAI
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    sys.exit("Установите зависимости: pip install openai psycopg2-binary python-frontmatter")

EMB_MODEL = "text-embedding-3-large"   # 3072 dim, хорош для русского
MAX_CHARS = 2000                        # размер чанка
SKIP_DIRS = ("/80-Templates/",)         # шаблоны не индексируем
BATCH = 64                              # размер батча эмбеддингов


def chunk_markdown(text: str, max_chars: int = MAX_CHARS):
    """Делит markdown по заголовкам '## ', длинные секции — дополнительно."""
    parts, buf = [], []
    for line in text.splitlines():
        if line.startswith("## ") and buf:
            parts.append("\n".join(buf))
            buf = []
        buf.append(line)
    if buf:
        parts.append("\n".join(buf))
    out = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if len(p) <= max_chars:
            out.append(p)
        else:
            for i in range(0, len(p), max_chars):
                out.append(p[i:i + max_chars])
    return out


def embed_batch(client, texts):
    resp = client.embeddings.create(model=EMB_MODEL, input=texts)
    return [d.embedding for d in resp.data]


def main(vault_dir):
    client = OpenAI()
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute("TRUNCATE subsoil_chunks")

    rows = []
    files = [f for f in glob.glob(f"{vault_dir}/**/*.md", recursive=True)
             if not any(s in f.replace("\\", "/") for s in SKIP_DIRS)]
    print(f"Файлов к индексации: {len(files)}")

    pending_texts, pending_meta = [], []

    def flush():
        if not pending_texts:
            return
        vecs = embed_batch(client, pending_texts)
        for (cid, fp, title, stage, tags, content), vec in zip(pending_meta, vecs):
            rows.append((cid, fp, title, stage, tags, content, vec))
        pending_texts.clear()
        pending_meta.clear()

    for path in files:
        post = frontmatter.load(path)
        meta = post.metadata
        rel = os.path.relpath(path, vault_dir).replace("\\", "/")
        for i, chunk in enumerate(chunk_markdown(post.content)):
            pending_texts.append(chunk)
            pending_meta.append((
                f"{rel}::{i}", rel, meta.get("title"),
                str(meta.get("stage", "")),
                meta.get("tags", []) if isinstance(meta.get("tags"), list) else [],
                chunk,
            ))
            if len(pending_texts) >= BATCH:
                flush()
    flush()

    execute_values(cur,
        """INSERT INTO subsoil_chunks
           (id, file_path, title, stage, tags, content, embedding)
           VALUES %s""",
        rows, template="(%s,%s,%s,%s,%s,%s,%s)")
    conn.commit()
    print(f"Готово: {len(rows)} чанков проиндексировано в pgvector.")


if __name__ == "__main__":
    vault = sys.argv[1] if len(sys.argv) > 1 else "Subsoil-Vault"
    main(vault)
