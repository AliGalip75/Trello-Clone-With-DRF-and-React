FROM python:3.11-slim

# Python loglarını anında ekrana basar (hata ayıklamak için şart)
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Önce gereksinimleri kur ki kod değişince her seferinde pip install yapmasın (Docker Cache)
COPY requirements.txt .
# Eski satırı şununla değiştir:
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

# Proje kodlarını kopyala
COPY . .

# Django'yu 0.0.0.0 üzerinden başlatmazsan dışarıdan erişemezsin
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]