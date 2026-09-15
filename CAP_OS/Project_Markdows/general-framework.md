# CAP Laboratory General Compliance & Architecture Specification
> **System Purpose:** Continuous audit readiness, quality assurance, and real-time laboratory compliance monitoring.
> **AI Instruction:** This document is optimized for LLMs and GitHub Copilot. Keep this file open in your IDE active workspace. When drafting models, handlers, or services, refer directly to the checklist codes (`GEN.XXXXX`) to inherit their specific functional and database audit requirements.

---

## 1. Compliance Architecture & Core System Standards

To pass a rigorous CAP or ISO 15189 audit, the system must enforce strict operational constraints at the database, networking, and application layers. When writing code, ensure all modules conform to the following three compliance columns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AUDIT SYSTEM TOP-LEVEL ARCHITECTURE                │
├───────────────────────┬──────────────────────────────┬──────────────────────┤
│ LIS DATA INGESTION    │ SYSTEM LOGS & ACTIONS        │ HARDWARE/IOT SENSORS │
│ (Pre/Analytic/Post)   │ (Personnel/QC/Documents)     │ (Temp/Environment)   │
└──────────┬────────────┴──────────────┬───────────────┴──────────┬───────────┘
           │                           │                          │
           ▼                           ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPLIANCE PROCESSING ENGINE                         │
│  - Real-Time Validation Checks against CAP thresholds                       │
│  - Event-Driven Alert Dispatcher (SMS/Email/In-App)                         │
└──────────┬──────────────────────────────────────────────────────┬───────────┘
           │                                                      │
           ▼                                                      ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
