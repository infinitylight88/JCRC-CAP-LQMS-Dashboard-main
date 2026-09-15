# JCRC INTEGRATED QUALITY & OPERATIONS SYSTEM

## JCRC-iQOS

### Master System Development, Architecture, Integration & Production Roadmap

**Document Type:** Master Project Architecture & System Development Specification
**Project:** JCRC Integrated Quality & Operations System
**Short Name:** JCRC-iQOS
**Status:** Concept / Architecture & Development Planning
**Primary Repository Document:** `JCRC_iQOS_MASTER_SYSTEM_ARCHITECTURE.md`
**Intended Audience:** JCRC Management, Laboratory Management, Quality Management, Research Department, Clinical/Clinic Teams, IT/Systems Administration, Logistics/Procurement, Developers, System Administrators, Project Stakeholders

---

# 1. DOCUMENT PURPOSE

This document is the **single source of truth for the design, development, integration, deployment and continuous improvement of the JCRC Integrated Quality & Operations System (JCRC-iQOS).**

Any stakeholder should be able to read this document and understand:

* Why JCRC-iQOS is being developed.
* The problems it is intended to solve.
* What the system will and will not replace.
* The major functional modules.
* How laboratory, research, quality, people, documents and logistics functions connect.
* How existing JCRC systems such as LIMS, ICEA and Navision will interact with iQOS.
* How existing paper, PDF and Excel records will be progressively digitized.
* How "living documents" will be managed electronically.
* How CAP audit readiness will be incorporated.
* How research-study compliance will be managed.
* How competency, training and credentials will be managed.
* How the system will be deployed on JCRC infrastructure.
* How security, audit trails, backup and governance will be handled.
* How the system will progress from concept → prototype → pilot → validated production.
* How the software will be developed in a controlled and modular manner.

This document is also intended to provide a common technical and operational reference for developers using **GitHub, Codex, GitHub Copilot, VS Code, Django, Next.js/React, PostgreSQL and related technologies**.

---

# 2. EXECUTIVE SUMMARY

JCRC-iQOS is proposed as an **integrated digital quality and operations platform** for the JCRC ecosystem.

The system is not intended to replace existing enterprise systems.

Instead, it will provide a controlled digital layer that connects:

* Laboratory quality management.
* Laboratory operational information.
* CAP audit readiness.
* Internal audits.
* CAPA.
* Risk management.
* Document control.
* Staff competency.
* Training.
* Credentials and certifications.
* Research studies.
* Study-team compliance.
* Laboratory equipment.
* Reagents and quality information.
* Logistics information.
* Clinical/patient context where appropriate.
* Research participant/study context.
* Existing LIMS.
* ICEA.
* Navision.
* Laboratory instruments and middleware.
* Institutional reporting and analytics.

The fundamental architectural principle is:

> **JCRC-iQOS will integrate and strengthen the existing JCRC ecosystem rather than unnecessarily replacing systems that already serve as systems of record.**

The system will progressively transform fragmented information from:

* paper files,
* Excel spreadsheets,
* PDFs,
* existing databases,
* existing applications,
* laboratory instruments,
* study files,

into a **controlled, searchable, traceable and continuously monitored digital quality and operations environment**.

---

# 3. SYSTEM VISION

## 3.1 Vision Statement

> **To establish a secure, modular and integrated digital quality and operations ecosystem that enables JCRC to continuously monitor compliance, laboratory quality, research requirements, personnel competency, controlled documentation, operational processes and institutional performance.**

The system should move JCRC from a model based primarily on:

```text
Periodic review
+
Manual tracking
+
Paper evidence
+
Disconnected spreadsheets
+
Independent systems
```

towards:

```text
Continuous monitoring
+
Controlled digital evidence
+
Automated alerts
+
Integrated systems
+
Traceability
+
Data-driven management
```

---

# 4. THE CORE CONCEPT

JCRC-iQOS should be understood as a **system of systems**.

It consists of:

```text
                         JCRC-iQOS
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
      QUALITY             OPERATIONS            RESEARCH
        │                     │                     │
   CAP Readiness          Laboratory             Studies
   Internal Audits        Equipment              Study Teams
   CAPA                   QC                     Compliance
   Risk                   Reagents               Training
   Indicators             Results                Documents
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    SHARED COMPLIANCE ENGINE
                              │
              ┌───────────────┼────────────────┐
              │               │                │
           PEOPLE         DOCUMENTS         EVIDENCE
              │               │                │
        Competency          SOPs           Audit Trail
        Training            Policies       Verification
        Credentials         Certificates   Approvals
        Roles               Forms          Records
                              │
                     INTEGRATION LAYER
                              │
             ┌────────────────┼────────────────┐
             │                │                │
            LIMS             ICEA           NAVISION
             │                │                │
       Laboratory          Clinical        Logistics
        Systems             Systems         Systems
```

---

# 5. GUIDING ARCHITECTURAL PRINCIPLE

## 5.1 iQOS Does Not Replace Everything

Existing systems should continue to perform their core functions where they are already established.

The target model is:

| System                 | Primary responsibility                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| LIMS                   | Laboratory information and laboratory result workflows                                                     |
| ICEA                   | Existing clinical/patient information and related workflows                                                |
| Navision               | Enterprise logistics/procurement/financially controlled processes as currently implemented                 |
| Laboratory instruments | Primary analytical measurement                                                                             |
| Middleware             | Instrument communication and transformation where applicable                                               |
| JCRC-iQOS              | Quality, compliance, operational oversight, controlled evidence, integration and cross-system intelligence |

The precise system-of-record boundaries must be confirmed during the requirements and technical discovery phases.

---

# 6. PROBLEM STATEMENT

The current ecosystem contains information distributed across multiple environments.

Examples include:

* Physical personnel files.
* SOP files.
* Training records.
* Competency records.
* Research study files.
* Certificates.
* CVs.
* GCP certificates.
* GLCP/GLP-related certificates where applicable.
* Audit documentation.
* CAP-related evidence.
* Equipment documentation.
* Calibration records.
* QC records.
* Excel inventories.
* LIMS information.
* ICEA information.
* Navision information.
* Instrument-generated data.
* Middleware outputs.

This creates several risks:

1. Difficulty determining the current compliance status.
2. Difficulty identifying missing evidence.
3. Difficulty tracking document expiry.
4. Difficulty monitoring study-team compliance.
5. Difficulty obtaining a complete institutional quality picture.
6. Duplication of information.
7. Manual reconciliation between systems.
8. Dependence on individual knowledge.
9. Slow audit preparation.
10. Difficulty continuously monitoring quality requirements.

JCRC-iQOS addresses these problems by introducing a **centralized quality and operational control layer**.

---

# 7. PROJECT OBJECTIVES

The project objectives are to:

1. Establish a centralized digital quality and operations platform.
2. Maintain controlled electronic records and evidence metadata.
3. Improve continuous CAP audit readiness.
4. Digitize the management of living documents.
5. Track personnel competency and training.
6. Monitor staff credentials and expiry dates.
7. Manage research-study compliance.
8. Integrate laboratory quality information.
9. Connect appropriate data from LIMS.
10. Establish an integration strategy for ICEA.
11. Establish an integration strategy for Navision.
12. Connect laboratory instruments/middleware where technically appropriate.
13. Improve audit traceability.
14. Reduce manual administrative work.
15. Improve management visibility.
16. Establish a scalable production architecture.
17. Preserve existing validated/approved systems and processes unless replacement is specifically justified.
18. Create a foundation for future analytics and decision-support systems.

