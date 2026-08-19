# JCRC CAP LabQMS Dashboard – Development Progress and Implementation Notes

This document is the project journal for the JCRC CAP LabQMS Dashboard. It explains not only what the application does, but also how each module was built, why it exists, and how the pieces work together in the full lab-quality-management workflow.

---

## 1. Project overview

The application is a laboratory quality management dashboard designed to support CAP audit readiness and operational laboratory governance. It brings together several data domains:

- SOP books and SOP inventory
- Laboratory sections and staff assignments
- Competency procedures and competency records
- Equipment registry and section distribution
- Core lab operation data such as requisitions, samples, patients, and visits

The app is split into two main layers:

1. Frontend layer: a React + Vite interface that provides tables, forms, filters, and interactive panels
2. Backend layer: a FastAPI + SQLAlchemy service that exposes REST endpoints and persists structured data in SQLite/PostgreSQL

This is a classic full-stack workflow: the frontend gathers user inputs, sends them to the backend, the backend validates them, persists them in the database, and then the UI refreshes and displays the updated records.

---

## 2. What the project is trying to achieve

This dashboard is more than a basic CRUD app. It is designed to support regulated laboratory operations by making key quality-related records visible and manageable:

- SOPs can be imported from long-form documentation and organized into books
- Laboratory sections can be assigned and tracked
- Staff can be registered and mapped to sections and competencies
- Competency procedures can be created and associated with required SOPs and equipment
- Competency records track whether staff have met evaluation standards over time
- The dashboard supports operational visibility for audit readiness and quality assurance

In practical terms, this project functions like a lightweight laboratory quality management system that is intended to evolve into a more comprehensive CAP compliance platform.

---

## 3. High-level architecture

### Frontend architecture

The frontend is a single-page React application in `frontend/src/App.jsx`.

The UI is organized around tabs:

- Dashboard
- Competencies
- Laboratory Staffing
- SOPs
- Equipment

The app manages all state in React using `useState` and `useEffect`. Data is fetched from the backend with Axios, and each tab renders its own forms and tables.

### Backend architecture

The backend is organized into a modular FastAPI application in `backend/app`.

Core backend responsibilities:

- database connection setup
- schema and table creation
- ORM models for all business objects
- Pydantic validation schemas
- CRUD functions for database access
- route handlers for API endpoints
- data import logic for SOP books and documents
- section mapping logic that organizes SOPs by laboratory section

---

## 4. Backend modules explained in detail

### 4.1 `backend/app/config.py`

This file sets up the environment configuration for the backend.

What it does:

- Defines the database URL using `BaseSettings`
- Defaults to an SQLite database file named `labqms.db` in the repository root
- Reads values from `.env` if present
- Resolves relative SQLite paths to absolute paths so database location remains correct regardless of where Uvicorn is launched

Why it matters:

This prevents environment-specific path issues and makes the application easier to run in both local development and future deployment environments.

Important implementation detail:

The app is designed to support SQLite development first and PostgreSQL style deployments later. This is a practical choice for rapid local iteration and prototype development.

---

### 4.2 `backend/app/database.py`

This file is the foundation of the data layer.

It contains:

- `engine`: SQLAlchemy engine used to connect to the database
- `SessionLocal`: session factory used for DB access
- `Base`: SQLAlchemy declarative base for all model classes
- `ensure_schema_updates()`: a migration-like helper for additive schema updates when older SQLite files already exist
- `get_db()`: dependency injection generator for FastAPI routes

What `ensure_schema_updates()` is doing:

- Checks whether old database tables are missing columns
- Adds columns like `section_id` to `staff` and `test_id` to `competency_procedures`
- Copies legacy single-SOP references into the newer many-to-many relationship table `competency_record_sops`

This is a very important migration strategy because the project evolved over time, and older data files needed to continue working without a full database rebuild.

---

### 4.3 `backend/app/models.py`

This is the database schema definition for the entire application.

It defines all core entities:

