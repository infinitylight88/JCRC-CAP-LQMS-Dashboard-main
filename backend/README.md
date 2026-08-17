# LabQMS Backend

This backend provides a minimal FastAPI server to support browser-based data entry for the LabQMS PostgreSQL schema.

## Setup

1. Create a Python virtual environment.
2. Install dependencies:

   python -m pip install -e .

3. Start the app:

   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

## Endpoints

- `GET /health` — health check
- `POST /patients` — create patient
- `GET /patients` — list patients
- `POST /patient-visits` — create patient visit
- `GET /patient-visits` — list patient visits
- `GET /sections` — list lab sections
- `GET /tests` — list test menu

More endpoints can be added for SOPs, equipment, QC, CAP, and inventory.
