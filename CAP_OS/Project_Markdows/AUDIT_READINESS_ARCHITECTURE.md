# CAP-OS — Audit Readiness Architecture

## Laboratory Quality Management & Continuous CAP Readiness Platform

**Project:** JCRC Laboratory CAP-OS / QMS
**Frontend:** Next.js + React + TypeScript
**Backend:** Django + Django REST Framework
**Database:** PostgreSQL
**Authentication:** Role-based authentication / RBAC
**Architecture:** Modular, API-first, audit-traceable
**Primary objective:** Continuous laboratory quality monitoring and CAP audit readiness

---

# 1. SYSTEM VISION

CAP-OS is a Laboratory Quality Management System designed to help JCRC Laboratory continuously monitor compliance, quality activities, documentation, competency, risks, corrective actions, equipment, reagents, and audit readiness.

The system should **not replace the laboratory's existing paper/electronic filing system**.

Instead:

> The physical/document filing system remains the official evidence repository where required, while CAP-OS becomes the digital control, monitoring, indexing, reminder, self-audit, and readiness layer.

The system should answer:

### For a bench technologist

> "Am I currently compliant with the procedures and requirements applicable to my work?"

### For a laboratory manager

> "What is currently overdue, incomplete, expiring, non-compliant, or at risk?"

### For the laboratory director

> "If CAP arrived today, how ready are we, and where are our vulnerabilities?"

---

# 2. HIGH-LEVEL APPLICATION STRUCTURE

```text
CAP-OS
│
├── Dashboard
│
├── Audit Readiness
│   │
│   ├── ALL Common
│   ├── Departmental Audit Management
│   ├── CAPA Management
│   └── Risk Management
│
├── Document Control
│   │
│   ├── SOP Master List
│   ├── Policies
│   ├── Forms
│   ├── Work Instructions
│   ├── Controlled Documents
│   ├── Document Review
│   ├── Document Approval
│   └── Expiry / Review Monitoring
│
├── Competency Management
│   │
│   ├── Staff
│   ├── Training
│   ├── Initial Competency
│   ├── 6-Month Competency
│   ├── Annual Competency
│   ├── Competency Assessments
│   └── Expiry / Due Monitoring
│
├── Equipment & Instruments
│   │
│   ├── Instrument Registry
│   ├── Maintenance
│   ├── Calibration
│   ├── Verification
│   ├── QC
│   ├── Service Records
│   └── Equipment Events
│
├── Reagents & Supplies
│   │
│   ├── Reagent Registry
│   ├── Lot Management
│   ├── Expiry Monitoring
│   ├── Receiving
│   ├── Storage
│   ├── QC / Verification
│   └── Consumption
│
├── Quality Control
│   │
│   ├── Internal QC
│   ├── Westgard
│   ├── Levey-Jennings
│   ├── EQA / PT
│   ├── QC Events
│   └── QC Trends
│
├── Audits
│   │
│   ├── Internal Audits
│   ├── External Audits
│   ├── Audit Findings
│   └── Audit Reports
│
├── Reports
│
├── Evidence Vault
│
├── Notifications
│
└── Administration
    ├── Users
    ├── Roles
    ├── Departments
    ├── Permissions
    ├── Configuration
    └── Audit Trail
```

---

# 3. AUDIT READINESS — PARENT MODULE

The sidebar should display:

```text
AUDIT READINESS
│
├── Overview
├── ALL Common
├── Departmental Audits
├── CAPA Management
└── Risk Management
```

The parent item should be expandable/collapsible.

Each submenu should have its **own route/page**.

Do NOT build one enormous Audit Readiness page whose contents are dynamically replaced.

Use separate pages because each area has different workflows.

However, they should share:

* navigation
* filters
* compliance data
* requirement IDs
* evidence
* findings
* CAPA
* risks
* notifications
* audit trail
* common components
* API services

---

# 4. ROUTING STRUCTURE

Recommended Next.js App Router structure:

```text
app/
│
├── dashboard/
│   └── page.tsx
│
├── audit-readiness/
│   │
│   ├── page.tsx
│   │
│   ├── all-common/
│   │   └── page.tsx
│   │
│   ├── departmental/
│   │   └── page.tsx
│   │
│   ├── capa/
│   │   └── page.tsx
│   │
│   └── risk/
│       └── page.tsx
│
├── documents/
├── competency/
├── equipment/
├── reagents/
├── qc/
├── audits/
├── reports/
├── evidence/
└── administration/
```