- `Laboratory`
- `LaboratorySection`
- `Patient`
- `PatientVisit`
- `TestCategory`
- `Test`
- `Staff`
- `StaffSection`
- `CompetencyRecord`
- `CompetencyProcedure`
- `Requisition`
- `AccessionNumber`
- `Sample`
- `SOPBook`
- `SOP`
- `Location`
- `Equipment`

What makes this file important:

It maps the real laboratory workflow to relational data structures.

Examples:

- A `Staff` can belong to many sections via `StaffSection`
- A `CompetencyProcedure` is linked to multiple `SOP`s and optional `Equipment` items
- A `CompetencyRecord` belongs to one staff member and one test, but may reference multiple SOPs
- A `PatientVisit` can have many requisitions, which can then generate accession numbers and samples

The model design is intentionally rich because the lab environment has many interconnections, and each record must remain auditable and traceable.

Important relationships:

- `Staff` has many `CompetencyRecord`s
- `CompetencyRecord` connects to multiple SOPs via the `competency_record_sops` join table
- `CompetencyProcedure` points to a test plus optional equipment
- `SOP` is associated with sections via `sop_section_links`

This is the backbone of the compliance and quality-tracking logic.

---

### 4.4 `backend/app/schemas.py`

This file defines the request and response models using Pydantic.

Why this is important:

FastAPI uses these classes to validate incoming requests and serialize database records to JSON cleanly.

Examples of schemas:

- `StaffCreate` and `StaffRead`
- `CompetencyProcedureCreate` and `CompetencyProcedureRead`
- `CompetencyRecordCreate` and `CompetencyRecordRead`
- `SOPCreate` / `SOPRead`
- `EquipmentCreate` / `EquipmentRead`
- Patient, visit, requisition, accession, and sample schemas

These schemas act as the contract between frontend and backend.

One useful detail:

The app uses `orm_mode = True`, which allows Pydantic to convert SQLAlchemy model objects directly into JSON-friendly responses.

Without this, returning database records from FastAPI would require a lot of manual conversion work.

---

### 4.5 `backend/app/crud.py`

This file contains the database operations for creating, reading, and linking records.

It is the “data access layer” of the project.

Key functions and responsibilities:

#### `generate_equipment_code()`
Creates a unique equipment identifier like `EQP-ABCD1234`.

#### `generate_staff_code()`
Creates unique staff identifiers like `STF-ABCD1234`.

#### `generate_competency_code()`
Creates competency identifiers like `CMP-ABCD1234`.

#### `get_sections()`
Returns all laboratory sections ordered by code.

#### `get_section_sops()`
Returns the SOPs associated with a specific section.

#### `get_tests()`
Returns test catalog records.

#### `create_staff()`
Creates a staff record, assigns the primary section, adds all secondary section links, and auto-creates initial competency records for selected competency procedures.

This is a key bit of business logic: when a staff member is registered, their competency profile is set up immediately.

#### `get_staff()`
Returns staff records.

#### `create_competency_procedure()`
Creates a test record and its competency procedure record in one operation. It links the procedure to the chosen SOPs and equipment items.

This is one of the core design decisions: every procedure also creates a corresponding test entity, so a competency procedure is not just metadata; it becomes a test workflow object in the lab's catalog.

#### `create_competency_record()`
Creates a competency assessment record and attaches relevant SOPs.

#### `create_sop_book()` and `create_sop()`
Create SOP book and SOP metadata in the database.

#### `create_equipment()`
Creates equipment and assigns it to section links.

The CRUD layer keeps database logic separate from HTTP handling, making the API cleaner and easier to maintain.

---

### 4.6 `backend/app/section_mapping.py`

This module is responsible for assigning SOPs to laboratory sections.

What it does:

- Defines standard section codes for the lab
- Takes a SOP’s `scope_distribution` value and tries to infer which section(s) it applies to
- Adds missing section links idempotently
- Uses book metadata as a fallback when section information is not explicit

This is a helpful intelligence layer: it reduces manual work and keeps the section-to-SOP relationship consistent with the institution’s structure.