│        GEN.20450 COMPLIANT LEDGER    │  │       CONTINUOUS ANALYTICS        │
│  - Immutable Audit Trails (Users/IDs)│  │  - Dashboard Compliance Score %   │
│  - No Destructive Deletes (Soft Only)│  │  - Overdue Task Trackers          │
└──────────────────────────────────────┘  └───────────────────────────────────┘
```

### A. Immutable Audit Logging (GEN.20450 Compliance)
*   **Requirement**: Any correction, addition, or modification of laboratory records must be fully traceable, preserving the original data alongside the editor's identity, timestamp, and explanation.
*   **Database Implementation**:
    *   **No Hard Deletes**: Soft deletes only via a `deleted_at` timestamp.
    *   **Shadow Auditing**: Every table representing compliance records (e.g., QC, Competency, Temperature, Corrective Action) must have a corresponding `_audit_log` table or an immutable ledger history trigger.
    *   **Payload Struct**: All database updates must write the previous values (`old_payload`) and new values (`new_payload`) along with the authenticated `user_id` and an immutable `revision_reason` to the audit log.

### B. Scheduling and Daemon Workers
*   **Requirement**: Many CAP mandates require daily, weekly, monthly, semiannual, or biennial actions.
*   **Implementation**: Use Celery, Cron, or a system background daemon to evaluate:
    *   Pending document reviews (90/60/30-day alerts prior to the 2-year deadline).
    *   Overdue competency assessments based on employee hire dates.
    *   Missed equipment calibration checks.

### C. Fail-Safe Autoverification & Data Integrity
*   **Requirement**: If the system detects a breach of compliance (e.g., failed QC or failed competency), it must have mechanisms to trigger alert flags or suggest halting automated processes where direct clinical risk exists.

---

## 2. Directory of CAP Laboratory General Checklist Items

This directory defines every requirement in the General Checklist. Refer to these items when writing system modules.

### Section 2.1: Quality Management System (QMS)
*   **GEN.13806 - Quality Management System (QMS)**: The laboratory must have a comprehensive QMS document mapping all core pre-analytic, analytic, post-analytic, support, and process improvement workflows.
*   **GEN.13820 - Scope of Service**: A defined, active document cataloging all services, hours of operation, tests offered, and target turnaround times (TATs) available to clinicians.
*   **GEN.20100 - QMS Extent of Coverage**: Ensures the QMS encompasses every operational area of the laboratory, including satellite, point-of-care (POC), and referral services.
*   **GEN.20208 - Identification of Non-conforming Events**: A standardized logging system to record error occurrences, patient incidents, and service complaints across all shifts.
*   **GEN.20310 - Investigation of Non-conforming Events**: Requires a systematic Root Cause Analysis (RCA) for any sentinel or major adverse events that impact patient safety or data integrity.
*   **GEN.20315 - Risk Management**: A prospective process to evaluate risks in clinical operations, requiring active risk mitigation strategies and documented assessments for new procedures.
*   **GEN.20316 - QMS Indicators of Quality**: System metrics tracking quality indicators across all test phases (e.g., specimen labeling error rates, critical value reporting rates, corrected report rates, and turnaround times).
*   **GEN.20318 - Corrective and Preventive Action (CAPA)**: Workflow for documenting deviations, defining root causes, launching corrective actions, and formally verifying their long-term effectiveness.
*   **GEN.20325 - Personnel and Patient Quality Communication**: A mechanism for laboratory staff and patients to securely communicate quality or safety concerns directly to management.
*   **GEN.20326 - Assessment of the QMS Implementation**: An annual executive appraisal checking the entire QMS performance, review of quality indicators, and action plans.
*   **GEN.20330 - Quality Concerns - CAP Sign**: Prominent physical or digital signage with contact info for CAP reporting, backed by a written non-retaliation policy.
*   **GEN.20335 - Customer Satisfaction**: A survey engine evaluating satisfaction rates of clinicians, nursing staff, and patients at least once every two years.
*   **GEN.20340 - Notifications From Vendors**: A log to track product recalls and technical notifications from diagnostic/software vendors, mapping affected inventory and actions taken.
*   **GEN.20351 - Adverse Patient Event Reporting**: Strict tracking of device-related adverse events contributing to injury/death, ensuring FDA MDR Form 3500A compliance with submissions within 10 days.
*   **GEN.20374 - National/Federal/State/Local Regulations**: Ensures complete alignment with tissue handling, hazardous waste, and privacy laws.
*   **GEN.20375 - Document Control**: A document control engine managing draft, active, and archived phases of policies, procedures, and forms with digital signatures and read-receipt logs.
*   **GEN.20377 - Record and Material Retention**: A database policy enforcing mandatory retention schedules (e.g., 2 years for requisitions, QC, and patient results; 10 years for direct-to-consumer reports).
*   **GEN.20425 - Record and Material Retention Policy**: A disaster-readiness continuity plan detailing how records remain accessible if the laboratory ceases operation.
*   **GEN.20430 - Verification of Copies Prior to Destruction**: Enforces a dual-authorization sign-off verifying image legibility/completeness before original physical records are destroyed.
*   **GEN.20450 - Correction of Laboratory Records**: Restricts record edits so that original entries remain visible, requiring an electronic audit trail log.
*   **GEN.23584 - Interim Self-Inspection**: A checklist module enabling self-evaluation during the midpoint of the laboratory's 2-year accreditation cycle.
*   **GEN.26791 - Terms of Accreditation**: Verification logging of compliance milestones, prompt reporting of director/location changes, and media notifications.
*   **GEN.30000 - Monitoring Analytic Performance**: Documented QC policy setting performance tolerances and clear corrective actions for out-of-control runs.

### Section 2.2: Specimen Collection, Handling, and Reporting
*   **GEN.40016 - Specimen Collection Procedure Review**: Triggers biennial alerts requiring the laboratory director to review all specimen collection and handling procedures.
*   **GEN.40032 - New Specimen Collection Procedure Review**: A sign-off gate requiring director approval before any new or revised collection manual is published.
*   **GEN.40050 - Distribution of Specimen Collection Manuals**: Ensures the collection manual is accessible to phlebotomy, nursing, and clinical areas.
*   **GEN.40100 - Specimen Collection Manual Elements (Clinical Pathology)**: System checks ensuring clinical manuals document patient prep, draw order, and preservative amounts.
*   **GEN.40115 - Specimen Collection Manual Elements (Surgical/Cytopathology)**: Ensures anatomical pathology manuals include specimen fixation guidelines (e.g., 10:1 formalin-to-tissue ratio).
*   **GEN.40125 - Handling of Referred Specimens**: Tracks collection and transport variables for specimens sent to referral laboratories.
*   **GEN.40490 - Patient Identification**: Mandates verifying patient identity using at least two identifiers prior to specimen collection.
*   **GEN.40491 - Primary Specimen Container Labeling**: Enforces a workflow verifying containers are labeled with two identifiers in the presence of the patient.
*   **GEN.40492 - Specimen Label Correction**: Strict policy guidelines tracking instances of and justifications for label corrections.
*   **GEN.40499 - Specimen Collection Feedback**: System to capture and report pre-analytic specimen errors directly back to the collector/phlebotomist.
*   **GEN.40511 - Specimen Tracking/Labeling**: Ensures packages indicate the hazard level of contents during transport.
*   **GEN.40512 - Infectious Material Packing/Shipping**: Compliance log verifying that shipping personnel hold active certifications for hazardous specimen shipping.
*   **GEN.40515 - Transport Personnel Training**: Documented training records for courier and transport personnel regarding temperature controls and spill responses.
*   **GEN.40530 - Specimen Tracking**: Tracking logs matching dispatch time with received time to confirm specimens from remote sites arrive safely.
*   **GEN.40535 - Specimen Transport QM**: Analyzes transport delays and temperature deviations to flag poorly performing routes or clinics.
*   **GEN.40725 - Requisition Data Entry**: Double-entry or digital validation logs checking the accuracy of entered test requisitions.
*   **GEN.40750 - Requisition Elements**: Validation checks verifying a requisition contains patient ID, sex, DOB, ordering physician, tests requested, collection date/time, and clinical source.
*   **GEN.40825 - Specimen ID**: Positive unique barcode identification tracing specimens from collection through aliquots to testing.
*   **GEN.40900 - Specimen Date Received**: Ingests and stamps the exact date and time a specimen is logged into the lab.
*   **GEN.40930 - Authorized Requestor**: System checks verifying that test orders originate from a credentialed clinician.
*   **GEN.40935 - Test Order Read Back**: Double-verification logging of verbal orders, ensuring the recipient reads the order back to the caller.
*   **GEN.40938 - Unclear Test Order**: Holds a test order in a "Pending Clarification" state if instructions are non-standard.
*   **GEN.40942 - Specimen Container Analytic Interference**: Tracks director validations of new blood tube styles or container vendors to ensure they don't cause analytical bias.
*   **GEN.41017 - Centrifuge Operating Speeds**: A maintenance scheduler alerting for annual speed and timer checks of centrifuges.
*   **GEN.41042 - Refrigerator/Freezer Temperatures**: Tracks daily high/low temperatures of critical cold storage units, generating alerts for deviations.
*   **GEN.41067 - Content/Format Report Review**: A workflow for biennial director approval of patient report layouts.
*   **GEN.41077 - Reporting Outside Test Results**: Standards to clearly demarcate results generated by outside labs or reference clinics within the patient report.
*   **GEN.41096 - Report Elements**: Verification checks ensuring reports contain the testing lab's name/address, patient ID, reference intervals, specimen source, and result flags.
*   **GEN.41300 - Report Retention and Retrieval**: Enforces long-term archive performance, verifying that old patient reports remain legible and retrievable.
*   **GEN.41303 - Patient Confidentiality**: Security logs tracking unauthorized access attempts to patient reports.
*   **GEN.41304 - Patient Data Accessibility**: Restricts database access to authenticated, authorized clinical users.
*   **GEN.41306 - Analyst Tracking ID**: Automatically appends the user ID of the performing analyst (or LIS rule engine) to every published result.
*   **GEN.41307 - Report Errors**: Tracks instances where report modifications occur, notifying clinical staff of corrected results.
*   **GEN.41310 - Corrected Report**: Automatically links corrected results to original values, displaying both clearly to clinicians with explanation comments.
*   **GEN.41312 - Multiple Corrections**: Enforces sequential numbering of multiple edits on a single patient record.
*   **GEN.41316 - Significant Infectious Disease Diagnoses**: Priority alert dispatcher notifying public health authorities and clinicians of positive infectious disease results.
*   **GEN.41318 - Reporting and Submission of Materials to Public Health Authorities**: Verification engine checking that mandatory isolate and specimen shipments are logged.
*   **GEN.41345 - Turnaround Time**: Calculates real-time collection-to-received and received-to-verified times, flagging TAT delays.
*   **GEN.41350 - Referral Laboratory Selection**: Evaluates the credentials, CAP/CLIA licenses, and service performance of referral laboratories.
*   **GEN.41430 - Referral Laboratory Report Retention**: Restricts deleting scanned referral results, archiving copies for 2 years.
*   **GEN.41440 - Referral Laboratory Results Reporting**: Enforces that results from referral labs are imported exactly as received without alteration.

### Section 2.3: Quality of Water and Glassware Washing
*   **GEN.41500 - Defined Water Types**: Maintenance scheduler requiring annual testing of water resistivity, microbial count, and silicate levels.
*   **GEN.41770 - Glassware Cleaning**: Scheduler requiring annual checks for detergent residues on washed clinical glassware.

### Section 2.4: Laboratory Computer Services (LIS)
*   **GEN.42750 - Computer Facility Maintenance**: Tracks maintenance of LIS server environments (ventilation, cleanliness, temperature).
*   **GEN.42800 - LIS Fire Equipment**: Logs annual testing of fire safety and suppression hardware in Server rooms.
*   **GEN.42900 - LIS Power**: Periodic validation logs of UPS power backups and emergency generator cutovers.
*   **GEN.43022 - LIS Testing**: A sandbox environment tracking testing and sign-off records before any software update goes live.
*   **GEN.43033 - Custom LIS**: A git-integrated log recording software modifications, developer IDs, and approvals.
*   **GEN.43040 - LIS Policy and Procedure Approval**: Triggers document reviews for computer systems policies and procedures.
*   **GEN.43055 - Computer System Training**: Access-control gate preventing a user from obtaining an LIS login until training checklists are complete.
*   **GEN.43066 - Computer Malfunction Notification**: Accessible disaster manual guiding staff on who to contact during LIS downtime.
*   **GEN.43150 - User Authentication**: Password policy enforcement (length, characters, expiry) and automatic workstation session lockouts.
*   **GEN.43200 - User Authorization Privileges**: Role-based access control (RBAC) mapping system privileges to job descriptions.
*   **GEN.43262 - Unauthorized Software Installation**: System lockouts blocking unknown executables on laboratory computer workstations.
*   **GEN.43325 - Public Network Security**: Encryption checking (TLS 1.3, VPN) for results transmitted over public networks.
*   **GEN.43450 - Verification of Calculations Producing Patient Results**: Calculates dummy values to check mathematical formulas (e.g., eGFR, INR) in LIS biennially.
*   **GEN.43750 - Specimen Quality Comment**: Forces phlebotomist/technician input of specimen compromise tags (e.g., "Lipemic sample - results may be affected").
*   **GEN.43800 - Data Input ID**: Immutable audit trail tagging the exact user ID and timestamp for every keystroke or result change.
*   **GEN.43825 - Result Verification**: LIS workflow prompting review of patient demographics and critical flags before result release.
*   **GEN.43837 - Downtime Result Reporting**: System for recording offline results during server downtime.
*   **GEN.43875 - Autoverification Validation**: Triggers re-validation tasks if rules change in the autoverification logic.
*   **GEN.43876 - Current Autoverification Rules**: An active registry detailing all autoverification logic rules.
*   **GEN.43878 - Autoverification QC Samples**: Blocks autoverification of patient results if instrument QC is out of bounds or expired.
*   **GEN.43881 - Autoverification Results**: Automates critical and absurd limit evaluations, sending flagged results to manual review.
*   **GEN.43887 - Autoverification Audit Trail**: Appends autoverification flags to results, identifying the specific rule sets that authorized release.
*   **GEN.43890 - Autoverification Delta Checks**: Checks current results against historical patient values, routing high-deviation results to manual review.
*   **GEN.43893 - Autoverification Suspension**: An emergency halt switch to instantly disable automated results release for a selected instrument.
*   **GEN.43900 - Archived Test Result**: Ensures retrieval performance of old data, displaying historical reference ranges accurately.
*   **GEN.43920 - Multiple Analyzer ID**: Links results directly to the unique hardware serial number of the analyzing instrument.
*   **GEN.43946 - Data Preservation/Destructive Event**: Enforces automatic off-site database backups with periodic restoration drills.
*   **GEN.46000 - Reference Interval/Units Transmission**: Verification system checking that units of measure and reference ranges travel with results across interfaces.
*   **GEN.48500 - Interface Result Integrity**: Logs systematic transmission audits to ensure values inside LIS match external EMR outputs.
*   **GEN.48750 - LIS Interface Shutdown/Recovery**: Procedural guidelines to prevent data corruption during interface downtime.

### Section 2.5: Personnel
*   **GEN.53400 / GEN.53600 / GEN.53625 / GEN.53650 - Supervisor/Consultant Roles**: A registry detailing academic qualifications, active licenses, and delegated duties for lab directors, supervisions, and consultants.
*   **GEN.54000 - Organizational Chart**: Visual hierarchical map defining reporting lines.
*   **GEN.54025 - Laboratory Personnel Evaluation Roster**: An audited database listing all testing staff, updated annually by the director.
*   **GEN.54200 - Continuing Education**: A learning management portal tracking employee continuing education credits.
*   **GEN.54400 - Personnel Records**: Secure digital folder containing transcripts, professional certifications, and employment timelines.
*   **GEN.54750 - Nonwaived Testing Personnel Qualifications**: Validates diploma requirements (e.g., chemistry/biology degree) for high-complexity test staff.
*   **GEN.55400 - Visual Color Discrimination**: Integrates Ishihara or alternative test tracking for staff conducting color-dependent testing (e.g., urinalysis dipsticks).
*   **GEN.55450 - Personnel Training**: Tracks structured orientation checklists that must be completed before an employee is granted instrument testing permissions.
*   **GEN.55499 - Competency Assessment (Waived Testing)**: Tracks annual waived testing competency checks.
*   **GEN.55500 - Competency Assessment Elements (Nonwaived Testing)**: Documented evaluation of all six CAP competency elements (direct observation, monitor results, review worksheets, direct observation of maintenance, blind testing, and problem-solving).
*   **GEN.55505 - Competency Assessment Frequency (Nonwaived Testing)**: Automatically schedules competency evaluations (semiannually in the first year of testing, and annually thereafter).
*   **GEN.55510 - Competency Assessment (Assessor Qualifications)**: Restricts assessor permissions to individuals holding active supervisory qualifications.
*   **GEN.55525 - Performance Assessment of Supervisors/Consultants**: Triggers annual reviews of senior and supervisory staff.
*   **GEN.57000 - Competency Corrective Action**: Initiates retraining workflows if an employee fails a competency check.

### Section 2.6: Physical Facilities
*   **GEN.59980 - Restricted Laboratory Access**: Keeps track of keypad access codes and key card authorization permissions.
*   **GEN.60000 / GEN.60100 / GEN.60150 - Adequate Space**: Facility audits evaluating workspace crowding and layout safety.
*   **GEN.60250 - Working Environment**: Environmental control panel monitoring ventilation performance and lighting.
*   **GEN.61350 - Direct Sunlight**: Restricts placing sensitive instruments or open reagents in areas with high direct sunlight exposure.
*   **GEN.61400 - Hallway Obstructions**: Daily safety checks verifying corridors are free of waste and boxes.
*   **GEN.61500 / GEN.61600 - Environment Maintenance**: Logs sanitation events for walls, floors, ceilings, and work benches.
*   **GEN.61750 - Hand-off Communication**: Shifts hand-off logging tracking pending tests, troubleshooting events, and critical clinical actions.
*   **GEN.61900 - Inventory Control**: Inventory module tracking reagent lot numbers, shipment dates, and open-vial expirations.
*   **GEN.62000 - Intralaboratory Storage**: Clean, organized storage area monitors.
*   **GEN.62020 - Centralized Reagent and Supply Storage**: Daily logging of centralized walk-in cold rooms and storage areas.
*   **GEN.66100 - Emergency Power**: Tracks fuel levels and load testing records of emergency generators.

### Section 2.7: Laboratory Safety
*   **GEN.73200 / GEN.73300 / GEN.73400 - Safety Programs**: Tracks safety policy edits, read-receipt compliance, and annual safety audits.
*   **GEN.73500 / GEN.73600 / GEN.73700 - Accident Reporting**: Form engine for capturing employee accidents and sharps injuries, automatically initiating root-cause investigations.
*   **GEN.73800 / GEN.73900 - Emergency Plans**: Holds disaster recovery and facility evacuation blueprints.
*   **GEN.74000 - Infection Control**: Documented exposure control protocols for bloodborne pathogens.
*   **GEN.74050 - Safe Specimen Handling/Processing**: Restricts aerosol-generating procedures to certified biosafety cabinets.
*   **GEN.74100 / GEN.74200 - PPE Provision**: Logs inventory levels of gowns, face shields, and masks.
*   **GEN.74250 - Hand Hygiene**: Enforces training on clean-hand compliance policies.
*   **GEN.74300 - Manual Manipulation of Needles**: Mandates strict tracking of accidental needle sticks.
*   **GEN.74400 - Prohibited Practices**: Form to record safety warnings for food/drink in the laboratory workspace.
*   **GEN.74500 - Specimen Transport Procedures**: Enforces secondary containment specifications for sample carriers.
*   **GEN.74600 - Spill Handling**: Logs placement and contents verification of chemical and biological spill response kits.
*   **GEN.74700 / GEN.74800 / GEN.74900 - Health Exposures**: Tracks employee HepB vaccinations, needle stick protocols, and TB screenings.
*   **GEN.75000 - Sterilizing Device Monitoring**: Logs autoclave sterilization temperature cycles and spore vial testing results.
*   **GEN.75100 to GEN.75800 - Fire Protection**: Tracks fire drills, exit clearance audits, extinguisher service stamps, and pull-station status.
*   **GEN.75900 - Electrical Grounding**: Tracks resistance values and leakage currents for instrumentation.
*   **GEN.76000 to GEN.76720 - Chemical Safety**: Document management engine linking chemical inventory to SDS, fume hood air velocity checks, and volatile solvent limits.
*   **GEN.76800 / GEN.76900 - Compressed Gases**: Audit log confirming gas cylinders are chained in upright positions.
*   **GEN.77100 - Radioactive Material**: Document control of isotopes and disposal records.
*   **GEN.77200 / GEN.77300 - Ergonomics and Noise**: Noise level tests in machine areas, tracking employee ergonomic adjustments.
*   **GEN.77400 - Emergency Eyewash**: Tracks weekly activation and performance verification of eyewash systems.
*   **GEN.77500 / GEN.77550 - Liquid Nitrogen Safety**: Logs testing calibration of oxygen deficiency monitors in cryogenic storage.
*   **GEN.77600 / GEN.77700 - UV and Allergies**: Safety compliance logs tracking latex exposures and UV bulb timings.
*   **GEN.77800 to GEN.78010 - Waste Disposal**: Logs hazardous waste volumes, pickup invoices, and patient identity shredding verification.

---

## 3. Database Schema Models (Optimized for GitHub Copilot Context)

GitHub Copilot can read this schema to generate conforming SQLAlchemy Models, PostgreSQL tables, or Prisma Schemas. Keep these structures active when writing databases.

```sql
-- 1. BASE SYSTEM REVISION HISTORY (Enforces GEN.20450: Record Corrections & Audit Trails)
CREATE TABLE compliance_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action_type VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_payload JSONB,
    new_payload JSONB,
    revision_reason TEXT NOT NULL, -- CAP requirement: Must document WHY a change was made
    edited_by_user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. TEMPERATURE LOGS (Enforces GEN.41042 & GEN.62020: Cold Storage Monitoring)