Example routes:

```text
/audit-readiness
/audit-readiness/all-common
/audit-readiness/departmental
/audit-readiness/capa
/audit-readiness/risk
```

---

# 5. AUDIT READINESS OVERVIEW PAGE

Route:

```text
/audit-readiness
```

This is the executive summary.

It should answer:

> "How ready is the laboratory today?"

---

## 5.1 Top KPI cards

Example:

```text
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ CAP READINESS  │ │ COMPLIANT      │ │ OPEN FINDINGS  │ │ OVERDUE ITEMS  │
│                │ │                │ │                │ │                │
│     87%        │ │     642        │ │      18        │ │      11        │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
```

Additional cards:

```text
Documents Expiring
Competencies Due
Equipment Due
Reagents Expiring
Open CAPAs
High Risks
Missing Evidence
```

---

# 6. CAP READINESS SCORE

The system should calculate readiness from requirement status.

Example:

```text
Total applicable requirements = 850

Compliant = 730
Partially compliant = 55
Non-compliant = 25
Not assessed = 40
```

The dashboard can calculate a readiness indicator.

Important:

The readiness score should NOT simply be:

```text
compliant / total
```

A weighted scoring system should eventually be used.

For example:

```text
Critical requirement = higher weight
Major requirement = medium weight
Routine requirement = lower weight
```

The exact scoring methodology should be configurable.

---

# 7. ALL COMMON CHECKLIST MODULE

Route:

```text
/audit-readiness/all-common
```

This module contains all applicable requirements from the CAP ALL COMMON checklist.

The ALL COMMON checklist should be imported into a structured database.

Do not store the checklist only as a PDF.

---

# 8. CAP REQUIREMENT DATA MODEL

Each requirement should have a unique internal record.

Example:

```text
Requirement
│
├── id
├── checklist
├── code
├── title
├── requirement_text
├── category
├── applicability
├── department
├── criticality
├── frequency
├── responsible_role
├── current_practice
├── evidence_required
├── compliance_status
├── notes
├── last_assessed
├── next_review
└── created_at
```

---

# 9. CAP CODE AS PRIMARY REFERENCE

The CAP requirement code should be preserved exactly.

Example:

```text
GEN.XXXX
COM.XXXX
HEM.XXXX
TRM.XXXX
CHM.XXXX
MIC.XXXX
FLO.XXXX
URN.XXXX
```

Do not replace CAP codes with internal IDs.

Instead:

```text
CAP Code
    ↓
Internal Database ID
```

The CAP code is the human/reference identifier.

The database primary key is an internal UUID/integer.

---

# 10. REQUIREMENT STATUS

Each requirement should have a controlled status.

Recommended:

```text
NOT ASSESSED
COMPLIANT
PARTIALLY COMPLIANT
NON-COMPLIANT
NOT APPLICABLE
PENDING EVIDENCE
```

Use status badges.

Example:

```text
● COMPLIANT
● PARTIALLY COMPLIANT
● NON-COMPLIANT
● PENDING EVIDENCE
● NOT ASSESSED
● N/A
```

---

# 11. ALL COMMON UI

Recommended layout:

```text
┌───────────────────────────────────────────────────────────────┐
│ ALL COMMON — CAP READINESS                                    │
│                                                               │
│ [87% Ready] [642 Compliant] [18 Findings] [11 Overdue]       │
├───────────────────────────────────────────────────────────────┤
│ Filters                                                       │
│                                                               │
│ Department ▼   Status ▼   Criticality ▼   Owner ▼             │
│ Search CAP Code / Requirement __________________________       │
├───────────────────────────────────────────────────────────────┤
│ CAP CODE │ REQUIREMENT │ STATUS │ OWNER │ EVIDENCE │ ACTION   │
│──────────┼─────────────┼────────┼───────┼──────────┼──────────│
│ XXX.001  │ ........... │ ✓      │ Mary  │ ✓        │ View     │
│ XXX.002  │ ........... │ ⚠      │ John  │ Partial  │ Review   │
│ XXX.003  │ ........... │ ✕      │ Jane  │ Missing  │ Resolve  │
└───────────────────────────────────────────────────────────────┘
```

