# Insurance App

A full-stack web application for managing insured people, insurance types, and insurance contracts. The project includes a Django REST API backend and a React frontend with role-based access for administrators and insured clients.

This is my final portfolio project and is currently focused on demonstrating practical full-stack development skills: data modeling, REST API design, authentication, CRUD operations, pagination, search, frontend state management, and bilingual UI support.

## Features

- Token-based login
- Administrator and insured client roles
- CRUD management for insured people
- CRUD management for insurance types
- CRUD management for insurance contracts
- Client profile page
- Client contract overview
- Backend search for insured people by name, address, and phone number
- Pagination for larger datasets
- Czech and English language switcher
- Basic frontend validation
- Environment-based Django secret key configuration

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- SQLite
- Django Token Authentication
- django-cors-headers

### Frontend

- JavaScript
- React
- React Router
- Vite
- CSS

### Development Tools

- Git
- GitHub
- PyCharm
- VS Code

## Project Structure

```text
Final-project/
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── insured/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── translations.js
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Data Model Overview

The application is built around three main domain entities:

- `InsuredPerson` - stores personal data about insured clients.
- `InsuranceType` - stores available insurance categories in Czech and English.
- `InsuranceContract` - connects an insured person with an insurance type and stores contract-specific data such as subject, amount, contract date, and validity date.

## User Roles

### Administrator

The administrator can manage:

- insured people,
- insurance types,
- insurance contracts.

### Insured Client

The insured client can view:

- their own profile,
- their own insurance contracts.

## API Endpoints

Main API routes:

```text
POST /api/login/
GET  /api/me/
GET  /api/my-profile/
GET  /api/my-contracts/

/api/insured-people/
/api/insurance-types/
/api/insurance-contracts/
```

The main CRUD endpoints are implemented with Django REST Framework routers.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Michalysko/Final-project.git
cd Final-project
```

### 2. Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv ../venv
```

On Windows:

```bash
../venv/Scripts/activate
```

````md
Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
DJANGO_SECRET_KEY=your-local-secret-key
DJANGO_DEBUG=True
```

Run migrations:

```bash
python manage.py migrate
```

Create an admin user:

```bash
python manage.py createsuperuser
```

Start the backend server:

```bash
python manage.py runserver
```

Backend runs at:

```text
http://127.0.0.1:8000/
```

### 3. Frontend Setup

Open a second terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173/
```

## Environment Variables

The project expects the following local environment variables in `backend/.env`:

```env
DJANGO_SECRET_KEY=your-local-secret-key
DJANGO_DEBUG=True
```

The `.env` file is intentionally ignored by Git and must not be committed.

## Quality Checks

### Backend

```bash
cd backend
python manage.py check
python manage.py test
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

Current project status:

- Django system check passes.
- Frontend lint passes.
- Frontend production build passes.
- Backend tests are planned as a next improvement.

## Security Notes

This repository is public, so sensitive local data must stay out of version control.

Ignored files include:

- `.env`
- `backend/.env`
- `backend/db.sqlite3`
- `frontend/node_modules/`
- `frontend/dist/`
- `venv/`

Before production deployment, the project should use:

- `DEBUG=False`,
- secure `ALLOWED_HOSTS`,
- production CORS settings,
- HTTPS,
- a production database such as PostgreSQL.

## Roadmap

Planned improvements:

- Add screenshots to this README.
- Add `.env.example`.
- Add `requirements.txt` for backend dependencies.
- Add backend serializer validation for age, phone number, contract amount, and contract dates.
- Add loading, success, and error states in the frontend.
- Add better pagination controls with current page and total count.
- Add search and filtering for insurance contracts.
- Move frontend API calls into a dedicated API layer.
- Add automated backend tests for authentication, permissions, CRUD operations, and search.
- Add an admin dashboard with key statistics.
- Prepare production deployment.

## What I Learned

While building this project, I practiced:

- designing relational models in Django,
- building REST API endpoints with Django REST Framework,
- implementing token authentication,
- separating administrator and client access,
- connecting a React frontend to a Django backend,
- handling pagination and search,
- managing state in React,
- working with Git and GitHub,
- improving project structure and security for a public repository.

## Project Status

The application is functional and actively being improved as a portfolio project. It is not intended for real insurance production use yet.
