# LabQMS — CAP Accreditation Checklist Integration Framework

**Project:** Laboratory Quality Management System (LabQMS)  
**Standard:** College of American Pathologists (CAP) Accreditation  
**Primary Checklist Focus:** All Common Checklist (COM) & Departmental Checklists  
**Version:** 1.0  
**Target Folder:** `/checklists/cap/`  

---

## 1. Overview

This document outlines the architecture for integrating the **CAP All Common Checklist (COM)** and specialized departmental checklists (e.g., Laboratory General, Hematology, Flow Cytometry, Immunology, Clinical Chemistry) into the LabQMS PostgreSQL database.

The objective is to achieve continuous audit readiness by mapping each CAP checklist requirement directly to:
1. Standard Operating Procedures (SOPs)
2. Personnel Competency Assessments
3. Equipment Maintenance & Calibration Records
4. Quality Control & EQA Events
5. Specific Laboratory Tests

---

## 2. Recommended Directory Structure

Store all raw, processed, and schema-mapped CAP checklist documentation in your repository under the following structure:

```text
checklists/
└── cap/
    ├── README.md
    ├── CAP_CHECKLIST_FRAMEWORK.md
    ├── master_requirements_index.csv
    ├── com_all_common/
    │   ├── com_quality_management.md
    │   ├── com_specimen_handling.md
    │   ├── com_results_reporting.md
    │   └── com_reagents_supplies.md
    ├── gen_laboratory_general/
    │   ├── gen_safety.md
    │   ├── gen_facilities.md
    │   └── gen_personnel.md
    └── departmental/
        ├── hem_hematology.md
        ├── chm_clinical_chemistry.md
        ├── imm_immunology.md
        └── flc_flow_cytometry.md

3. Database Schema Mapping
​The checklist items connect to the database via Module 11 (CAP Accreditation) and relate directly to operational tables.

cap_checklists ──> cap_requirements ──> cap_questions ──> cap_evidence ──> cap_findings
                                 │
└──> test_cap (Junction Table) ──> tests

Table Definitions Summary

Table NameDescriptionKey Foreign Keys
cap_checklistsMaster registry of CAP checklists (COM, GEN, HEM, CHM).laboratory_id
cap_requirementsIndividual requirement codes (e.g., COM.01200, COM.04250).checklist_id
cap_questionsSpecific questions, phase (Phase I / Phase II), and criteria.requirement_id
cap_evidenceLinked digital evidence (SOP version, QC log, Calibration record).requirement_id, sop_id, equipment_id
cap_findingsAudit deficiencies, non-conformances, and resolution status.requirement_id, audit_id
test_capJunction table mapping CAP requirements to specific laboratory tests.test_id, requirement_id

4. Core CAP Checklist Requirement Schema Model
​Every checklist item added to the /checklists/cap/ folder must follow this standardized data fields template:


### Requirement Code: COM.XXXXX

* **Checklist Category:** All Common Checklist (COM)
* **Phase Level:** Phase II
* **Subject:** Specimen Collection and Handling
* **Standard Statement:** [Official CAP requirement statement text]
* **Declarative Objective:** Verify that specimen acceptance and rejection criteria are documented and enforced.

#### System Verification Requirements
* [ ] **Linked SOP:** `SOP-GEN-001` (Specimen Collection & Processing)
* [ ] **Required Form/Log:** Specimen Rejection Log
* [ ] **Responsible Role:** Quality Manager / Technical Supervisor
* [ ] **Database Entity:** `samples`, `sample_disposal`

#### Compliance Verification Criteria
1. Written policy defines criteria for specimen rejection.
2. Log of rejected specimens contains date, reason, and notification details.
3. Annual review documented by Laboratory Director.

5. CAP Requirement Linkage Matrix
​To ensure compliance across all 15 modules of LabQMS, every CAP requirement must map to at least one operational core entity:

CAP DomainPrimary Checklist CodeLabQMS Database JunctionTarget Verification Evidence
Document ControlCOM.01000 – COM.01600sop_versions, sop_reviewsApproved SOPs, Annual Reviews
Personnel & CompetencyCOM.03000 – COM.03400staff_competencies, competency_events6-Month / Annual Competency Assessments
Equipment & InstrumentsCOM.04000 – COM.04500equipment_maintenance, equipment_calibrationMaintenance logs, Verification records
Reagents & SuppliesCOM.05000 – COM.05300reagent_lots, inventory_transactionsExpiry logs, Parallel testing records
Quality ControlCOM.06000 – COM.06700qc_runs, qc_results, westgard_rulesDaily QC graphs, Out-of-control CAPA
Safety & FacilitiesGEN.20000 – GEN.28000audits, audit_findingsSafety inspection logs, Waste disposal logs

6. Implementation Workflow
​Populate Folder: Place raw markdown checklist files in /checklists/cap/.
​Seed Database: Parse checklist files into SQL seed scripts populating cap_checklists and cap_requirements.
​Map Operational Tables: Link each requirement_id to its corresponding sop_id, equipment_id, and test_id.
​Automate Monitoring: Enable automated compliance rules in the FastAPI backend to trigger notifications if evidence (e.g., annual SOP review or equipment maintenance) is missing or expired.
