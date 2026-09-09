FROM python:3.11-slim

WORKDIR /app

# Юникодный шрифт — без него кириллица в PDF-отчётах не отрисуется
RUN apt-get update \
    && apt-get install -y --no-install-recommends fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080
EXPOSE 8080

# Один процесс отдаёт всё: сайт (public/), AI-помощник (/ai) и ERP (/erp)
CMD ["python", "server/subsoil_ai.py", "--web"]