---

# 8. SYSTEM SCOPE

JCRC-iQOS will be modular.

## Core modules

```text
1. Executive Dashboard
2. People & Competency
3. Document Control
4. Laboratory Quality
5. Laboratory Operations
6. Research & Study Compliance
7. Audit Readiness
8. CAPA Management
9. Risk Management
10. Equipment Management
11. Reagents & Inventory Quality
12. Logistics Integration
13. Integration Layer
14. Reports & Analytics
15. Administration & Security
16. Evidence & Audit Trail
```

---

# 9. HIGH-LEVEL SYSTEM MODULES

## 9.1 Dashboard

The dashboard provides role-specific visibility.

Possible dashboards include:

### Executive Dashboard

* Overall quality status.
* Critical compliance gaps.
* CAP readiness.
* Open CAPA.
* High-risk items.
* Expiring documents.
* Research compliance.
* Laboratory indicators.
* Equipment issues.
* Operational indicators.

### Quality Dashboard

* CAP readiness.
* Internal audits.
* Findings.
* CAPA.
* Risk.
* Document status.
* Competency status.

### Laboratory Dashboard

* QC status.
* Equipment.
* Reagents.
* Workload.
* Quality indicators.
* Laboratory compliance.

### Research Dashboard

* Active studies.
* Study teams.
* Missing credentials.
* Expiring credentials.
* Training status.
* Study compliance matrix.
* Study-specific gaps.

---

# 10. PEOPLE & COMPETENCY

People must be treated as a **shared institutional entity**.

A person should not be recreated separately for:

* Laboratory.
* Research.
* Clinic.

Instead:

```text
PERSON
  │
  ├── Employment / affiliation
  ├── Roles
  ├── Competencies
  ├── Training
  ├── Credentials
  ├── Documents
  └── Study assignments
```

## 10.1 Staff Directory

The system should maintain:

* Name.
* Staff identifier.
* Department.
* Role.
* Status.
* Contact information where appropriate.
* Professional information.
* Assigned responsibilities.

## 10.2 Competency Management

Competency records should support:

* Training.
* Initial competency.
* Periodic competency.
* Reassessment.
* Annual competency.
* Competency requirements by role.
* Competency evidence.
* Assessor.
* Date.
* Status.

Existing institutional competency rules should be configured rather than hard-coded.

## 10.3 Training

Track:

* Course.
* Staff member.
* Training date.
* Trainer/provider.
* Certificate.
* Expiry/review date where applicable.
* Status.
* Evidence.

## 10.4 Credentials

Examples:

* Professional credentials.
* Certificates.
* GCP.
* GLCP/GLP where applicable.
* Specialized training.
* Licenses.
* Study-specific certification.

## 10.5 Expiry Monitoring

The system should automatically identify:

```text
VALID
   ↓
90 DAYS
   ↓
60 DAYS
   ↓
30 DAYS
   ↓
EXPIRING
   ↓
EXPIRED
```

Thresholds should be configurable.

---

# 11. DOCUMENT CONTROL

JCRC-iQOS will provide a digital control layer over the existing document system.

The goal is **not necessarily to eliminate physical files**.

The system should allow the institution to continue using physical records where required while electronically tracking:

* Document identity.
* Version.
* Owner.
* Approval.
* Effective date.
* Review date.
* Expiry date.
* Status.
* Location.
* Evidence file.
* Verification.
* Change history.

## 11.1 Document categories

Examples:

```text
Controlled Documents
 ├── SOPs
 ├── Policies
 ├── Forms
 ├── Templates
 └── Work Instructions

Personnel Documents
 ├── CVs
 ├── Certificates
 ├── Licenses
 └── Training Evidence

Research Documents
 ├── Protocols
 ├── Study Documents
 ├── Delegation Records
 └── Study Training

Equipment Documents
 ├── Calibration
 ├── Maintenance
 ├── Qualification
 └── Verification

Quality Evidence
 ├── Audit Records
 ├── CAPA Evidence
 ├── QC Evidence
 └── Risk Records
```

---

# 12. LIVING DOCUMENTS

A "living document" is treated as a structured, controlled record rather than merely a PDF.

For example:

```text
DOCUMENT
Type: CV

PERSON
Staff Member

Version
2026

Issue Date
2026-01-15

Review/Expiry Date
2027-01-15

Status
VALID

Verified By
Quality Officer

Verification Date
2026-01-20

Applicable Studies
Study A
Study B

Evidence
CV_2026.pdf

Physical Location
Personnel File / Section 2
```

This allows the system to answer:

* Which CVs are expiring?
* Which study personnel have expired certificates?
* Which staff are missing required documentation?
* Which documents require review?
* Which studies are affected by missing documentation?

---

# 13. RESEARCH & STUDY COMPLIANCE

Research must be treated as a major system domain.

JCRC may have:

* Multiple concurrent studies.
* Research staff.
* Laboratory staff supporting research.
* Clinic staff supporting research.
* Private patients.
* Research participants.
* Study-specific requirements.
* Study-specific training.
* Study-specific documentation.

The architecture therefore needs to distinguish:

```text
PERSON
   ↓
STUDY ASSIGNMENT
   ↓
ROLE
   ↓
REQUIRED COMPLIANCE ITEMS
   ↓
DOCUMENT / TRAINING / COMPETENCY
   ↓
STATUS
```

## 13.1 Study Management

Each study should have:

* Study identifier.
* Study title.
* Sponsor where applicable.
* Principal investigator.
* Study status.
* Start date.
* End date where applicable.
* Study team.
* Applicable laboratory services.
* Required documentation.
* Compliance requirements.

## 13.2 Study Teams

A study can have:

```text
Study
 ├── Principal Investigator
 ├── Sub-investigators
 ├── Coordinators
 ├── Laboratory staff
 ├── Clinic staff
 └── Other research personnel
```

## 13.3 Study Compliance Matrix

Example:

| Requirement             | Person/Area      | Status   |
| ----------------------- | ---------------- | -------- |
| CV                      | PI               | Valid    |
| GCP                     | PI               | Valid    |
| GCP                     | Coordinator      | Expiring |
| Study Training          | Laboratory Staff | Missing  |
| GLCP/GLP                | Laboratory Staff | Valid    |
| Competency              | Laboratory Staff | Valid    |
| Delegation Record       | Study Team       | Valid    |
| Required SOP            | Laboratory       | Current  |
| Equipment Qualification | Laboratory       | Current  |
| QC Evidence             | Laboratory       | Current  |

The actual requirements must be configured according to the institution, study protocol, sponsor and applicable regulatory/quality requirements.

---

# 14. CENTRAL COMPLIANCE ENGINE

A major architectural principle is that compliance functions should share common infrastructure.

```text
                 COMPLIANCE ENGINE
                        │
       ┌────────────────┼────────────────┐
       │                │                │
     PEOPLE          DOCUMENTS        TRAINING
       │                │                │
   Competency       Versions          Certificates
   Credentials      Approval          Expiry
       │                │                │
       └────────────────┼────────────────┘
                        ↓
                  COMPLIANCE STATUS
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
      CAP             RESEARCH        OPERATIONS
    Readiness        Compliance       Compliance
```

This avoids creating independent systems for each department.

---

# 15. AUDIT READINESS