Why it matters for this project:

The system is trying to mirror a real lab where each SOP belongs to a section or a group of sections. Without intelligent mapping, managing quality documents becomes tedious and inconsistent.

---

### 4.7 `backend/app/sop_import.py`

This module imports SOP data from files stored in `docs/Lab_SOPs`.

Key responsibilities:

- Finds files such as `Book_1.md`, `Book_2.md`, etc.
- Parses book metadata from Markdown headings
- Extracts the SOP inventory table out of the document
- Converts dates into Python `date` objects
- Creates `SOPBook` records and individual `SOP` records in the database

This is a useful automation component because the project includes long SOP documents, and manual creation of each SOP would be time consuming.

Important design idea:

The batch import is meant to turn static documentation into structured system records. It is a bridge between operational documents and digital quality management data.

---

### 4.8 `backend/app/main.py`

This is the entry point for the FastAPI service.

It does the following:

- Creates the FastAPI app
- Loads and initializes the database models
- Calls `ensure_schema_updates()` at startup
- Seeds laboratory sections and SOP links
- Imports SOP documents from the docs folder on startup if available
- Configures CORS to allow requests from the frontend (`localhost:5173`)
- Exposes all API routes

This file is effectively the application controller.

Example route groups in this file:

- `/health` – app health check
- `/sections` – list lab sections
- `/sops` – manage SOP records
- `/competency-procedures` – create and read procedures
- `/staff` – register staff
- `/competency-records` – record assessment events
- `/equipment` – equipment management
- patient/visit/requisition/sample pipeline

This file is the coordinator between HTTP requests and database logic.

---

## 5. Frontend module and flow explanation

### 5.1 `frontend/src/App.jsx`

This file is the heart of the application UI.

It contains:

- tab navigation
- all application state variables
- fetch logic for loading data
- form state handling
- save operations for all modules
- table rendering
- notifications
- reusable UI helper components

This is the largest file in the project and the main implementation hub.

---

### 5.2 Application state model

The app uses several React state buckets, for example:

- `sopBooks`, `allSops` – SOP information
- `tests` – tests and competency metadata
- `competencyProcedures` – competency procedure catalog
- `staff` – registered staff
- `competencyRecords` – competency assessments
- `sections` – laboratory sections
- `equipment` – equipment registry
- `notification` – success or warning message displayed to the user
- `showCompetencyForm` and `showEquipmentForm` – toggles for collapsible forms

This design keeps the UI responsive and simple to manage while the data set grows.

---

### 5.3 Fetch and data loading pattern

The `fetchAll()` function loads data from the backend in parallel using `Promise.allSettled()`.

This is a strong pattern because it:

- reduces waiting time
- lets the dashboard load all data quickly
- prevents a failure in one request from crashing the whole page

For each fetch, the app updates the corresponding state and logs any failures in `loadError`.

This is important for real application resilience.

---

### 5.4 Form handling and payload generation

The app uses a single generic `onChange` helper and a `submit()` function for many route submissions.

The `submit()` function is responsible for:

- selecting the right payload format per endpoint
- converting arrays to numbers where needed
- validating IDs
- sending the POST request
- showing a user-friendly notification
- refreshing the data from the server
- resetting the form

This is a very important abstraction because many forms in the app share similar patterns.

Examples:

- `/competency-procedures` requires `section_id`, `sop_ids`, and `equipment_ids`
- `/staff` expects `section_ids` and `competency_procedure_ids`
- `/competency-records` automatically derives the `test_id` and `sop_ids` from the selected procedure

The app does a good job of centralizing the complexity instead of repeating logic in every form.

---

### 5.5 Notification system

The `Notification` component is displayed at the top of a tab when the user performs a successful action.

Example messages include:

- “Competency procedure X registered successfully.”
- “Laboratory staff Y registered successfully.”
- “Competency assessment recorded successfully.”

The notification is intentionally brief and timed. After a few seconds, it disappears.

This is a simple but effective UX pattern: after a form save, the user sees immediate positive feedback without a disruptive modal.

