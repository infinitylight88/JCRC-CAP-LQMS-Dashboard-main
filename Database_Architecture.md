# Laboratory Quality Management System (LabQMS)

## Database Architecture

**Database:** PostgreSQL  
**Backend:** Python + FastAPI  
**Frontend:** React + Tailwind CSS  
**Dashboard:** React  
**Version:** 1.0  

---

## 1. Purpose

This document defines the architecture of the Laboratory Quality Management System (LabQMS) database.

The database is designed to digitize and integrate all laboratory quality management activities while maintaining compliance with:

* ISO 15189:2022
* CAP Accreditation
* CLIA
* GCLP

The database follows a highly normalized relational design to eliminate duplicate information while maintaining complete traceability.

---

## 2. System Design Philosophy

The database is centered around the laboratory workflow.

Every operational activity originates from one of the laboratory tests contained within the official laboratory test menu.

Every record is therefore connected either directly or indirectly to:

* Laboratory
* Laboratory Section
* Test
* Sample
* Patient
* Staff

---

## 3. Core Architecture

Laboratory
│
├── Sections
│   │
│   ├── Tests
│   │   │
│   │   ├── SOPs
│   │   ├── Competencies
│   │   ├── Equipment
│   │   ├── Reagents
│   │   ├── QC
│   │   ├── CAP
│   │   ├── CLIA
│   │   ├── ISO
│   │   └── Audit
│
├── Personnel
├── Inventory
├── Documents
├── Sample Tracking
└── Reports

---

## 4. Major Database Modules

### Module 1: Laboratory Administration

**Purpose:** Defines the laboratory organizational structure.

**Tables:**
* `laboratories`
* `laboratory_sections`
* `departments`
* `locations`

---

### Module 2: Patient and Sample Management

**Purpose:** Track patients, visits, requests and laboratory specimens.

**Tables:**
* `patients`
* `patient_visits`
* `requisitions`
* `accession_numbers`
* `samples`
* `sample_types`
* `barcodes`
* `sample_storage`
* `sample_disposal`

**Relationships:**

Patient ──> Visit ──> Requisition ──> Accession Number ──> Sample ──> Barcode


---

### Module 3: Laboratory Test Menu

**Purpose:** Master catalogue of all laboratory tests.

**Tables:**
* `test_categories`
* `tests`
* `test_methods`
* `specimen_requirements`
* `turnaround_times`

**Relationships:**
  Section ──> Test ──> Method ──> Specimen Requirement

  
---

### Module 4: Document Control

**Purpose:** Manage all controlled laboratory documents.

**Tables:**
* `sop_books`
* `sops`
* `sop_versions`
* `sop_control_pages`
* `sop_reviews`
* `sop_change_logs`
* `sop_readers`
* `sop_controlled_copies`
* `sop_attachments`

**Relationships:**

  Book ──> SOP ──> Version ──> Review ──> Change Log

  
---

### Module 5: Personnel

**Purpose:** Manage laboratory staff.

**Tables:**
* `staff`
* `staff_positions`
* `user_accounts`
* `roles`
* `permissions`

---

### Module 6: Competency Management

**Purpose:** Track staff authorization for every laboratory test.

**Competency Lifecycle:**
Training ──> Initial Competency ──> 6-Month Competency ──> Annual Competency

  
**Tables:**
* `competency_programs`
* `competency_requirements`
* `competency_events`
* `competency_results`
* `competency_assessors`
* `competency_authorizations`

---

### Module 7: Equipment Management

**Purpose:** Maintain equipment lifecycle.

**Tables:**
* `equipment`
* `equipment_categories`
* `equipment_maintenance`
* `equipment_calibration`
* `equipment_verification`
* `equipment_service_history`
* `equipment_downtime`

---

### Module 8: Inventory Management

**Purpose:** Track laboratory inventory.

**Tables:**
* `suppliers`
* `manufacturers`
* `reagents`
* `reagent_lots`
* `supply_kits`
* `kit_lots`
* `consumables`
* `inventory_transactions`

---

### Module 9: Quality Control

**Purpose:** Manage internal quality control.

**Tables:**
* `qc_materials`
* `qc_lots`
* `qc_runs`
* `qc_results`
* `westgard_rules`

---

### Module 10: External Quality Assessment

**Tables:**
* `eqa_providers`
* `eqa_events`
* `eqa_results`

---

### Module 11: CAP Accreditation