Audit Readiness is a major module.

The parent navigation should include:

```text
Audit Readiness
│
├── All Common
├── Departmental Audit Management
├── CAPA Management
└── Risk Management
```

Where applicable, additional departmental checklist areas may include:

```text
Hematology & Coagulation
Transfusion Medicine
Chemistry & Toxicology
Flow Cytometry
Microbiology
Urinalysis
Other applicable laboratory sections
```

The exact checklist set must be configured from the applicable institutional/accreditation scope.

---

# 16. CAP AUDIT READINESS

The CAP subsystem should maintain a structured registry of requirements.

Conceptually:

```text
CAP Requirement
      │
      ├── Checklist
      ├── Section
      ├── Requirement
      ├── Department
      ├── Owner
      ├── Frequency
      ├── Evidence
      ├── Status
      ├── Finding
      └── Corrective Action
```

Possible statuses:

```text
COMPLIANT
PARTIALLY COMPLIANT
NON-COMPLIANT
NOT APPLICABLE
MISSING EVIDENCE
UNDER REVIEW
```

The system should allow mapping:

```text
CAP REQUIREMENT
       ↓
JCRC PROCESS
       ↓
CONTROL
       ↓
EVIDENCE
       ↓
RESPONSIBLE PERSON
       ↓
REVIEW DATE
```

---

# 17. ALL COMMON

The All Common page should function as a checklist/readiness explorer.

Possible features:

* Checklist sections.
* Requirement list.
* Compliance status.
* Evidence.
* Owner.
* Due date.
* Notes.
* Findings.
* Related SOP.
* Related document.
* Related competency.
* Related equipment.
* Related CAPA.
* Audit history.

---

# 18. DEPARTMENTAL AUDIT MANAGEMENT

This module should support:

* Audit planning.
* Audit schedules.
* Department.
* Auditor.
* Audit date.
* Checklist.
* Findings.
* Evidence.
* Corrective actions.
* Follow-up.
* Closure.
* Audit reports.

---

# 19. CAPA MANAGEMENT

CAPA means Corrective and Preventive Action.

A CAPA record should support:

```text
Finding
   ↓
Immediate Action
   ↓
Investigation
   ↓
Root Cause Analysis
   ↓
Corrective Action
   ↓
Preventive Action
   ↓
Implementation
   ↓
Verification
   ↓
Effectiveness Review
   ↓
Closure
```

CAPA should be linked to:

* Audit.
* CAP requirement.
* Risk.
* Department.
* Staff.
* Process.
* Evidence.
* Due date.

---

# 20. RISK MANAGEMENT

The Risk module should maintain a structured risk register.

A risk may include:

* Risk ID.
* Process.
* Description.
* Cause.
* Consequence.
* Likelihood.
* Severity.
* Initial risk.
* Existing controls.
* Additional controls.
* Residual risk.
* Owner.
* Review date.
* Status.

Risk should connect to:

```text
Risk
 ↓
Control
 ↓
Evidence
 ↓
Monitoring
 ↓
CAPA if necessary
```

---

# 21. LABORATORY QUALITY

Laboratory quality should be integrated into the broader quality system.

Major areas include:

```text
Laboratory Quality
│
├── QC
├── Instruments
├── Equipment
├── Reagents & Lots
├── Calibration
├── Verification
├── AMR
├── EQA
├── Quality Indicators
├── Critical Values
├── Delta Checks
└── Reports
```

Existing laboratory analytical systems should remain the primary source of analytical measurements where applicable.

---

# 22. LABORATORY INSTRUMENT INTEGRATION

The architecture must support integration with laboratory instruments and middleware.

Example:

```text
Instrument
    ↓
Instrument Output
    ↓
Middleware
    ↓
Transformation / Parsing
    ↓
LIMS
    ↓
Laboratory Results
    ↓
iQOS Quality / Analytics
```

Where technically appropriate, instrument data may be used for:

* QC analytics.
* Workload analysis.
* Instrument performance.
* TAT monitoring.
* Error monitoring.
* Reagent consumption.
* Quality indicators.

The existing laboratory middleware development experience provides a useful prototype for this architecture.

---

# 23. LIMS INTEGRATION

The LIMS should remain the primary laboratory information system where designated.

JCRC-iQOS should interact through a controlled integration layer.

Possible mechanisms include:

* API.
* Database views.
* Read-only database connection.
* Secure exports.
* Scheduled file exchange.
* Middleware.
* Event-based integration.

The final mechanism must be established during technical discovery.

## Initial integration strategy

Start with **read-only integration wherever possible**.

```text
LIMS
 ↓
Approved interface
 ↓
iQOS Integration Layer
 ↓
iQOS
```

This minimizes risk.

Later, selected bidirectional integrations may be considered after appropriate technical and validation assessment.

---

# 24. ICEA INTEGRATION

ICEA should be treated as an existing system of record for the information it currently controls.

The architecture should allow:

```text
ICEA
 ↓
Approved Integration Interface
 ↓
iQOS Integration Layer
 ↓
Quality / Operational Context
```

Potential mechanisms:

* API.
* Secure database view.
* Approved data export.
* Integration service.
* Scheduled synchronization.

The actual interface must be determined after technical assessment of the deployed ICEA environment.

---

# 25. PATIENT AND RESEARCH CONTEXT

JCRC-iQOS must distinguish between:

```text
Clinical Patient
Research Participant
Private Patient
Study-related Laboratory Activity
Routine Laboratory Activity
```

A laboratory can serve multiple contexts.

Conceptually:

```text
                    PERSON
                       │
             ┌─────────┴─────────┐
             │                   │
       Clinical Context    Research Context
             │                   │
            ICEA                STUDY
             │                   │
             └─────────┬─────────┘
                       ↓
                    LABORATORY
                       ↓
                      LIMS
```

The system should avoid unnecessary duplication of patient/participant information.

---

# 26. NAVISION / LOGISTICS INTEGRATION

Navision should remain the designated enterprise system for the functions it currently controls.

iQOS can consume appropriate logistics information.

Potential information includes:

* Procurement.
* Suppliers.
* Purchase orders.
* Stock.
* Reagents.
* Consumables.
* Item codes.
* Delivery.
* Inventory status.

Conceptually:

```text
                    NAVISION
                       │
             Logistics / Procurement
                       │
                Integration Layer
                       │
                     iQOS
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
     Reagents      Equipment       Quality
      & Lots         Items        Indicators
```

This creates opportunities to correlate:

```text
Procurement
     ↓
Inventory
     ↓
Reagent Lot
     ↓
Laboratory Use
     ↓
QC
     ↓
Quality Event
```

---

# 27. INTEGRATION LAYER

The integration layer is one of the most important architectural components.

It separates iQOS from direct dependency on external applications.

```text
                 JCRC-iQOS
                     │
              Integration Layer
                     │
       ┌─────────────┼──────────────┐
       │             │              │
      LIMS          ICEA         Navision
       │             │              │
    Laboratory     Clinical       Logistics
```

The integration layer may contain:

* API services.
* Connectors.
* Data transformation.
* Validation.
* Authentication.
* Logging.
* Error handling.
* Retry mechanisms.
* Queueing where appropriate.
* Monitoring.

---

# 28. DATA MIGRATION STRATEGY

Existing data will not be moved into iQOS indiscriminately.

Migration will follow a controlled process.

## Stage 1 — Data discovery