---

### 5.6 Collapsible form behavior

One of the important UI patterns in this project is the “collapsed form with plus button” interaction.

Examples:

- `showEquipmentForm`
- `showCompetencyForm`

When the user clicks the `+` icon:

- the form expands
- the user fills it in
- on successful save the form hides again
- the table remains visible
- the success notification appears briefly

This behavior is a direct improvement to user experience because it keeps the table readable while still giving the user a clear path to create new records.

This is exactly the right pattern for a data-heavy quality dashboard: prioritise the record list, reveal forms only when needed, and then collapse back to the default overview state.

---

### 5.7 Competency tab details

The `competency` case in the tab switch is the most important domain in this project.

It displays:

- the competency procedure table
- a collapsible registration form
- a list of competency assessment history records

Main form behavior:

- user selects a section
- user enters a procedure title
- user selects one or more SOPs from a chosen SOP book
- optional equipment is selected
- user clicks “Register Competency Procedure”

The code validates that at least one SOP is selected before submission.

After save:

- the backend creates the procedure and its associated test record
- the form hides
- the table refreshes with the newly created procedure
- the small notification appears

This is the exact workflow the project needs for CAP competency management.

---

### 5.8 Staff tab details

The staff tab allows a lab administrator to register personnel and connect them to sections and competencies.

Users can:

- enter employee details
- select primary and additional sections
- choose competency procedures already on record
- save a new staff member

The backend creates initial competency records automatically for selected procedures, which reduces the administrative burden and keeps the system consistent from the start.

---

### 5.9 SOP tab details

The SOP tab is focused on the controlled document side of the quality system.

It includes:

- SOP book list
- filtered SOP list based on selected book
- review-date warnings for expired or soon-to-expire SOPs
- import actions from markdown documentation
- SOP book and SOP creation forms

This is a very practical feature: the system helps the lab monitor documentation lifecycle, which is central to CAP and quality compliance.

---

### 5.10 Equipment tab details

The equipment tab shows which instruments are registered and which sections they support.

It includes:

- equipment table
- add equipment form
- section selection using a multi-select widget
- save and cancel flow

This matters for competency procedures because equipment can be linked to a procedure to show what instruments are used in that method or assessment process.

---

### 5.11 Reusable helper components

The frontend includes several reusable building blocks:

#### `Panel`
Wraps a section with a title and content area.

#### `Form`
Generic form generator for simple inputs.

#### `Table`
Displays structured data in rows and columns.

#### `ApplicableSopsCell`
Shows a compact summary of SOP count and provides a popover to view the exact SOPs linked to a competency procedure.

#### `SummaryCard` and `MetricCard`
Used for dashboard KPIs.

#### `Notification`
Shows a small success/error message for immediate feedback.

#### `MultiSelect`
Enables selecting multiple related items (sections, equipment, competencies) through a tag-based UI.

These shared components keep the UI consistent and make the code easier to maintain.

---

## 6. Important implementation decisions in this project

### Decision 1: Single-page dashboard over multi-page app

This project uses one page with tabbed sections instead of a larger router-based app. That is suitable for an internal quality dashboard where data entry and review happen in a focused workflow.

### Decision 2: SQLite-first development

The system is built to work locally with SQLite while being ready for PostgreSQL and future production expansion. This keeps the setup simple and avoids heavy infrastructure on early iterations.

### Decision 3: Generating IDs automatically

The app generates codes like `STF-`, `EQP-`, and `CMP-` automatically instead of expecting the user to type them. This reduces manual errors and keeps records standardized.

### Decision 4: Business logic in the backend

The project keeps validation and relational rules in FastAPI and SQLAlchemy instead of in the browser alone. This is critical because data integrity should not be dependent on the frontend.

### Decision 5: Human-centered UI simplification

The collapsible form pattern, plus notification, and small inline controls reflect an understanding that a quality dashboard needs to prioritize readability and workflow efficiency over raw form density.

---

## 7. Data flow walkthrough: how a competency procedure is created

