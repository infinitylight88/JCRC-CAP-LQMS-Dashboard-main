# LabQMS Backend and Database: Developer Flow

## Purpose and technology

This folder contains the LabQMS HTTP API. It uses Python, FastAPI, Pydantic,
SQLAlchemy, and Uvicorn. The default development database is SQLite, configured
by `DATABASE_URL=sqlite:///../labqms.db` in `.env`. The project also includes
PostgreSQL support through SQLAlchemy and `psycopg`; changing `DATABASE_URL`
selects that database without changing the API callers.

## Start and verify

```powershell
cd backend
.\.venv-win\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 5003
```

Useful URLs:

- Health check: `http://localhost:5003/health`
- Interactive OpenAPI contract: `http://localhost:5003/docs`

Port 5003 is intentional: Sysmex Middleware reserves port 5000 (ASTM) and
port 8000 (Flask API), while the separate local Shiny application may use 5001.

## Request flow

```text
React frontend (5004) / CAP OS (5005)
  -> HTTP JSON request to FastAPI (5003)
     -> app/main.py route
        -> Pydantic request validation (schemas.py)
           -> database session dependency (database.py:get_db)
              -> domain CRUD function (crud.py)
                 -> SQLAlchemy model and relationship mapping (models.py)
                    -> SQLite labqms.db or configured PostgreSQL database
  <- Pydantic response model serializes JSON
```

## Module responsibilities

| Module | Responsibility |
| --- | --- |
| `app/main.py` | Creates the FastAPI app, CORS middleware, routes, startup tasks, and dependency wiring. |
| `app/config.py` | Reads environment settings, especially `DATABASE_URL`. |
| `app/database.py` | Creates the SQLAlchemy engine and sessions; provides `get_db`; performs small compatibility upgrades for existing SQLite files. |
| `app/models.py` | SQLAlchemy table definitions and relationships. This is the schema source of truth in code. |
| `app/schemas.py` | Pydantic request and response types used to validate and serialize API data. |
| `app/crud.py` | Database create/read/update operations and domain rules. |
| `app/sop_import.py` | Imports SOP documents from the repository's docs area. |
| `app/section_mapping.py` | Seeds and maintains section/SOP mapping data. |

At import time `main.py` creates missing tables, applies additive compatibility
changes, and seeds sections. At application startup it imports discovered SOP
documents and refreshes section mappings. This is convenient for local
development. For production, use reviewed migrations and backups rather than
relying solely on automatic schema changes.

## Schema overview

The following groups mirror the SQLAlchemy models. Primary keys are integer
`id` values unless noted otherwise.

### Laboratory and test catalogue

```text
laboratories
  └─ laboratory_sections
       ├─ tests <- test_categories
       ├─ staff (primary section) and staff_sections (many-to-many)
       ├─ equipment_sections (many-to-many) -> equipment
       └─ sop_section_links (many-to-many) -> sops
```

- `laboratories`: laboratory identity.
- `laboratory_sections`: laboratory departments/sections.
- `test_categories` and `tests`: test catalogue; a test may be used by a
  competency procedure and competency record.

### People and competency

```text
staff --< staff_sections >-- laboratory_sections
staff --< competency_records >-- tests
competency_records --< competency_record_sops >-- sops
competency_procedures --< competency_procedure_sops >-- sops
competency_procedures --< competency_procedure_equipment >-- equipment
```

- `staff`: employee and contact/status data; `section_id` is the primary
  section, while `staff_sections` records all assigned sections.
- `competency_procedures`: a defined competency activity, linked to a section,
  test, SOPs, and equipment.
- `competency_records`: staff assessment history including phase, dates, status,
  notes, and applicable SOPs.
- Join tables preserve many-to-many links without duplicating the related data.

### Patient specimen workflow

```text
patients -> patient_visits -> requisitions -> accession_numbers -> samples
```

This sequence represents registration through specimen tracking. A requisition
belongs to a visit; accession numbers belong to requisitions; samples belong to
accession numbers.

### Document control and equipment

```text
sop_books -> sops -> sop_versions
laboratory_sections --< sop_section_links >-- sops
equipment_categories / manufacturers / suppliers -> equipment
laboratory_sections --< equipment_sections >-- equipment
```

- `sop_books`, `sops`, and `sop_versions`: document catalogue, current SOP
  information, and version history.
- `locations`, `equipment_categories`, `manufacturers`, and `suppliers`: lookup
  data used to classify equipment.
- `equipment` and `equipment_sections`: equipment records and their assigned
  laboratory sections.

## API resources

Routes in `app/main.py` expose the main resource groups: sections, tests, SOP
books/SOPs/SOP versions, staff, competency procedures/records, equipment, and
the patient-to-sample workflow. Use `/docs` as the current source of exact
payloads, validation rules, response fields, and status codes.

## Collaboration and main-branch checklist

1. Make schema changes in `models.py`, then update the corresponding Pydantic
   types in `schemas.py` and the CRUD/route code.
2. Treat changing a relation or deleting data as a migration task; test against
   a copy of `labqms.db` first.
3. Keep API additions backward-compatible when either frontend may still use an
   earlier release.
4. Test `GET /health`, inspect `/docs`, and run the appropriate frontend build
   before opening a pull request.
5. Never commit credentials or production database URLs to `.env`.