Identify:

* Source.
* Owner.
* Format.
* Purpose.
* Current status.
* Location.
* Retention requirement.
* Sensitivity.
* Quality.
* Duplication.

## Stage 2 — Data classification

Classify information as:

```text
Master Data
Transactional Data
Controlled Document
Evidence
Historical Record
Reference Data
External System Data
```

## Stage 3 — Data cleaning

Identify:

* Duplicates.
* Missing fields.
* Invalid dates.
* Inconsistent names.
* Obsolete documents.
* Incorrect versions.
* Incomplete records.

## Stage 4 — Digitization

Sources may include:

* Paper.
* PDF.
* Excel.
* Existing databases.
* Existing applications.

## Stage 5 — Validation

Digitized records should be checked against the original source.

## Stage 6 — Approval

The appropriate responsible person confirms that the migrated record is acceptable.

## Stage 7 — Controlled import

Only approved data enters the production database.

---

# 29. PAPER RECORDS

The objective is not automatically to destroy or eliminate existing paper records.

Where physical records must remain, iQOS should store metadata such as:

```text
Document ID
Document Type
Owner
Version
Status
Physical Location
Cabinet
Drawer
File
Section
```

Therefore:

```text
PHYSICAL EVIDENCE
        +
DIGITAL CONTROL RECORD
        =
TRACEABLE QUALITY SYSTEM
```

---

# 30. DIGITAL EVIDENCE VAULT

iQOS should support evidence management.

Evidence may be:

* Uploaded document.
* Photograph/scan where appropriate.
* Certificate.
* Audit form.
* Training record.
* Equipment certificate.
* QC record.
* CAPA evidence.
* Risk evidence.

The system should store metadata even where the original evidence remains in a controlled external/physical repository.

---

# 31. DATABASE CONCEPT

The production database should use a structured relational model.

Preferred production database:

**PostgreSQL**

Core conceptual entities include:

```text
PERSON
ROLE
DEPARTMENT
STUDY
STUDY_TEAM
COMPETENCY
TRAINING
CREDENTIAL
DOCUMENT
DOCUMENT_VERSION
DOCUMENT_REQUIREMENT
EVIDENCE
CAP_CHECKLIST
CAP_REQUIREMENT
COMPLIANCE_RECORD
AUDIT
AUDIT_FINDING
CAPA
RISK
EQUIPMENT
INSTRUMENT
REAGENT
REAGENT_LOT
QUALITY_EVENT
INTEGRATION_SOURCE
INTEGRATION_RECORD
USER
ROLE_PERMISSION
AUDIT_TRAIL
NOTIFICATION
```

This is a conceptual model and must be refined during database design.

---

# 32. CENTRAL RELATIONSHIP MODEL

The central relationship is:

```text
PERSON
  ↓
ROLE / RESPONSIBILITY
  ↓
STUDY / DEPARTMENT
  ↓
REQUIREMENTS
  ↓
DOCUMENT
TRAINING
COMPETENCY
CREDENTIAL
  ↓
STATUS
  ↓
EVIDENCE
  ↓
COMPLIANCE
```

For studies:

```text
STUDY
  ↓
STUDY TEAM
  ↓
PERSON
  ↓
REQUIRED COMPLIANCE
  ↓
DOCUMENT / TRAINING / COMPETENCY
  ↓
VALID / EXPIRING / EXPIRED / MISSING
```

For CAP:

```text
CAP REQUIREMENT
  ↓
JCRC CONTROL
  ↓
EVIDENCE
  ↓
STATUS
  ↓
AUDIT
  ↓
CAPA / RISK
```

---

# 33. COMPLIANCE STATUS ENGINE

The system should calculate compliance status based on configurable rules.

Examples:

```text
VALID
EXPIRING
EXPIRED
MISSING
UNDER REVIEW
NOT APPLICABLE
PENDING VERIFICATION
```

A compliance record should not simply say "valid".

It should be possible to identify:

* What requirement exists?
* Who/what does it apply to?
* What evidence satisfies it?
* Who verified it?
* When was it verified?
* When must it be reviewed?
* What happens when it expires?

---

# 34. NOTIFICATION ENGINE

The notification system should support:

* Expiry alerts.
* Overdue tasks.
* CAPA deadlines.
* Audit deadlines.
* Risk review dates.
* Competency due dates.
* Training due dates.
* Study compliance gaps.

Notification thresholds must be configurable.

Example:

```text
90 days → Informational
60 days → Reminder
30 days → Warning
Expired → Critical
```

---

# 35. ROLE-BASED ACCESS CONTROL

Access must be based on role and responsibility.

Potential roles:

```text
System Administrator
Institutional Administrator
Laboratory Director
Quality Manager
Quality Officer
Laboratory Manager
Laboratory Scientist
Technologist
Research Director
Principal Investigator
Research Coordinator
Study Team Member
Clinic User
Logistics User
Auditor
Read-only Management User
```

Actual roles must be determined during requirements analysis.

---

# 36. ROLE-SPECIFIC USER EXPERIENCE

Different users should see the information relevant to their responsibilities.

## Laboratory Staff

```text
My Tasks
My Competency
My Training
My Documents
Required SOPs
```

## Quality Officer

```text
Audit Readiness
CAPA
Risk
Documents
Competency
Findings
```

## Research Coordinator

```text
Studies
Study Teams
Credentials
Training
Study Compliance
```

## Management

```text
Institutional Readiness
Critical Risks
CAPA
Research Compliance
Quality Indicators
```

---

# 37. AUDIT TRAIL

All important system activities should be traceable.

The audit trail should capture:

* User.
* Action.
* Record.
* Previous value where appropriate.
* New value where appropriate.
* Date/time.
* Source.
* Reason where required.

Examples:

```text
Document approved
Credential verified
CAP requirement changed
CAPA status changed
Risk updated
Competency assessed
Study team changed
User permission changed
```

---

# 38. SECURITY ARCHITECTURE

Security should include:

* Authentication.
* Role-based authorization.
* Least-privilege access.
* Secure sessions.
* HTTPS/TLS.
* Password protection.
* Database access controls.
* Audit trails.
* Secure file storage.
* Backup.
* Disaster recovery.
* Monitoring.
* Controlled administrative access.

Patient, staff and research information should be handled according to applicable institutional policies and legal/regulatory requirements.

---

# 39. PRODUCTION TECHNOLOGY STACK

The proposed production stack is:

```text
Frontend
Next.js
React
TypeScript
Tailwind CSS

Backend
Python
Django
Django REST Framework

Database
PostgreSQL

Background Processing
Celery / appropriate task processing system

Caching / Queues
Redis where required

Authentication
Institutionally approved authentication mechanism

Deployment
Linux Server
Docker
Reverse Proxy
HTTPS

Source Control
Git
GitHub

Development
VS Code
GitHub Copilot
```

Technology choices remain subject to infrastructure and institutional IT requirements.

---

# 40. WHY NEXT.JS + DJANGO

The production system should be designed as a proper web application rather than relying on a data-analysis dashboard framework as the primary application layer.

### Next.js / React

Provides:

* Modern user interface.
* Modular frontend.
* Role-specific views.
* Routing.
* Responsive design.
* Reusable components.
* Better control over enterprise UI.

### Django

Provides:

* Mature backend framework.
* Authentication.
* ORM.
* Administration.
* REST API support.
* Security features.
* Structured application architecture.
* Strong Python ecosystem.

