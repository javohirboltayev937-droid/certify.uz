#!/bin/bash
# Certify.uz lokal ishga tushirish skripti

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Certify.uz lokal ishga tushirish     ${NC}"
echo -e "${BLUE}========================================${NC}"

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend"

# Port tekshirish
kill_port() {
    local port=$1
    local pid=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Port $port band — eski process o'ldirilmoqda...${NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
}

# ─── BACKEND ────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[1/3] Backend tayyorlanmoqda...${NC}"

cd "$BACKEND_DIR"

# venv borligini tekshirish
if [ ! -f "venv/bin/python" ]; then
    echo -e "  Python venv yaratilmoqda..."
    python3 -m venv venv
    venv/bin/pip install -q setuptools
    venv/bin/pip install -q -r requirements-dev.txt
fi

# Migration
export DJANGO_SETTINGS_MODULE=config.settings_dev
venv/bin/python manage.py migrate --run-syncdb -v 0 2>/dev/null
venv/bin/python manage.py migrate -v 0 2>/dev/null

# Ma'lumotlar yuklash (faqat birinchi marta)
COUNT=$(venv/bin/python manage.py shell -c "from apps.courses.models import Subject; print(Subject.objects.count())" 2>/dev/null)
if [ "$COUNT" = "0" ] || [ -z "$COUNT" ]; then
    echo -e "  Ma'lumotlar yuklanmoqda..."
    venv/bin/python manage.py load_subjects -v 0 2>/dev/null
    venv/bin/python manage.py load_plans -v 0 2>/dev/null
    venv/bin/python manage.py load_dtm_data -v 0 2>/dev/null
fi

# Admin yaratish
venv/bin/python manage.py shell -c "
from apps.accounts.models import User
if not User.objects.filter(username='admin').exists():
    u = User.objects.create_superuser('admin', 'admin@certify.uz', 'admin1234')
    u.is_premium = True
    u.save()
    print('  Admin yaratildi: admin / admin1234')
" 2>/dev/null

# Backend server ishga tushirish
kill_port 8001
echo -e "  Backend ishga tushirilmoqda (port 8001)..."
venv/bin/python manage.py runserver 8001 > /tmp/certify_backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

if curl -s http://localhost:8001/api/dtm/categories/ > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Backend ishga tushdi: http://localhost:8001${NC}"
else
    echo -e "${RED}  ✗ Backend ishga tushmadi! Log: /tmp/certify_backend.log${NC}"
fi

# ─── FRONTEND ────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[2/3] Frontend tayyorlanmoqda...${NC}"

cd "$FRONTEND_DIR"

# npm packages
if [ ! -d "node_modules" ]; then
    echo -e "  npm packages o'rnatilmoqda..."
    npm install --silent 2>/dev/null
fi

# .env
echo "VITE_API_URL=http://localhost:8001/api" > .env

kill_port 3000
echo -e "  Frontend ishga tushirilmoqda (port 3000)..."
npm run dev > /tmp/certify_frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Frontend ishga tushdi: http://localhost:3000${NC}"
else
    echo -e "${RED}  ✗ Frontend ishga tushmadi! Log: /tmp/certify_frontend.log${NC}"
fi

# ─── NATIJA ────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  Certify.uz muvaffaqiyatli ishga tushdi!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "  🌐 Sayt:          ${GREEN}http://localhost:3000${NC}"
echo -e "  🔧 API:           ${GREEN}http://localhost:8001/api/${NC}"
echo -e "  👑 Admin panel:   ${GREEN}http://localhost:8001/admin/${NC}"
echo ""
echo -e "  Admin login:  ${YELLOW}admin${NC}  |  Parol: ${YELLOW}admin1234${NC}"
echo ""
echo -e "  To'xtatish uchun: ${RED}Ctrl+C${NC}"
echo ""

# Jarayonlarni kuzatish
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