---

# 12. REQUIREMENT DETAIL DRAWER

Clicking a CAP requirement should open a detailed drawer or dedicated detail page.

Example:

```text
CAP REQUIREMENT
────────────────────────────

Code:
XXX.001

Requirement:
[CAP requirement text]

Status:
COMPLIANT

Owner:
Laboratory Manager

Frequency:
Annual

Current Practice:
[description]

Evidence:
✓ SOP
✓ Training record
✓ QC record
✓ Audit record

Documents:
SOP-HEM-001
FORM-QC-004

Last assessed:
2026-08-20

Next assessment:
2027-08-20

Notes:
............................

[Edit] [Add Evidence] [Create Finding]
```

---

# 13. EVIDENCE MODEL

Evidence should be a separate entity.

One CAP requirement may have multiple evidence items.

```text
Requirement
     │
     ├── Evidence
     ├── Evidence
     ├── Evidence
     └── Evidence
```

Evidence examples:

```text
SOP
Policy
Form
Training Record
Competency Record
Equipment Record
QC Record
Maintenance Record
Calibration Record
EQA Report
Internal Audit Record
Photograph
Meeting Record
Logbook
External Document
```

---

# 14. IMPORTANT — DO NOT DUPLICATE THE FILE SYSTEM

The system should not force the laboratory to abandon its current filing structure.

Instead:

```text
Existing Laboratory File
        ↓
CAP-OS Evidence Record
        ↓
CAP Requirement
```

The system can store:

```text
Evidence ID
Evidence type
Document number
Location
File path/reference
Document version
Date
Owner
Validity
Expiry
Verification status
```

The actual official file can remain in the existing controlled repository.

Where digital storage is appropriate, CAP-OS can additionally maintain a digital evidence copy.

---

# 15. DEPARTMENTAL AUDIT MANAGEMENT

Route:

```text
/audit-readiness/departmental
```

This handles department-specific audit programs.

Departments may include:

```text
Hematology
Coagulation
Transfusion Medicine
Clinical Chemistry
Toxicology
Flow Cytometry
Microbiology
Urinalysis
Molecular Biology
Sample Processing
Phlebotomy
```

The department audit page should combine:

```text
CAP requirements
+
department
+
accredited tests
+
local practice
+
evidence
+
findings
```

---

# 16. DEPARTMENTAL AUDIT WORKFLOW

```text
Select Department
       ↓
Select Audit
       ↓
Load Applicable CAP Requirements
       ↓
Technologist/Reviewer Performs Assessment
       ↓
Record Status
       ↓
Attach Evidence
       ↓
Identify Finding
       ↓
Create CAPA if required
       ↓
Assign Owner
       ↓
Track Resolution
       ↓
Verify Effectiveness
       ↓
Close Finding
```

---

# 17. ACCREDITED TEST MAPPING

The accredited test menu should be mapped to departments.

Example:

```text
Department
    ↓
Test
    ↓
Instrument
    ↓
Applicable CAP requirements
    ↓
SOP
    ↓
Competency
    ↓
QC
    ↓
Reagent
    ↓
Evidence
```

Example:

```text
CBC
│
├── Hematology Department
├── Sysmex XN-550
├── CBC SOP
├── CBC Competency
├── Hematology QC
├── Reagent
├── Calibration
├── Maintenance
└── CAP Requirements
```

This creates the foundation for an intelligent compliance engine.

---

# 18. CAPA MANAGEMENT

Route:

```text
/audit-readiness/capa
```

CAPA = Corrective and Preventive Action.

The module should manage:

```text
Finding
    ↓
Root Cause
    ↓
Corrective Action
    ↓
Preventive Action
    ↓
Responsible Person
    ↓
Due Date
    ↓
Implementation
    ↓
Effectiveness Check
    ↓
Closure
```

---

# 19. CAPA UI

Example:

```text
┌─────────────────────────────────────────────────────────────┐
│ CAPA MANAGEMENT                                             │
├─────────────────────────────────────────────────────────────┤
│ Open: 18   Overdue: 4   Pending Verification: 6   Closed: 91│
├─────────────────────────────────────────────────────────────┤
│ ID │ FINDING │ DEPARTMENT │ OWNER │ DUE │ STATUS │ ACTION   │
│────┼─────────┼────────────┼───────┼─────┼────────┼──────────│
│ 24 │ Missing │ HEM        │ John  │ 9/2 │ OPEN   │ View     │
│ 25 │ QC issue│ CHEM       │ Mary  │ 9/5 │ VERIFY │ View     │
└─────────────────────────────────────────────────────────────┘
```