**Tables:**
* `cap_checklists`
* `cap_requirements`
* `cap_questions`
* `cap_evidence`
* `cap_findings`

---

### Module 12: CLIA Compliance

**Tables:**
* `clia_requirements`
* `clia_mapping`

---

### Module 13: ISO 15189

**Tables:**
* `iso_clauses`
* `iso_mapping`

---

### Module 14: Audit Management

**Tables:**
* `audits`
* `audit_findings`
* `audit_evidence`
* `corrective_actions`
* `preventive_actions`
* `capa_follow_up`

---

### Module 15: Dashboard & Reporting

**Tables:**
* `dashboard_settings`
* `notification_rules`
* `notifications`
* `report_templates`

---

## 5. Relationship Tables

These are the most important tables in the system. They connect independent modules together.

| Relationship | Junction Table Name |
| :--- | :--- |
| **Test ↔ SOP** | `test_sops` |
| **Test ↔ Equipment** | `test_equipment` |
| **Test ↔ Reagents** | `test_reagents` |
| **Test ↔ Competency** | `test_competencies` |
| **Test ↔ QC** | `test_qc` |
| **Test ↔ CAP** | `test_cap` |
| **Test ↔ CLIA** | `test_clia` |
| **Test ↔ ISO** | `test_iso` |
| **Staff ↔ Competency** | `staff_competencies` |
| **Staff ↔ SOP** | `staff_sop_reading` |
| **Equipment ↔ Reagent Lots** | `equipment_reagent_lots` |

---

## 6. Barcode Architecture

The barcode system supplements—not replaces—the existing laboratory identifiers.

### Identifiers Structure
* **Patient ID** (Patient identification)
* **Accession Number** (Order / Visit level identification)
* **Barcode** (Physical specimen level universal identifier)

  Patient ──> Patient ID ──> Visit ──> Requisition ──> Accession Number ──> Sample ──> Barcode

  
### Barcode Features
* Printed during phlebotomy
* Attached to every specimen
* Scanned at every workflow stage
* Supports 1D (Code 128) or 2D (QR) barcodes
* Preserves existing LIMS accession numbering

---

## 7. Primary Keys

Every major entity will use universally unique identifiers (**UUIDs**).

**Examples:**
`laboratory_id`, `section_id`, `patient_id`, `visit_id`, `requisition_id`, `accession_id`, `sample_id`, `barcode_id`, `test_id`, `sop_id`, `competency_id`, `equipment_id`, `reagent_id`, `qc_id`, `audit_id`

*UUIDs simplify API development, prevent key collisions during offline sync, and improve security.*

---

## 8. Audit Trail

Every major table will include standard compliance audit columns:

* `created_at` (TIMESTAMP)
* `created_by` (UUID)
* `updated_at` (TIMESTAMP)
* `updated_by` (UUID)
* `archived_at` (TIMESTAMP, nullable)
* `archived_by` (UUID, nullable)
* `status` (VARCHAR/ENUM)
* `remarks` (TEXT)

> **Regulatory Rule:** No quality record should be permanently deleted. Records should instead be soft-deleted / archived to preserve full historical traceability and comply with ISO 15189 / CAP accreditation requirements.

---

## 9. Development Roadmap

* **Phase 1: Documentation** — ✅ Complete
* **Phase 2: Database Architecture** — ✅ Complete
* **Phase 3: Entity Relationship Diagram (ERD)** — ⏳ Pending (Next)
* **Phase 4: Python Database Builder** — ⏳ Pending
* **Phase 5: Seed Data** — ⏳ Pending
* **Phase 6: FastAPI Backend** — ⏳ Pending
* **Phase 7: React Dashboard** — ⏳ Pending
* **Phase 8: Barcode Integration** — ⏳ Pending
* **Phase 9: Production Deployment** — ⏳ Pending

---

## 10. Long-Term Vision

The LabQMS will serve as the laboratory's central digital quality platform.

Every laboratory activity—from document control and competency assessment to sample tracking, quality control, equipment maintenance, reagent management, CAP compliance, CLIA compliance, ISO 15189 requirements, and accreditation audits—will be stored in a single integrated relational database.

The barcode system will unify physical specimens with digital records while preserving existing Patient IDs and Laboratory Accession Numbers, enabling complete traceability from patient registration through specimen collection, testing, reporting, storage, retrieval, and final disposal.


  
  
  
  