CREATE TABLE refrigerator_temperature_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fridge_identifier VARCHAR(50) NOT NULL, -- "FRIDGE_AP_01"
    acceptable_range_min DECIMAL(4,2) NOT NULL, -- e.g., 2.00°C
    acceptable_range_max DECIMAL(4,2) NOT NULL, -- e.g., 8.00°C
    recorded_value DECIMAL(4,2) NOT NULL,
    is_out_of_range BOOLEAN GENERATED ALWAYS AS (recorded_value < acceptable_range_min OR recorded_value > acceptable_range_max) STORED,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sensor_id VARCHAR(100), -- Integrates directly with hardware telemetry gateway
    corrective_action_id UUID -- Links to event response if out of range
);

-- 3. COMPETENCY TRACKER (Enforces GEN.55500 & GEN.55505: 6-Element Assessment Scheduler)
CREATE TABLE employee_competency_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    assessor_id UUID NOT NULL, -- GEN.55510 Assessor Qualifications check
    instrument_id UUID NOT NULL, -- Competency is test-system specific
    has_element_1_direct_obs BOOLEAN DEFAULT FALSE,
    has_element_2_monitor_results BOOLEAN DEFAULT FALSE,
    has_element_3_review_worksheets BOOLEAN DEFAULT FALSE,
    has_element_4_direct_obs_maintenance BOOLEAN DEFAULT FALSE,
    has_element_5_blind_testing BOOLEAN DEFAULT FALSE,
    has_element_6_problem_solving BOOLEAN DEFAULT FALSE,
    is_competent BOOLEAN GENERATED ALWAYS AS (
        has_element_1_direct_obs AND has_element_2_monitor_results AND 
        has_element_3_review_worksheets AND has_element_4_direct_obs_maintenance AND 
        has_element_5_blind_testing AND has_element_6_problem_solving
    ) STORED,
    assessment_date DATE NOT NULL,
    next_due_date DATE NOT NULL, -- System scheduler uses this for alert dispatches
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. NON-CONFORMING EVENTS & CAPA (Enforces GEN.20208, GEN.20310 & GEN.20318)
CREATE TABLE non_conforming_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    discovery_date TIMESTAMP WITH TIME ZONE NOT NULL,
    severity_level VARCHAR(20) NOT NULL, -- 'MIN_COMPROMISE', 'MEDIUM_RISK', 'SENTINEL'
    event_description TEXT NOT NULL,
    immediate_action_taken TEXT NOT NULL,
    root_cause_analysis TEXT, -- GEN.20310 RCA
    corrective_preventive_action TEXT, -- GEN.20318 CAPA
    capa_effectiveness_verified BOOLEAN DEFAULT FALSE,
    capa_verification_date DATE,
    logged_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