This is the most representative process in the app.

1. User clicks the `+` button in the competency panel.
2. The form expands and shows fields for section, title, SOP selection, and equipment.
3. User selects the section and at least one SOP.
4. User submits the form.
5. The frontend runs `submit('/competency-procedures', procedureForm, resetProcedure)`.
6. The payload is transformed to include numeric IDs for `section_id`, `sop_ids`, and `equipment_ids`.
7. The backend validates that the selected section exists and that the selected SOPs and equipment records exist.
8. The backend creates a new `Test` record and a `CompetencyProcedure` record.
9. The procedure links to the selected SOPs and equipment.
10. The frontend receives the saved record from the backend.
11. The app refreshes the dataset from the server.
12. The form collapses back to the table view.
13. A brief success notification appears.

This is a clean end-to-end pattern that demonstrates the app’s full lifecycle.

---

## 8. Data flow walkthrough: how a competency assessment is recorded

The application also supports capturing a competency assessment history.

1. The user selects a staff member, a procedure, and the assessment phase.
2. The app calculates the next permitted phase using prior records.
3. The backend checks the existing records for that staff member and test.
4. If the previous phase sequence is valid, it allows saving.
5. The backend creates a `CompetencyRecord` and links associated SOPs.
6. The frontend refreshes the table and updates the summary.

This logic is important because competency tracking is not random; it follows a controlled lifecycle and regulatory rhythm.

---

## 9. What this project is already doing well

- It keeps the UI simple and focused on real operational tasks
- It ties quality data together across SOPs, staff, equipment, and competency
- It uses a consistent table-and-form pattern for record management
- It reduces manual work with imports and auto-generation of IDs
- It validates key data in the backend instead of trusting the frontend alone
- It preserves older SQLite data through schema patching logic

---

## 10. Where the project can evolve further

This system is already a solid foundation, but it can continue to grow in a few directions:

- add authentication and authorization for staff and supervisors
- add audit trails and modification history
- add more role-based permissions
- create analytical dashboards by section and competency cycle
- add PDF or export generation for CAP reports
- move to PostgreSQL for production scale and stronger relational support
- add scheduled review reminders for expired SOPs and staff due for competency re-evaluation

---

## 11. Personal development reflection

This project represents a real-world lab quality management system built from the ground up. It combines practical data management with regulatory awareness, and the result is a system that is not just a demo — it mirrors the logic and workflow of a functioning lab quality operation.

The most important lesson is that quality systems are not only about forms and tables. They are about:

- data integrity
- lifecycle tracking
- clear ownership
- structured review
- visibility for audit readiness

The code reflects that understanding and is a strong foundation for a future enterprise-grade laboratory QMS.

---

## 12. Summary

The JCRC CAP LabQMS Dashboard is a full-stack application that links operational laboratory data to audit readiness workflows. The backend provides the relational logic, the frontend provides the interface, and the project as a whole is structured around the real needs of a lab-quality environment.

The key achievement is that the app does not simply store data; it enables a structured quality system where SOPs, staff, equipment, and competencies are managed together with traceability and governance in mind.

This is a meaningful and valuable project because it sits at the intersection of software engineering, laboratory operations, and compliance management.

---

## 13. Quick module map

Frontend

- `frontend/src/App.jsx` – main UI, state, API integration, all dashboard and tab logic
- `frontend/src/index.css` – styling for cards, panels, forms, tables, notifications
- `frontend/index.html` – application shell

Backend

- `backend/app/main.py` – API entry point and startup config
- `backend/app/models.py` – database model definitions
- `backend/app/schemas.py` – request and response validation
- `backend/app/crud.py` – data access and object creation logic
- `backend/app/database.py` – engine, session, migration helpers
- `backend/app/config.py` – configuration and environment handling
- `backend/app/section_mapping.py` – SOP-to-section mapping logic
- `backend/app/sop_import.py` – import SOP documents from markdown files

This document is intended to serve as both a technical summary and a developmental memory of how the system evolved.
