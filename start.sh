#!/bin/bash

# Script pentru pornirea aplicatiei E-Learning (Backend + Frontend)

echo "=== Pornire E-Learning App ==="

# Porneste backend-ul in background
echo "[1/2] Pornire Backend (FastAPI)..."
cd "$(dirname "$0")/backend"

if [ ! -d "venv" ]; then
    echo "  -> Creare virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo "  -> Backend pornit (PID: $BACKEND_PID)"

# Porneste frontend-ul
echo "[2/2] Pornire Frontend (Next.js)..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "  -> Instalare dependente npm..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "  -> Frontend pornit (PID: $FRONTEND_PID)"

echo ""
echo "=== Aplicatia ruleaza ==="
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"
echo ""
echo "Apasa Ctrl+C pentru a opri ambele servere."

# Asteapta si opreste ambele procese la Ctrl+C
trap "echo 'Oprire servere...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

wait
