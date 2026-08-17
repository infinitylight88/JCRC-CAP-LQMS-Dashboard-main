# LabQMS Database Schema

This folder contains the PostgreSQL schema generated from the repository documentation and markdown architecture.

## Files

- `schema.sql` — Full PostgreSQL DDL for LabQMS database tables.

## Core modules included

- Laboratory structure: `laboratories`, `laboratory_sections`, `departments`, `locations`
- Patient/sample workflow: `patients`, `patient_visits`, `requisitions`, `accession_numbers`, `samples`, `sample_barcodes`, `sample_storage`, `sample_disposal`
- Laboratory test menu: `tests`, `test_categories`, `test_methods`, `specimen_requirements`, `turnaround_times`
- SOP/document control: `sop_books`, `sops`, `sop_versions`, `sop_reviews`, `sop_change_logs`, `sop_readers`, `sop_controlled_copies`, `sop_attachments`
- Personnel: `staff`, `staff_positions`, `roles`, `permissions`, `user_accounts`
- Competency management: `competency_programs`, `competency_requirements`, `competency_events`, `competency_results`, `competency_authorizations`
- Equipment: `equipment`, `equipment_categories`, `equipment_maintenance`, `equipment_calibration`, `equipment_verification`, `equipment_service_history`, `equipment_downtime`
- Inventory: `manufacturers`, `suppliers`, `reagents`, `reagent_lots`, `supply_kits`, `kit_lots`, `consumables`, `inventory_transactions`
- Quality control: `qc_materials`, `qc_lots`, `qc_runs`, `qc_results`, `westgard_rules`
- External quality assessment: `eqa_providers`, `eqa_events`, `eqa_results`
- CAP accreditation: `cap_checklists`, `cap_requirements`, `cap_questions`, `cap_evidence`, `cap_findings`, `test_cap`
- CLIA compliance: `clia_requirements`, `clia_mapping`
- ISO mapping: `iso_requirements`, `iso_mapping`
- Audit management: `internal_audits`, `audit_findings`, `capas`
- Reporting support: `reports`
- Relationships: `test_sops`, `test_equipment`, `test_reagents`, `test_competencies`

## Notes

- The schema is based on the root-level documentation and the `docs/` folder content.
- It is designed for PostgreSQL and uses standard relational normalization with historical records and audit traceability.
