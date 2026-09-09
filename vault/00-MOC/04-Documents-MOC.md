---
title: Documents MOC
tags: [moc, documents, ai-context]
aliases: [Проектные документы]
---

# 📄 Проектные документы — MOC

## По типам (цветовая кодировка стенда)

### 🟢 Базовые проектные документы
- [[30-Project-Razvedki-Poiskovyy]] — этап 1
- [[30-Project-Razvedki-Otsenochnyy]] — этап 2
- [[30-Project-Probnoy-Ekspl]] — этап 2
- [[30-Project-Razrabotki-Mestor]] — этап 4
- [[30-Project-Likvidatsii-Razvedki]] — этап 2
- [[30-Project-Likvidatsii-Mestor]] — этап 4
- [[30-Project-Likvidatsii-Final]] — этап 6

### 🟡 Технические проектные документы
- [[30-Tech-Project-Scvazhin-Prep]] — этап 4
- [[30-Tech-Project-Scvazhin-Full]] — этап 5

### 🟦 Геологические отчёты
- [[30-Operativnyy-Podschet]] — этап 2
- [[30-Podschet-Gos-Balans]] — этап 3
- [[30-Perevod-Zapasov]] — этап 4 (по необходимости)
- [[30-Pereschet-Zapasov]] — этап 5 (δ > 20%)
- [[30-Analiz-Razrabotki]] — этап 3 (раз в 3 года)
- [[30-Final-Report-Territory]] — этап 7

### 🔴 ОВВ/РООС
- [[30-OVVS-ROOS-Universal]] — общий шаблон ст. 67 ЭК

### 🟣 Авторский надзор
- [[30-Author-Supervision-Razvedka]] — этап 1
- [[30-Author-Supervision-Probnoy]] — этап 2
- [[30-Author-Supervision-Razrabotka]] — этапы 4, 5

### 📋 Акты, общие части
- [[30-Common-Document-Skeleton]] — общий скелет базового документа
- [[30-Common-Geological-Attachments]] — 11 обязательных приложений к геол. отчёту
- [[30-Akt-Likvidatsii]] — акт ликвидации (этапы 6, 7)

## По жизненному циклу скважины

```mermaid
flowchart LR
    POIS[Поисковый проект] --> POIS_SK[Поисковые скв.]
    POIS_SK --> OTS[Оценочный проект]
    OTS --> OTS_SK[Оценочные скв.]
    OTS_SK --> PROB[Пробная эксплуатация]
    PROB --> POD[Подсчёт запасов]
    POD --> RAZR[Проект разработки]
    RAZR --> TECH[Техпроект]
    TECH --> DOB[Добывающие скв.]
    DOB --> PASS[Паспорт скважины]
    PASS --> LIK[Ликвидация скв.]
```

## Универсальный «скелет» документов

См. [[30-Common-Document-Skeleton]]:

1. Нормативная база (КОНН + ЭК + ЕПРКИН + ведомственные акты)
2. Что предусматривается
3. Что должен содержать
4. Фазы I-VII прохождения
5. Финансовое обеспечение по ликвидации ([[40-Order-27-NK]])

## See also

- [[00-Home]] · [[01-Stages-MOC]] · [[30-Common-Document-Skeleton]]