## 4. Prompts & Context Injection Strategy for GitHub Copilot

When building individual modules, copy and paste the corresponding **System Prompt** directly into the GitHub Copilot Chat window to establish localized context.

### Prompt A: Writing Refrigerator Logging Telemetry
```markdown
We are building the telemetry ingestion service for temperature monitoring (GEN.41042).
Refer to our active schema in `refrigerator_temperature_logs`.
Write a service in [Python/TypeScript/Go/C#] that ingests temperature readings from our IoT sensors.
If a reading is out of range, the system must:
1. Fire an 'Out-of-Range' alarm to the messaging queue.
2. Force the creation of an action event log that requires staff to input a documented reason and corrective action before the alarm can be resolved.
Include validation schema to prevent sensor errors (e.g. outlier peaks of 999°C).
Ensure all DB writes are fully structured.
```

### Prompt B: Building the Personnel Competency Scheduler
```markdown
We are implementing the scheduling engine for CAP Employee Competency (GEN.55505).
Competencies must be checked semiannually (every 6 months) during an employee's first year of testing, and annually (every 12 months) thereafter.
Refer to the `employee_competency_assessments` table.
Write a background worker function in [Python/JavaScript/C#] that runs daily to:
1. Scan employee start dates and their history of verified assessments.
2. Identify employees who are within 30 days of an evaluation due date.
3. Dispatch email and dashboard warnings to their respective technical supervisor.
4. If an evaluation goes past due, flag the employee's profile as 'SUSPENDED_FROM_VERIFICATION' to prevent autoverification release.
```

### Prompt C: Implementing Immutable Audit Logging Middleware
```markdown
We are writing database middleware to handle GEN.20450 compliant record editing.
Use our target database ORM to intercept any UPDATE or DELETE operations on critical schemas (QMS, QC, Reports, Competencies).
The middleware must:
1. Reject hard deletes entirely and convert them to soft deletes (updated deleted_at).
2. Read the existing record values.
3. Check for the presence of a 'revision_reason' and 'editor_user_id' in the update transaction payload. If missing, reject the transaction with a 400 validation error.
4. Insert a tracking entry into our `compliance_audit_log` tracking the old payload, new payload, timestamp, and edit explanation.
```