### PostgreSQL

Provides:

* Relational integrity.
* Transactions.
* Strong querying.
* Scalability.
* Constraints.
* Structured enterprise data storage.

R and Python analytics can remain separate services/components where appropriate.

---

# 41. APPLICATION ARCHITECTURE

```text
                         USER
                          │
                          ↓
                  Next.js Frontend
                          │
                       HTTPS
                          │
                          ↓
                 Django REST API
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     Business          Compliance        Integration
      Logic              Engine             Layer
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ↓
                      PostgreSQL
                          │
          ┌───────────────┼────────────────┐
          ↓               ↓                ↓
       Evidence       Audit Trail      Background Jobs
          │                                │
          └────────────────────────────────┘
```

---

# 42. SERVER DEPLOYMENT

The target environment is the JCRC server/network environment.

A production deployment may resemble:

```text
                    JCRC INTERNAL NETWORK
                            │
                            ↓
                       Users / PCs
                            │
                            ↓
                     Reverse Proxy
                            │
                            ↓
                  JCRC-iQOS Web Server
                            │
                     ┌──────┴──────┐
                     ↓             ↓
                Django API      Next.js
                     │
                     ↓
                PostgreSQL
                     │
              ┌──────┴────────┐
              ↓               ↓
        File/Evidence     Background
          Storage           Services
                              │
                              ↓
                       Integration Layer
                              │
               ┌──────────────┼─────────────┐
               ↓              ↓             ↓
             LIMS            ICEA        NAVISION
```

The exact topology depends on JCRC IT infrastructure.

---

# 43. ENVIRONMENT SEPARATION

The development lifecycle should use separate environments.

```text
DEVELOPMENT
    ↓
TEST
    ↓
STAGING
    ↓
PILOT
    ↓
PRODUCTION
```

Production data should not be casually used in development.

---

# 44. DEVELOPMENT WORKFLOW

All software development should follow:

```text
Requirement
     ↓
Issue / User Story
     ↓
Design
     ↓
Implementation
     ↓
Code Review
     ↓
Automated Testing
     ↓
Integration Testing
     ↓
User Acceptance Testing
     ↓
Release
```

GitHub should be the central source-control environment.

---

# 45. GITHUB REPOSITORY STRUCTURE

A conceptual repository:

```text
jcrc-iqos/
│
├── frontend/
│   └── nextjs/
│
├── backend/
│   └── django/
│
├── integrations/
│   ├── lims/
│   ├── icea/
│   ├── navision/
│   └── instruments/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── documentation/
│
├── docs/
│   └── JCRC_iQOS_MASTER_SYSTEM_ARCHITECTURE.md
│
├── infrastructure/
│   ├── docker/
│   ├── deployment/
│   └── monitoring/
│
├── tests/
│
├── scripts/
│
└── README.md
```

The actual structure may evolve as implementation begins.

---

# 46. DOCUMENTATION STRATEGY

This master document is the **project-level source of truth**.

Additional technical documents may later be generated from it, including:

```text
Database Schema
API Specification
UI Architecture
Integration Specifications
Security Specification
Deployment Guide
Validation Plan
User Manual
Administrator Manual
```

Those documents must not contradict this master architecture.

When architecture changes, this document must be updated.

---

# 47. DATA MIGRATION WORKFLOW

The migration workflow is:

```text
SOURCE IDENTIFICATION
        ↓
DATA INVENTORY
        ↓
DATA CLASSIFICATION
        ↓
DATA QUALITY ASSESSMENT
        ↓
CLEANING
        ↓
DIGITIZATION
        ↓
MAPPING
        ↓
VALIDATION
        ↓
APPROVAL
        ↓
IMPORT
        ↓
POST-IMPORT VERIFICATION
        ↓
PRODUCTION
```

Every migration should have:

* Source.
* Date.
* Responsible person.
* Mapping.
* Validation method.
* Approval.
* Migration log.

---

# 48. MASTER DATA

The system should establish controlled master data for:

* People.
* Departments.
* Roles.
* Studies.
* Document types.
* Training types.
* Competency types.
* Credential types.
* Equipment.
* Instruments.
* Reagents.
* Units.
* Locations.
* CAP sections.
* Requirement categories.

Master data should not be duplicated unnecessarily across modules.

---

# 49. DATA OWNERSHIP

Every major dataset should have a designated owner.

Example:

| Data               | Owner                        |
| ------------------ | ---------------------------- |
| Personnel          | HR/authorized administration |
| Competency         | Laboratory/Quality           |
| Research studies   | Research                     |
| CAP requirements   | Quality                      |
| SOPs               | Document Control/Quality     |
| Laboratory results | LIMS                         |
| Clinical data      | ICEA                         |
| Logistics          | Navision/Logistics           |
| Equipment          | Laboratory/Asset owner       |

The exact ownership model must be agreed with JCRC.

---

# 50. SOURCE-OF-TRUTH PRINCIPLE

A critical design rule:

> **Do not create a second authoritative copy of data unnecessarily.**

For example:

```text
LIMS → authoritative laboratory result
ICEA → authoritative clinical record where applicable
Navision → authoritative logistics transaction where applicable
iQOS → authoritative quality/compliance record
```

iQOS may store:

* identifiers,
* metadata,
* snapshots,
* references,
* derived quality indicators,

as required.

---

# 51. REPORTING & ANALYTICS

The analytics layer should support:

### Quality

* CAP readiness.
* CAPA aging.
* Audit findings.
* Risk distribution.
* Quality indicators.

### People

* Competency status.
* Training status.
* Expiring credentials.

### Research

* Study compliance.
* Missing documents.
* Expiring study credentials.
* Study-team status.

### Laboratory

* QC.
* Workload.
* TAT.
* Instrument performance.
* Reagent usage.

### Management

* Institutional risk.
* Compliance trends.
* Operational performance.
* Critical alerts.

---

# 52. FUTURE INTELLIGENCE

The architecture should eventually support questions such as:

> Is the laboratory currently ready for a CAP audit?

> Which CAP requirements have missing evidence?

> Which staff have expired competency or credentials?

> Which active studies have personnel with missing GCP documentation?

> Which documents expire within 60 days?

> Which study compliance gaps affect laboratory operations?

> Which CAPA actions are overdue?

> Which high-risk processes have ineffective controls?

> Which equipment or reagent issues are associated with quality events?

These capabilities should emerge from structured data rather than manually prepared reports.

---

# 53. VALIDATION STRATEGY

Because the system will support quality-related processes, development must include controlled validation.

Validation should consider:

* Requirements.
* Functional specifications.
* Risk assessment.
* Test cases.
* Expected results.
* Actual results.
* Deviations.
* Approval.
* Change control.

The level of validation required for each function should be determined based on its intended use and applicable institutional requirements.

---

# 54. USER ACCEPTANCE TESTING

Before production:

```text
Requirement
 ↓
Test Scenario
 ↓
Expected Result
 ↓
User Test
 ↓
Actual Result
 ↓
Pass / Fail
 ↓
Issue if failed
 ↓
Resolution
 ↓
Retest
 ↓
Approval
```

Representative users from:

* Laboratory.
* Quality.
* Research.
* Clinic.
* Logistics.
* Management.
* IT

should participate as appropriate.

---

# 55. PILOT DEPLOYMENT

The system should not initially be deployed institution-wide.

A controlled pilot should be selected.