---

# 20. CAPA SEVERITY

Use configurable severity:

```text
CRITICAL
MAJOR
MINOR
OBSERVATION
```

Severity should affect:

* dashboard visibility
* notifications
* escalation
* due dates
* readiness score

---

# 21. RISK MANAGEMENT

Route:

```text
/audit-readiness/risk
```

The risk module should identify risks before they become audit findings.

Example:

```text
Risk
│
├── Description
├── Department
├── Process
├── Cause
├── Consequence
├── Likelihood
├── Severity
├── Risk Score
├── Existing Controls
├── Additional Controls
├── Owner
├── Review Date
└── Status
```

---

# 22. RISK MATRIX

Use:

```text
Likelihood × Severity = Risk Score
```

Example:

```text
             SEVERITY
          1   2   3   4   5

L 5       M   H   H   C   C
I 4       M   M   H   H   C
K 3       L   M   M   H   H
E 2       L   L   M   M   H
L 1       L   L   L   M   M
```

Where:

```text
L = Low
M = Moderate
H = High
C = Critical
```

Risk methodology should be configurable.

---

# 23. DOCUMENT CONTROL

Route:

```text
/documents
```

The document control module should manage:

```text
Document
│
├── Document ID
├── Document Type
├── Title
├── Department
├── Version
├── Status
├── Effective Date
├── Review Date
├── Expiry Date
├── Owner
├── Approver
├── Approval Date
├── Previous Version
└── Evidence Location
```

---

# 24. DOCUMENT STATUS

Recommended:

```text
DRAFT
UNDER REVIEW
APPROVED
ACTIVE
SUPERSEDED
EXPIRED
ARCHIVED
```

---

# 25. SOP MONITORING

The system should automatically identify:

```text
SOPs expiring within 90 days
SOPs expiring within 30 days
Expired SOPs
SOPs awaiting approval
SOPs awaiting review
SOPs without assigned owner
SOPs without linked CAP requirements
```

Example dashboard:

```text
DOCUMENT CONTROL

Active SOPs          184
Expiring <90 days     12
Expiring <30 days      4
Expired                2
Awaiting Review        8
```

---

# 26. COMPETENCY MANAGEMENT

Route:

```text
/competency
```

The competency module should connect:

```text
Staff
    ↓
Department
    ↓
Job Role
    ↓
Tests/Procedures
    ↓
Training
    ↓
Competency Assessment
    ↓
Expiry / Next Due Date
```

Competency cycles should support:

```text
Training
Initial Competency
6-Month Competency
Annual Competency
Reassessment
```

---

# 27. COMPETENCY DASHBOARD

Example:

```text
TOTAL STAFF             72
CURRENT                  61
DUE SOON                  7
OVERDUE                   4
NOT ASSESSED              0
```

Department view:

```text
HEMATOLOGY

Staff        Competency       Due
──────────────────────────────────
Technologist A     ✓          2027-01
Technologist B     ⚠          2026-09
Technologist C     ✕          OVERDUE
```

---

# 28. EQUIPMENT QUALITY MANAGEMENT

Route:

```text
/equipment
```

Each instrument should have:

```text
Instrument
│
├── Identification
├── Department
├── Manufacturer
├── Model
├── Serial Number
├── Installation
├── Validation
├── Verification
├── Calibration
├── Maintenance
├── Service
├── QC
├── Breakdown
├── Downtime
└── CAP Requirements
```

Example:

```text
Sysmex XN-550

Status: ACTIVE

Calibration       ✓
Maintenance       ✓
QC                ✓
Verification      ✓
Service           ✓

Next maintenance: 2026-10-15
```

---

# 29. REAGENT AND LOT MANAGEMENT

Route:

```text
/reagents
```

Track:

```text
Reagent
Lot
Manufacturer
Supplier
Date Received
Expiry Date
Storage
Temperature
Opening Date
QC Status
Verification
Quantity
Consumption
Status
```

Automated alerts:

```text
LOT EXPIRING
LOT EXPIRED
QC NOT COMPLETED
STORAGE ISSUE
LOW STOCK
```

