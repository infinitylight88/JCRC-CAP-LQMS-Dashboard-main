# JCRC CAP LabQMS Dashboard

A browser-based Lab Quality Management System (LabQMS) dashboard for the JCRC Directorate of Laboratory Services. This repository includes:

- **Backend**: FastAPI + SQLAlchemy for patient, visit, requisition, accession, sample, SOP, and equipment data entry
- **Frontend**: React + Vite browser UI with tabbed data entry sections and record previews
- **Database**: PostgreSQL-ready schema and seed data support for lab sections and test menus

## Getting Started

### 1. Backend

1. Open a terminal and change into the backend folder:
   ```bash
   cd /workspaces/JCRC-CAP-LQMS-Dashboard/backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   python -m pip install -e .
   ```

4. Configure PostgreSQL connection in `backend/.env` if needed. Default:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/labqms
   ```

5. Start the backend API:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. Verify the backend is running:
   ```bash
   curl http://localhost:8000/health
   ```

### 2. Frontend

1. Open a second terminal and change into the frontend folder:
   ```bash
   cd /workspaces/JCRC-CAP-LQMS-Dashboard/frontend
   ```

2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

3. Start the React dev server:
   ```bash
   npm run dev
   ```

4. Open the browser at the local URL shown in the terminal, usually:
   ```text
   http://localhost:5173
   ```

### 3. Use the app

- The frontend expects the backend API at `http://localhost:8000`
- Use the tabs to create and view:
  - Patients
  - Visits
  - Requisitions
  - Accessions
  - Samples
  - SOP books and SOPs
  - Equipment

## Backend Endpoints

- `GET /health`
- `POST /patients`
- `GET /patients`
- `POST /patient-visits`
- `GET /patient-visits`
- `POST /requisitions`
- `GET /requisitions`
- `POST /accession-numbers`
- `GET /accession-numbers`
- `POST /samples`
- `GET /samples`
- `POST /sop-books`
- `GET /sop-books`
- `POST /sops`
- `GET /sops`
- `POST /equipment`
- `GET /equipment`

## Notes

- Make sure PostgreSQL is running and accessible before starting the backend.
- The schema creates tables automatically by default when the backend starts.
- The frontend UI is designed for operational laboratory record entry and review.