Possible first pilot:

```text
Quality + Laboratory
```

with:

* People.
* Documents.
* Competency.
* CAP readiness.
* CAPA.
* Risk.

Then progressively add:

```text
Research
     ↓
LIMS
     ↓
ICEA
     ↓
Navision
     ↓
Broader institutional functions
```

---

# 56. PHASED IMPLEMENTATION ROADMAP

## Phase 0 — Discovery

Activities:

* Stakeholder identification.
* Current-state assessment.
* Process mapping.
* Existing-system assessment.
* Data inventory.
* Infrastructure assessment.
* Requirements gathering.

Deliverables:

* Current-state map.
* Requirements.
* System inventory.
* Data inventory.
* Integration inventory.

---

## Phase 1 — Foundation

Develop:

* Authentication.
* Users.
* Roles.
* Departments.
* People.
* Basic documents.
* Evidence.
* Audit trail.
* Core database.

---

## Phase 2 — Document & People Compliance

Develop:

* Document Control.
* Living Documents.
* Competency.
* Training.
* Credentials.
* Expiry Monitor.

---

## Phase 3 — Quality Management

Develop:

* CAP requirements.
* All Common.
* Departmental audits.
* CAPA.
* Risk.
* Quality indicators.

---

## Phase 4 — Laboratory Quality

Develop:

* QC.
* Instruments.
* Equipment.
* Reagents.
* Lots.
* Calibration.
* Verification.
* Laboratory analytics.

---

## Phase 5 — Research

Develop:

* Studies.
* Study teams.
* Study assignments.
* Study requirements.
* Study compliance.
* Research documents.
* Study training.
* Credential monitoring.

---

## Phase 6 — LIMS Integration

Start with controlled read-only integration.

Then expand based on validated requirements.

---

## Phase 7 — ICEA Integration

Conduct technical discovery first.

Implement the approved integration mechanism.

---

## Phase 8 — Navision Integration

Implement controlled logistics integration.

---

## Phase 9 — Enterprise Analytics

Combine approved information into management dashboards and institutional reporting.

---

# 57. PRODUCTION READINESS

Before production, verify:

### Infrastructure

* Server available.
* Network configured.
* DNS/hostname where applicable.
* HTTPS configured.
* Firewall rules approved.
* Database deployed.
* Backup configured.

### Application

* Production build tested.
* Environment variables configured.
* Secrets protected.
* Logging enabled.
* Error handling enabled.

### Database

* Migrations completed.
* Constraints validated.
* Backup tested.
* Restore tested.

### Security

* User roles validated.
* Permissions tested.
* Administrative access controlled.
* Audit trail verified.

### Data

* Migration approved.
* Data validated.
* Duplicate handling completed.

### Users

* Training completed.
* UAT approved.
* SOPs/work instructions available.

---

# 58. BACKUP & DISASTER RECOVERY

The production environment must have:

* Scheduled database backups.
* Evidence/file backups.
* Backup retention policy.
* Off-server backup where approved.
* Restore testing.
* Disaster recovery procedure.
* Recovery responsibility.
* Recovery objectives.

A backup is not considered reliable until restoration has been tested.

---

# 59. MONITORING

Production monitoring should cover:

```text
Application
Database
Server
Disk
CPU
Memory
Network
Integration Services
Background Jobs
Failed Imports
Failed Notifications
Authentication Events
```

Critical integration failures should be visible to authorized administrators.

---

# 60. ERROR HANDLING

Integration systems must never silently fail.

For example:

```text
External System
      ↓
Integration
      ↓
VALID
 ├────────────→ Process
 │
INVALID
 ↓
Log
 ↓
Alert
 ↓
Retry / Manual Review
```

Every integration should have:

* Logging.
* Error identification.
* Retry strategy.
* Manual intervention mechanism.
* Status monitoring.

---

# 61. CHANGE MANAGEMENT

Changes must be controlled.

Every significant change should have:

```text
Change Request
 ↓
Impact Assessment
 ↓
Risk Assessment
 ↓
Development
 ↓
Testing
 ↓
Approval
 ↓
Deployment
 ↓
Post-deployment verification
```

Production database changes must use controlled migrations.

---

# 62. SYSTEM GOVERNANCE

JCRC-iQOS should have clear governance.

Recommended governance structure:

```text
Project Sponsor
      │
Steering / Governance Group
      │
Project Lead
      │
 ┌────┼─────────┬─────────┐
 │    │         │         │
Quality IT    Laboratory Research
 │              │
Users / SMEs / Stakeholders
```

The exact governance structure is to be determined by JCRC management.

---

# 63. STAKEHOLDER RESPONSIBILITIES

## Management

* Strategic direction.
* Sponsorship.
* Resource allocation.
* Approval.

## Quality

* Quality requirements.
* CAP requirements.
* Audit processes.
* CAPA.
* Risk.
* Document governance.

## Laboratory

* Laboratory workflows.
* QC.
* Equipment.
* Reagents.
* Competency.
* Laboratory integration requirements.

## Research

* Study requirements.
* Study teams.
* Study documents.
* Training.
* Study compliance.

## Clinic

* Clinical workflow requirements.
* Patient-related integration requirements.

## Logistics

* Procurement.
* Inventory.
* Supply-chain requirements.
* Navision integration.

## IT

* Infrastructure.
* Networking.
* Security.
* Server deployment.
* System integration.
* Backup.
* Technical governance.

## Developers

* Architecture.
* Coding.
* Testing.
* Documentation.
* Deployment support.

---

# 64. DEVELOPMENT PRINCIPLES

The development team should follow these principles:

### 1. Modular

Each major domain should be independently maintainable.

### 2. API-first

System communication should use well-defined interfaces.

### 3. Secure by design

Security must be included from the beginning.

### 4. Auditable

Important actions must be traceable.

### 5. Configurable

Requirements should be configurable where possible rather than hard-coded.

### 6. Source-of-truth aware

Do not duplicate authoritative external data unnecessarily.

### 7. Validatable

Important functions must be testable and documented.

### 8. Maintainable

Code should be understandable by future developers.

### 9. Scalable

The system must support additional departments and studies.

### 10. User-centered

The system must fit actual JCRC workflows.

---

# 65. SYSTEM DESIGN PRINCIPLE: DIGITAL CONTROL LAYER

The most important conceptual model is:

```text
EXISTING JCRC OPERATIONS
        │
        ↓
┌───────────────────────────────┐
│       JCRC-iQOS               │
│                               │
│ Control                       │
│ Compliance                    │
│ Monitoring                    │
│ Evidence                      │
│ Integration                   │
│ Analytics                     │
└───────────────────────────────┘
        │
        ↓
BETTER VISIBILITY
+
BETTER TRACEABILITY
+
CONTINUOUS READINESS
```

The system should enhance existing operations rather than unnecessarily disrupt them.

---

# 66. CAP-OS WITHIN JCRC-iQOS

The original CAP-OS concept becomes the **Quality/Audit Readiness subsystem** of the broader architecture.

```text
JCRC-iQOS
│
└── Quality Management
    │
    └── CAP Audit Readiness
        │
        ├── All Common
        ├── Departmental Audit Management
        ├── CAPA
        └── Risk Management
```

This preserves the original CAP-OS design while expanding its scope into an institutional platform.

---

# 67. COMPLETE SIDEBAR CONCEPT