---

# 30. QUALITY CONTROL

Route:

```text
/qc
```

QC should integrate with instrument and test data.

Example:

```text
Test
 ↓
Instrument
 ↓
Reagent Lot
 ↓
QC Lot
 ↓
QC Result
 ↓
Westgard Rules
 ↓
QC Status
 ↓
CAP Requirement
```

This allows the system to provide compliance evidence automatically.

---

# 31. CROSS-MODULE RELATIONSHIP

The most important architectural concept is the relationship graph.

```text
                    CAP REQUIREMENT
                           │
             ┌─────────────┼──────────────┐
             │             │              │
          SOP/DOC        EVIDENCE        RISK
             │             │              │
             │             │              │
        COMPETENCY       AUDIT           CAPA
             │             │              │
             └─────────────┼──────────────┘
                           │
                       DEPARTMENT
                           │
                         TEST
                           │
                      INSTRUMENT
                           │
                        REAGENT
                           │
                           QC
```

This relationship graph is the foundation of CAP-OS.

---

# 32. CENTRAL COMPLIANCE ENGINE

Create a backend service called:

```text
Compliance Engine
```

Its responsibility is to calculate the current compliance state.

Inputs:

```text
CAP requirements
Documents
Evidence
Audits
Competency
Equipment
Reagents
QC
CAPA
Risks
```

Output:

```text
Requirement status
Department readiness
Laboratory readiness
Overdue items
Missing evidence
Upcoming expiries
High-risk areas
```

---

# 33. CONTINUOUS COMPLIANCE MODEL

Instead of:

```text
Audit happens
     ↓
Lab checks compliance
```

CAP-OS should create:

```text
Daily Laboratory Activity
        ↓
Data / Records
        ↓
Compliance Engine
        ↓
Continuous Monitoring
        ↓
Alerts
        ↓
Corrective Action
        ↓
Evidence
        ↓
Readiness
```

The laboratory is therefore continuously preparing for an audit.

---

# 34. BENCH-LEVEL EXPERIENCE

The system should NOT require technologists to spend excessive time entering compliance information.

The bench interface should be simple.

Example:

```text
TODAY

Your Compliance

✓ QC completed
✓ Equipment maintenance current
✓ Competency current
⚠ Reagent lot verification due
✓ SOP current

[View Issues]
```

The technologist should mainly see:

```text
WHAT DO I NEED TO DO?
```

rather than:

```text
HERE ARE 850 CAP REQUIREMENTS.
```

---

# 35. MANAGER EXPERIENCE

Managers need a different interface.

Example:

```text
LAB QUALITY CONTROL CENTER

Readiness             87%
────────────────────────────

Critical Issues          2
Overdue Tasks             11
Open CAPA                 18
Expiring SOPs              4
Competencies Due           7
Equipment Due              3
Missing Evidence           5

[Review Issues]
[Run Department Audit]
[View CAP Readiness]
```

---

# 36. DIRECTOR EXPERIENCE

Director dashboard:

```text
JCRC LABORATORY QUALITY STATUS

CAP READINESS

██████████████████░░ 87%

Critical Risks                  2
Major Findings                  5
Open CAPA                      18
Overdue Compliance Items       11
Evidence Coverage              94%

DEPARTMENT READINESS

Hematology          94%
Chemistry           91%
Transfusion         88%
Flow Cytometry      84%
Microbiology        82%
Urinalysis          96%

[Executive Report]
[CAP Readiness Report]
[Audit Simulation]
```

---

# 37. AUDIT SIMULATION

A powerful feature should be:

```text
SIMULATE CAP AUDIT
```

The system should generate an audit-style assessment.

Example:

```text
CAP AUDIT SIMULATION

Requirements reviewed: 850

COMPLIANT             730
PARTIALLY COMPLIANT    55
NON-COMPLIANT          25
NOT ASSESSED           40

Potential findings: 31

HIGH RISK AREAS:

1. Competency documentation
2. Equipment maintenance
3. SOP review
4. Reagent verification
```

This is not a substitute for an actual CAP assessment.

It is a laboratory self-assessment tool.

---

# 38. EVIDENCE COVERAGE

A particularly important KPI:

```text
Evidence Coverage
```

Example:

```text
Applicable CAP Requirements     850

Requirements with evidence      810

Evidence Coverage               95.3%
```

This is different from compliance.

A requirement may be compliant but poorly documented.

Therefore track:

```text
Compliance Status
+
Evidence Status
```

separately.

---

# 39. AUDIT TRAIL

Every important change must be logged.

Example:

```text
User:
John Doe

Action:
Changed CAP requirement status

Requirement:
XXX.002

Previous:
PARTIALLY COMPLIANT

New:
COMPLIANT

Timestamp:
2026-08-31 14:32

Reason:
SOP revised and competency records completed
```

The audit trail should be immutable to ordinary users.

---

# 40. ROLE-BASED ACCESS CONTROL

Recommended roles:

```text
SYSTEM ADMINISTRATOR

LABORATORY DIRECTOR

QUALITY MANAGER

SECTION MANAGER

SUPERVISOR

LABORATORY TECHNOLOGIST

AUDITOR / REVIEWER

READ-ONLY USER
```

Permissions should be granular.

Example:

```text
Technologist
    View requirements
    View SOPs
    Complete assigned tasks
    Complete competency
    Upload evidence

Supervisor
    + Review assessments
    + Approve evidence
    + Create findings

Quality Manager
    + Manage audits
    + Manage CAPA
    + Manage risks

Director
    + Executive dashboard
    + Approvals
    + Readiness reports
```

---

# 41. NOTIFICATION ENGINE

The system should automatically generate notifications.

Examples:

```text
SOP expires in 30 days

Competency due in 14 days

Equipment maintenance overdue

CAPA overdue

Evidence missing

Risk review due

Reagent expires in 14 days

CAP requirement not assessed
```

Notifications should support:

```text
In-app
Email
Dashboard alerts
Escalation
```

---

# 42. DATABASE ARCHITECTURE

Core entities:

```text
users
roles
departments
staff

cap_checklists
cap_requirements
requirement_departments
requirement_tests

tests
test_methods
instruments

documents
document_versions
document_reviews
document_approvals

evidence
evidence_links

competencies
competency_assessments
training_records

equipment
equipment_maintenance
equipment_calibration
equipment_verification
equipment_service

reagents
reagent_lots
reagent_verification
reagent_usage

qc_lots
qc_results
qc_events

audits
audit_requirements
audit_findings

capa
capa_actions
capa_verifications

risks
risk_controls
risk_reviews

tasks
notifications

audit_logs
```

---

# 43. IMPORTANT DATABASE RELATIONSHIP

Do not hard-code CAP checklist requirements into React components.

Incorrect:

```text
if code == "XXX.001":
    show requirement...
```

Correct:

```text
Database
   ↓
Django API
   ↓
Next.js
   ↓
Dynamic UI
```

This allows future checklist versions to be imported without rewriting the frontend.

---

# 44. CHECKLIST VERSIONING

CAP checklists change over time.

Therefore:

```text
CAP Checklist
    │
    ├── Version 1
    ├── Version 2
    └── Version 3
```

Requirements should belong to a checklist version.

Never overwrite historical checklist data.

Example:

```text
CAP ALL COMMON
Version: 2026

Requirement XXX.001
```

Later:

```text
CAP ALL COMMON
Version: 2027

Requirement XXX.001
```

The system must preserve both.

---

# 45. DEPARTMENT-SPECIFIC CHECKLISTS

The same architecture should support:

```text
ALL COMMON

HEMATOLOGY / COAGULATION

TRANSFUSION MEDICINE

CHEMISTRY / TOXICOLOGY

FLOW CYTOMETRY

MICROBIOLOGY

URINALYSIS
```

Each checklist should be imported into:

```text
cap_checklists
        ↓
cap_requirements
        ↓
department mappings
        ↓
test mappings
        ↓
evidence mappings
```

---

# 46. REQUIREMENT CROSSWALK

Create a central crosswalk.

Example:

| CAP Code | Requirement | Department | Test | SOP     | Evidence   | Owner      | Status    |
| -------- | ----------- | ---------- | ---- | ------- | ---------- | ---------- | --------- |
| XXX.001  | Requirement | Hematology | CBC  | SOP-001 | QC Log     | Supervisor | Compliant |
| XXX.002  | Requirement | Hematology | CBC  | SOP-002 | Competency | Manager    | Partial   |
| XXX.003  | Requirement | Chemistry  | ALT  | SOP-020 | QC Record  | Supervisor | Compliant |

