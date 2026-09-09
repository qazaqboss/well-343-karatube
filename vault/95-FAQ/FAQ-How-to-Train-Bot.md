---
title: Как обучить бота на вольте?
tags: [faq, ai-context, ai-training]
aliases: [How to train bot]
---

# ❓ Как обучить чат-бота на этом вольте?

## Запрос пользователя

> Как мне обучать мой чат-бот на Obsidian?

## Краткий ответ

**Не «обучать» (fine-tune), а делать RAG.** Законы меняются — нужно retrieval, а не зашитые в веса знания. Вольт уже построен под это.

## Три варианта

1. **Сегодня, без кода:** плагин Smart Connections или Copilot for Obsidian → индексирует вольт → чат прямо в Obsidian. См. [[90.12-Obsidian-Plugins-NoCode]].
2. **Приватно:** Ollama (локальные модели) + те же плагины. Данные не уходят в облако.
3. **В продукт Subsoil:** pgvector (в твоём PostgreSQL) + OpenAI embeddings + FastAPI. См. [[90.13-Production-RAG-Pipeline]].

## Почему не fine-tuning

| | RAG | Fine-tuning |
|---|-----|-------------|
| Обновление закона | минуты | дорогое переобучение |
| Цитаты | точные | «придумывает» |
| Для законов | ✅ | ❌ |

Подробно: [[90.11-How-to-Train-Chatbot]].

## See also

- [[90.11-How-to-Train-Chatbot]] · [[90.12-Obsidian-Plugins-NoCode]] · [[90.13-Production-RAG-Pipeline]]