```text
JCRC-iQOS
│
├── Dashboard
│
├── People & Competency
│   ├── Staff Directory
│   ├── Competency Management
│   ├── Training Records
│   ├── Credentials
│   └── Expiring Credentials
│
├── Document Control
│   ├── SOP Master List
│   ├── Policies
│   ├── Forms & Templates
│   ├── Controlled Documents
│   └── Document Expiry
│
├── Laboratory Quality
│   ├── QC
│   ├── Instruments
│   ├── Reagents & Lots
│   ├── Calibration
│   ├── Equipment
│   └── Quality Indicators
│
├── Research & Study Compliance
│   ├── Research Dashboard
│   ├── Studies
│   ├── Study Teams
│   ├── Staff Credentials
│   ├── Study Documents
│   ├── Training & Certifications
│   ├── Compliance Matrix
│   └── Expiry Monitor
│
├── Audit Readiness
│   ├── All Common
│   ├── Departmental Audit Management
│   ├── CAPA Management
│   └── Risk Management
│
├── Laboratory Operations
│   ├── LIMS Integration
│   ├── Workload
│   ├── TAT
│   ├── Instrument Analytics
│   └── Laboratory Reports
│
├── Logistics
│   ├── Reagents
│   ├── Supplies
│   ├── Inventory
│   └── Navision Integration
│
├── Reports & Analytics
│
└── Administration
    ├── Users
    ├── Roles
    ├── Permissions
    ├── System Settings
    ├── Audit Trail
    └── Integration Monitoring
```

---

# 68. KEY SYSTEM WORKFLOWS

## 68.1 New Staff Member

```text
Create Person
     ↓
Assign Department
     ↓
Assign Role
     ↓
Determine Competencies
     ↓
Determine Training
     ↓
Determine Credentials
     ↓
Create Requirements
     ↓
Monitor Compliance
```

---

# 69. NEW STUDY

```text
Create Study
     ↓
Define Study Requirements
     ↓
Add Study Team
     ↓
Assign Roles
     ↓
Determine Required Documents
     ↓
Determine Training
     ↓
Determine Competency
     ↓
Create Compliance Matrix
     ↓
Monitor Expiry
```

---

# 70. NEW DOCUMENT

```text
Register Document
     ↓
Assign Type
     ↓
Assign Owner
     ↓
Version
     ↓
Review
     ↓
Approval
     ↓
Effective
     ↓
Monitor Review / Expiry
     ↓
Archive / Replace
```

---

# 71. CAP FINDING

```text
Requirement
     ↓
Finding
     ↓
Risk Assessment
     ↓
CAPA
     ↓
Action
     ↓
Evidence
     ↓
Verification
     ↓
Effectiveness
     ↓
Closure
```

---

# 72. RESEARCH COMPLIANCE FAILURE

Example:

```text
GCP Certificate
      ↓
30 days remaining
      ↓
Alert
      ↓
Study Compliance = EXPIRING
      ↓
Coordinator notified
      ↓
Renewal
      ↓
New certificate uploaded
      ↓
Verification
      ↓
Study Compliance = VALID
```

---

# 73. LIMS QUALITY WORKFLOW

```text
Laboratory Instrument
       ↓
LIMS
       ↓
Approved Integration
       ↓
iQOS
       ↓
Quality Analytics
       ↓
Indicator / Alert
       ↓
Investigation if required
       ↓
CAPA / Risk if required
```

---

# 74. NAVISION QUALITY WORKFLOW

```text
Procurement
     ↓
Navision
     ↓
Inventory / Item
     ↓
iQOS Integration
     ↓
Reagent / Lot Context
     ↓
Laboratory Consumption
     ↓
QC / Quality Event
     ↓
Quality Analysis
```

---

# 75. SUCCESS CRITERIA

The project should ultimately enable JCRC to answer questions such as:

### Quality

* What is our current CAP readiness?
* Which requirements lack evidence?
* Which findings remain open?
* Which CAPA actions are overdue?
* Which risks are high?

### People

* Which staff are competent?
* Who requires competency reassessment?
* Who has missing training?
* Which credentials are expiring?

### Research

* Which studies are active?
* Are study teams compliant?
* Which study documents are missing?
* Which staff credentials are expired?
* Which studies are affected by a compliance gap?

### Laboratory

* What is the current QC status?
* Which instruments have outstanding requirements?
* Which reagents are approaching expiry?
* What are the quality indicators?

### Operations

* What is happening across laboratory, research, clinic and logistics?
* Which processes require attention?

---

# 76. IMPLEMENTATION PRIORITY

The project should prioritize **high-value, low-risk foundations first**.

Recommended order:

```text
FOUNDATION
     ↓
People
Documents
Authentication
Evidence
Audit Trail
     ↓
QUALITY
CAP
Audits
CAPA
Risk
     ↓
LABORATORY
QC
Equipment
Reagents
     ↓
RESEARCH
Studies
Teams
Compliance
     ↓
INTEGRATION
LIMS
ICEA
Navision
     ↓
ANALYTICS
Executive Intelligence
```

---

# 77. IMPORTANT PROJECT BOUNDARIES

JCRC-iQOS should not:

* Replace LIMS without a formal replacement project.
* Replace ICEA without formal authorization.
* Replace Navision without formal authorization.
* Become an uncontrolled duplicate patient database.
* Store sensitive information without appropriate authorization.
* Bypass institutional IT security.
* Automatically change external systems without validated interfaces.
* Assume an integration interface exists before technical assessment.
* Digitize records without validation.
* Treat uploaded documents as automatically verified evidence.

---

# 78. MINIMUM VIABLE PRODUCT

The first production-capable MVP should focus on:

```text
Authentication
+
People
+
Roles
+
Document Control
+
Living Documents
+
Training
+
Competency
+
Credentials
+
Expiry Monitoring
+
CAP All Common
+
Audit
+
CAPA
+
Risk
+
Audit Trail
```

This creates significant value before complex integrations are introduced.

---

# 79. FUTURE EXPANSION

Potential future modules:

* Advanced laboratory analytics.
* Automated quality indicators.
* Predictive maintenance.
* Advanced inventory forecasting.
* Automated compliance scoring.
* Mobile application.
* Barcode workflows.
* Equipment integration.
* Automated instrument monitoring.
* Advanced research management.
* Electronic approvals.
* Workflow automation.
* External sponsor reporting.
* Advanced executive intelligence.

These should be added only after the core architecture is stable.

---

# 80. PROJECT DELIVERABLES

The project should produce:

```text
1. Current-State Assessment
2. Requirements Specification
3. Master Architecture
4. Database Design
5. UI/UX Design
6. Integration Architecture
7. Security Architecture
8. Data Migration Plan
9. Validation Plan
10. Test Plan
11. UAT Plan
12. Deployment Plan
13. User Documentation
14. Administrator Documentation
15. Training Materials
16. Production Application
17. Monitoring & Backup Plan
18. Change Management Process
```

---

# 81. MASTER DEVELOPMENT WORKFLOW

The complete project lifecycle is:

```text
                 PROJECT INITIATION
                        │
                        ↓
               CURRENT STATE STUDY
                        │
                        ↓
                DATA DISCOVERY
                        │
                        ↓
              REQUIREMENTS ANALYSIS
                        │
                        ↓
               PROCESS MAPPING
                        │
                        ↓
             SYSTEM ARCHITECTURE
                        │
                        ↓
                DATA ARCHITECTURE
                        │
                        ↓
                  UI/UX DESIGN
                        │
                        ↓
                  PROTOTYPE
                        │
                        ↓
              MODULE DEVELOPMENT
                        │
                        ↓
               TESTING & REVIEW
                        │
                        ↓
             INTEGRATION DEVELOPMENT
                        │
                        ↓
                 DATA MIGRATION
                        │
                        ↓
                  VALIDATION
                        │
                        ↓
                     PILOT
                        │
                        ↓
                     UAT
                        │
                        ↓
              PRODUCTION DEPLOYMENT
                        │
                        ↓
                MONITORING
                        │
                        ↓
             CONTINUOUS IMPROVEMENT
```

---

# 82. ARCHITECTURAL MATURITY ROADMAP

The system should evolve through maturity levels.

## Level 1 — Digital Records

```text
Paper → Electronic records
```

## Level 2 — Controlled Records

```text
Electronic records
+
Version control
+
Approval
+
Expiry
```

## Level 3 — Compliance Management

```text
Requirements
+
Evidence
+
People
+
Compliance
```

## Level 4 — Integrated Operations

```text
Quality
+
Laboratory
+
Research
+
Logistics
```

## Level 5 — Enterprise Intelligence

```text
LIMS
+
ICEA
+
Navision
+
iQOS
+
Analytics
```

## Level 6 — Continuous Quality Intelligence

```text
Real-time information
+
Automated monitoring
+
Risk detection
+
Predictive analytics
+
Management decision support
```

---

# 83. FINAL TARGET ARCHITECTURE

The ultimate JCRC-iQOS ecosystem should resemble:

```text
                         JCRC MANAGEMENT
                               │
                               ↓
                    ┌─────────────────────┐
                    │     JCRC-iQOS       │
                    │ Executive Dashboard │
                    └──────────┬──────────┘
                               │
       ┌───────────────────────┼────────────────────────┐
       │                       │                        │
       ↓                       ↓                        ↓
 QUALITY                 OPERATIONS                 RESEARCH
       │                       │                        │
 CAP Readiness             Laboratory                Studies
 Audits                    QC                        Teams
 CAPA                      Equipment                  Training
 Risk                      Reagents                   Compliance
 Documents                 Workload                   Documents
 People                    Analytics                  Credentials
       │                       │                        │
       └───────────────────────┼────────────────────────┘
                               │
                      SHARED DATA SERVICES
                               │
            ┌──────────────────┼───────────────────┐
            │                  │                   │
         PEOPLE            DOCUMENTS            EVIDENCE
            │                  │                   │
       Competency           Versions            Audit Trail
       Training             Approval            Verification
       Credentials          Expiry              History
            │                  │                   │
            └──────────────────┼───────────────────┘
                               │
                     INTEGRATION LAYER
                               │
          ┌────────────────────┼─────────────────────┐
          │                    │                     │
         LIMS                 ICEA                NAVISION
          │                    │                     │
    Laboratory             Clinical              Logistics
     Information           Information           Information
          │                    │                     │
          └────────────────────┼─────────────────────┘
                               │
                       JCRC INFRASTRUCTURE
                               │
                    Servers / Network / Backup
```

---

# 84. PROJECT DEFINITION

## Official working name

**JCRC Integrated Quality & Operations System**

### Abbreviation

**JCRC-iQOS**

### Core description

> **JCRC-iQOS is a modular institutional digital platform designed to integrate quality management, laboratory operations, research-study compliance, personnel competency, controlled documentation, logistics and selected information from existing JCRC systems into a secure, traceable and continuously monitored operational ecosystem.**

---

# 85. FINAL DESIGN PHILOSOPHY

The system should be developed according to one fundamental idea:

> **Do not digitize the existing problems. Digitize, standardize, connect and continuously improve the processes.**

JCRC-iQOS is therefore not simply a document management system.

It is not simply a CAP checklist application.

It is not simply a laboratory dashboard.

It is not a replacement for LIMS.

It is not a replacement for ICEA.

It is not a replacement for Navision.

It is an **institutional quality and operational control platform** that connects these environments where appropriate.

The final architecture should enable:

```text
PEOPLE
   +
PROCESSES
   +
DOCUMENTS
   +
EVIDENCE
   +
QUALITY
   +
LABORATORY
   +
RESEARCH
   +
LOGISTICS
   +
EXISTING SYSTEMS
   ↓
JCRC-iQOS
   ↓
INTEGRATED VISIBILITY
   ↓
CONTINUOUS COMPLIANCE
   ↓
BETTER QUALITY
   ↓
BETTER OPERATIONS
   ↓
BETTER DECISION MAKING
```

---

# 86. PROJECT NORTH STAR

The project should ultimately make it possible for JCRC to move from:

> **"We need to prepare for an audit."**

to:

> **"Our quality system continuously tells us where we stand, what evidence exists, what is missing, who is responsible, what is expiring, what risks exist and what action is required."**

And from:

> **"Where is the document?"**

to:

> **"The system knows what the document is, who owns it, which version is current, where the evidence is, when it must be reviewed and what processes depend on it."**

And from:

> **"Is this study team compliant?"**

to:

> **"The system continuously evaluates every active study, its personnel, credentials, training, competencies and required documentation."**

That is the intended end state of **JCRC-iQOS**.

---

# 87. DEVELOPMENT RULE

This document is the **master architectural reference** for the project.

Before implementing a major feature, the development team should ask:

1. Does this feature belong within the defined JCRC-iQOS architecture?
2. Does it duplicate an existing system unnecessarily?
3. What is the system of record?
4. What data does it require?
5. What users need it?
6. What quality/compliance requirements does it support?
7. What evidence does it generate?
8. What audit trail is required?
9. How will it be tested?
10. How will it be validated?
11. How will it be deployed?
12. How will it be maintained?

If a major architectural decision changes the principles in this document, this document must be updated before implementation proceeds.

---

# 88. CONCLUSION

JCRC-iQOS is envisioned as a **phased digital transformation programme**, not merely a software-development exercise.

The project begins with understanding the existing JCRC processes, records, systems and infrastructure.

It then establishes a common architecture for:

* People.
* Competency.
* Training.
* Credentials.
* Documents.
* Evidence.
* Quality.
* CAP readiness.
* Audits.
* CAPA.
* Risk.
* Laboratory operations.
* Research studies.
* Logistics.
* Integration.
* Analytics.

The system will progressively connect to existing institutional systems such as **LIMS, ICEA and Navision**, while preserving appropriate system-of-record boundaries.

Existing paper, Excel and PDF records will be progressively inventoried, classified, digitized, validated and brought under controlled electronic management.

The final objective is a **secure, modular, scalable and maintainable institutional platform** capable of supporting continuous quality management, research compliance, laboratory operations and management decision-making.

The development path is:

```text
DISCOVER
   ↓
UNDERSTAND
   ↓
DESIGN
   ↓
PROTOTYPE
   ↓
BUILD
   ↓
INTEGRATE
   ↓
MIGRATE
   ↓
VALIDATE
   ↓
PILOT
   ↓
DEPLOY
   ↓
MONITOR
   ↓
IMPROVE
```

**JCRC-iQOS should evolve with JCRC.**

It should become the digital control layer that allows the institution to understand its quality and operational state continuously—not only when an audit, study review or management meeting is approaching.

---

**END OF MASTER ARCHITECTURE DOCUMENT**
