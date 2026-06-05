# Certify.uz — Sertifikat va Imtihon Tayyorgarlik Platformasi

**O'zbekistondagi eng keng qamrovli IELTS, CEFR, Milliy sertifikat va DTM tayyorgarlik platformasi**

## Texnologiyalar
- **Backend**: Django 4.2 + Django REST Framework + JWT Auth
- **Frontend**: React 18 + Vite + Tailwind CSS + Redux Toolkit
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Deploy**: Docker + Nginx
- **Payment**: Payme, Click, UzCard, Humo integratsiya (tayyor)

## Asosiy Xususiyatlar

### 🎓 DTM Test Tizimi (Interaktiv)
- 70+ yo'nalish (Texnika, Tibbiyot, Iqtisodiyot, Pedagogika, va h.k.)
- Yo'nalish tanlaganda tizim **avtomatik** fan guruhini aniqlaydi
- Real DTM formatida test: Majburiy (O'zbek+Math 30+30) + 2 ta ixtisoslik fani
- Timer, savol navigatsiyasi, tushuntirish ko'rish

### 🏆 IELTS Tayyorgarlik
- 4 bo'lim: Listening, Reading, Writing, Speaking
- Band 4.0 – 9.0 maslahatlari
- Mock testlar

### 🌍 CEFR Daraja
- A1 dan C2 gacha barcha darajalar
- IELTS ↔ CEFR mos jadval

### 🇺🇿 Milliy Sertifikat
- Ingliz, Rus, O'zbek, Nemis, Fransuz tillari
- Matematika, Fizika, Kimyo, Biologiya, Tarix
- A1-C2 darajalari, rasmiy hujjat

### 📚 Kurslar Tizimi
- Video darslar, matnlar, quizlar
- 18 ta fan: Ingliz, Matematika, Fizika, Kimyo, Biologiya, Tarix, Geografiya...
- Bepul va Premium kurslar

### 💳 Obuna Tizimi
- **Bepul**: 5 ta dars, cheklangan testlar
- **Oylik**: 79,000 so'm
- **3 oylik**: 199,000 so'm (16% tejash)
- **Yillik**: 599,000 so'm (37% tejash)
- To'lov: Payme, Click, UzCard, Humo

### 📊 Progress Tizimi
- Har bir test natijasi tahlili
- Kunlik streak (ketma-ketlik)
- Yutuqlar (achievements) tizimi
- XP (tajriba) ballari
- Grafik ko'rinishidagi progress

## Tez ishga tushirish

### 1. Talablar
```bash
docker --version  # Docker 20+
docker-compose --version  # Docker Compose 2+
```

### 2. Backend .env sozlash
```bash
cp backend/.env.example backend/.env
# backend/.env faylini tahrirlang
```

### 3. Docker bilan ishga tushirish
```bash
docker-compose up --build
```

Bu buyruq:
- PostgreSQL va Redis ishga tushiradi
- Ma'lumotlar bazasini migratsiya qiladi
- Barcha fanlarni yuklaydi (18 ta fan)
- Obuna rejalarini yuklaydi (4 ta reja)
- DTM yo'nalishlarini yuklaydi (70+ yo'nalish)
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

### 4. Admin panel
```bash
docker-compose exec backend python manage.py createsuperuser
# http://localhost:8000/admin/
```

### 5. API hujjati
```
http://localhost:8000/api/docs/
```

## Lokal rivojlantirish

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # .env ni tahrirlang

python manage.py migrate
python manage.py load_subjects
python manage.py load_plans
python manage.py load_dtm_data
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

## Loyiha Tuzilmasi

```
Certify.uz/
├── backend/
│   ├── apps/
│   │   ├── accounts/      # Foydalanuvchi tizimi, JWT auth
│   │   ├── courses/       # Fanlar, Kurslar, Darslar
│   │   ├── exams/         # IELTS, CEFR, Milliy sertifikat
│   │   ├── questions/     # Savollar va javoblar
│   │   ├── dtm/           # DTM yo'nalishlari (70+)
│   │   ├── payments/      # Obuna va to'lovlar
│   │   └── progress/      # Test natijalari, yutuqlar
│   └── config/            # Django sozlamalari
├── frontend/
│   └── src/
│       ├── pages/         # Barcha sahifalar
│       ├── components/    # Qayta ishlatiladigan komponentlar
│       ├── api/           # API chaqiruvlari
│       └── store/         # Redux state
├── nginx/                 # Nginx konfiguratsiya
└── docker-compose.yml
```

## VPS ga Deploy qilish

```bash
# Server sozlash (Ubuntu 22.04)
apt update && apt install -y docker.io docker-compose-v2

# Loyihani ko'chirish
git clone https://github.com/username/certify-uz.git
cd certify-uz

# .env sozlash
nano backend/.env  # Ma'lumotlar bazasi parollari, SECRET_KEY, va h.k.

# Ishga tushirish
docker compose up -d --build

# SSL sertifikat (Certbot)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d certify.uz -d www.certify.uz
```