This crosswalk should become one of the most important data structures in CAP-OS.

---

# 47. IMPLEMENTATION PHASES

Do NOT attempt to build the entire system simultaneously.

## Phase 1 — Foundation

Build:

```text
Authentication
Users
Roles
Departments
Database
API
Application shell
Navigation
Audit trail
```

---

## Phase 2 — CAP Requirement Registry

Build:

```text
CAP checklist import
CAP checklist versioning
CAP requirement database
Requirement detail page
Requirement status
Department mapping
Test mapping
```

---

## Phase 3 — Document Control

Build:

```text
SOP registry
Document versions
Review dates
Expiry monitoring
Approval workflow
CAP requirement links
```

---

## Phase 4 — Competency

Build:

```text
Staff
Training
Competency
Assessment
Due dates
Notifications
```

---

## Phase 5 — Evidence

Build:

```text
Evidence registry
Evidence linking
Document references
Evidence status
Evidence coverage
```

---

## Phase 6 — Audit Management

Build:

```text
Internal audits
Department audits
Audit findings
Audit history
Audit reports
```

---

## Phase 7 — CAPA

Build:

```text
Findings
Corrective actions
Preventive actions
Owners
Due dates
Effectiveness checks
Closure
```

---

## Phase 8 — Risk Management

Build:

```text
Risk register
Risk scoring
Risk controls
Risk reviews
Risk dashboard
```

---

## Phase 9 — Equipment / Reagents / QC

Integrate:

```text
Equipment
Maintenance
Calibration
Verification

Reagents
Lots
Expiry
Verification

QC
QC lots
QC results
QC events
```

---

## Phase 10 — Intelligence

Only after the underlying data is reliable should AI features be added.

Potential AI features:

```text
Requirement interpretation assistance
Evidence gap detection
Audit finding summarization
CAPA root-cause assistance
Risk identification
Audit report generation
Document review assistance
Readiness trend analysis
```

AI should assist users.

It should NOT silently determine compliance.

Final compliance decisions remain under authorized laboratory personnel.

---

# 48. FRONTEND COMPONENT ARCHITECTURE

Use reusable components.

```text
components/
│
├── layout/
│   ├── Sidebar
│   ├── Header
│   ├── Breadcrumbs
│   └── PageContainer
│
├── dashboard/
│   ├── MetricCard
│   ├── ReadinessGauge
│   ├── RiskSummary
│   └── DepartmentStatus
│
├── compliance/
│   ├── RequirementTable
│   ├── RequirementStatus
│   ├── RequirementDrawer
│   ├── EvidenceList
│   └── ComplianceBadge
│
├── audits/
│   ├── AuditTable
│   ├── AuditFinding
│   └── AuditSummary
│
├── capa/
│   ├── CapaTable
│   ├── CapaForm
│   └── CapaTimeline
│
├── documents/
│   ├── DocumentTable
│   ├── DocumentStatus
│   └── DocumentTimeline
│
├── competency/
│   ├── CompetencyTable
│   ├── CompetencyStatus
│   └── CompetencyTimeline
│
└── common/
    ├── DataTable
    ├── FilterBar
    ├── Search
    ├── Modal
    ├── Drawer
    ├── Timeline
    └── EmptyState
```

---

# 49. BACKEND DJANGO STRUCTURE

Recommended:

```text
backend/
│
├── config/
│
├── apps/
│
│   ├── accounts/
│   ├── departments/
│   ├── cap/
│   ├── documents/
│   ├── evidence/
│   ├── competency/
│   ├── equipment/
│   ├── reagents/
│   ├── qc/
│   ├── audits/
│   ├── capa/
│   ├── risks/
│   ├── notifications/
│   ├── reports/
│   └── audit_trail/
│
└── manage.py
```

Each domain should be independently testable.

---

# 50. API STRUCTURE

Example:

```text
/api/v1/auth/

/api/v1/cap/checklists/
/api/v1/cap/requirements/
/api/v1/cap/readiness/

/api/v1/documents/
/api/v1/evidence/

/api/v1/competency/
/api/v1/equipment/
/api/v1/reagents/
/api/v1/qc/

/api/v1/audits/
/api/v1/capa/
/api/v1/risks/

/api/v1/reports/
/api/v1/notifications/
```

