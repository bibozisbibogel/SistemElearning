# E-Learning App - Cerinta 7

Aplicatie client pentru sistemul E-Learning cu operatii CRUD si cautare.

## Tehnologii

**Backend:**
- Python 3.10+
- FastAPI
- Uvicorn
- SQLAlchemy
- PostgreSQL

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS

## Structura proiectului

```
cerinta7_app/
├── backend/
│   ├── main.py          # API endpoints
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── database.py      # DB connection
│   ├── .env             # Config
│   └── requirements.txt
└── frontend/
    ├── pages/           # Next.js pages
    ├── components/      # React components
    ├── lib/             # API client
    └── styles/          # CSS
```

## Pornire aplicatie

### 1. Backend (Terminal 1)

```bash
cd cerinta7_app/backend

# Creeaza virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# sau: venv\Scripts\activate  # Windows

# Instaleaza dependente
pip install -r requirements.txt

# Porneste serverul
uvicorn main:app --reload --port 8000
```

Backend va rula pe: http://localhost:8000
Documentatie API: http://localhost:8000/docs

### 2. Frontend (Terminal 2)

```bash
cd cerinta7_app/frontend

# Instaleaza dependente
npm install

# Porneste serverul de dezvoltare
npm run dev
```

Frontend va rula pe: http://localhost:3000

## Functionalitati

- **Utilizatori**: CRUD + cautare dupa nume/email, filtrare dupa tip/status
- **Cursuri**: CRUD + cautare dupa titlu/descriere, filtrare dupa status publicare
- **Subiecte**: CRUD + cautare dupa titlu, filtrare dupa status
- **Clase Virtuale**: CRUD + cautare dupa nume/cod acces, filtrare dupa status
- **Trimiteri**: CRUD + filtrare dupa corectitudine

## Configurare baza de date

Fisierul `.env` din backend contine:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/EduBuddy
```

Modifica daca ai alte credentiale.