API versioning should be built from the beginning.

---

# 51. PAGE DESIGN PRINCIPLE

Every module should follow a common pattern:

```text
PAGE HEADER
    ↓
SUMMARY METRICS
    ↓
FILTER / SEARCH
    ↓
MAIN DATA TABLE
    ↓
DETAIL DRAWER / PAGE
    ↓
ACTION
    ↓
AUDIT TRAIL
```

This keeps the application predictable.

---

# 52. DO NOT OVERLOAD THE UI

The system should distinguish between:

```text
Operational UI
```

and

```text
Management UI
```

Technologists should not see hundreds of compliance controls.

Managers should see operational compliance.

Directors should see strategic risk/readiness.

---

# 53. THE "ONE CLICK FROM PROBLEM TO EVIDENCE" PRINCIPLE

If the system says:

```text
CAP Readiness: 82%
```

the user should be able to click it.

Then:

```text
82%
 ↓
18 incomplete requirements
 ↓
Requirement XXX.002
 ↓
Missing evidence
 ↓
SOP / Competency / QC record
 ↓
Action
```

The user should never have to manually search through several unrelated modules.

---

# 54. THE "ONE CLICK FROM REQUIREMENT TO EVERYTHING" PRINCIPLE

For every CAP requirement:

```text
CAP Requirement
│
├── Current Practice
├── Evidence
├── SOP
├── Forms
├── Training
├── Competency
├── Equipment
├── Reagents
├── QC
├── Audit Findings
├── CAPA
├── Risks
└── History
```

This creates a true compliance information hub.

---

# 55. THE MOST IMPORTANT SYSTEM OBJECT

The central object in CAP-OS is:

```text
CAP REQUIREMENT
```

Almost everything should be capable of linking to it.

Conceptually:

```text
                     ┌──────── DOCUMENT
                     │
                     ├──────── EVIDENCE
                     │
                     ├──────── COMPETENCY
                     │
CAP REQUIREMENT ─────┼──────── EQUIPMENT
                     │
                     ├──────── REAGENT
                     │
                     ├──────── QC
                     │
                     ├──────── AUDIT
                     │
                     ├──────── CAPA
                     │
                     └──────── RISK
```

This is what transforms the application from a collection of separate QMS tools into an integrated CAP readiness platform.

---

# 56. FINAL SYSTEM CONCEPT

The final CAP-OS architecture should operate as:

```text
                 LABORATORY ACTIVITY
                         │
                         ▼
              ┌─────────────────────┐
              │     CAP-OS QMS      │
              └──────────┬──────────┘
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
   DOCUMENTS         PEOPLE            EQUIPMENT
       │                 │                 │
       ▼                 ▼                 ▼
     SOPs          COMPETENCY        MAINTENANCE
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                       TESTS
                         │
                         ▼
                        QC
                         │
                         ▼
                  CAP REQUIREMENTS
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
           AUDIT       RISK         CAPA
             │           │           │
             └───────────┼───────────┘
                         ▼
                 EVIDENCE ENGINE
                         │
                         ▼
               COMPLIANCE ENGINE
                         │
                         ▼
                 READINESS SCORE
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
        TECHNOLOGIST   MANAGER     DIRECTOR
```

The objective is therefore not simply:

> "Put the CAP checklist into software."

The objective is:

> **Build a continuous laboratory compliance operating system in which CAP requirements are connected to the actual people, tests, SOPs, equipment, reagents, QC records, audits, risks, corrective actions, and evidence that demonstrate compliance.**

---

# 57. INITIAL DEVELOPMENT PRIORITY

The first production-ready foundation should be:

```text
1. Authentication
2. Users / Roles
3. Departments
4. CAP Checklist Registry
5. CAP Requirement Registry
6. CAP Requirement Versioning
7. Department Mapping
8. Test Mapping
9. Requirement Status
10. Evidence Registry
11. Document Registry
12. Audit Trail
```

Only after these are stable should the application expand into:

```text
CAPA
Risk
Competency
Equipment
Reagents
QC
Advanced analytics
AI
```

This prevents CAP-OS from becoming a collection of disconnected dashboards.

The architecture should instead be built around the **CAP Requirement → Evidence → Compliance → Action → Readiness** lifecycle.
