# CAP Immunology, Flow Cytometry & Chemistry Compliance & Database Architecture Specification
> **System Purpose:** Continuous audit readiness, quality assurance, and real-time clinical validation logic for Immunology, Flow Cytometry, and Chemistry & Toxicology departments.
> **AI Instruction:** This document is optimized for LLMs and GitHub Copilot. Keep this file active in your IDE workspace. When drafting services, database tables, or clinical validation handlers, refer directly to the CAP codes (e.g., `IMM.XXXXX`, `FLO.XXXXX`, or `CHM.XXXXX`) to inherit their specific functional and logic requirements.

---

## 1. Directory of CAP Immunology Checklist Items

This directory defines the operational and validation rules for the Immunology department. Use these codes as lookup keys in your validation middleware and document-review schedulers.

### Section 1.1: Quality Management & Calibration
*   **IMM.33374 - Calibration Procedure**: Triggers biennial or event-driven reviews of calibration records for each immunological test system, verifying that FDA-cleared assays are calibrated following manufacturer specifications [69, 70].
*   **IMM.33448 - Calibration and Calibration Verification Materials**: Restricts calibration and validation transactions to runs that utilize verified, matrix-appropriate target values (e.g., using manufacturer calibrators, CAP CVL materials, or altered patient samples) [70, 71].
*   **IMM.33670 - Recalibration/Calibration Verification Criteria**: Active background daemon checking that calibration verification occurs at least every six months, with automated triggers when a new reagent lot is introduced, major maintenance is performed, or QC shifts occur [71].
*   **IMM.33744 - Recalibration**: Automatically locks clinical reporting on a specific analyzer if calibration verification fails, requiring a logged recalibration event to release the lock [71].
*   **IMM.33800 - AMR Verification Materials**: Enforces that materials used to verify the Analytical Measurement Range (AMR) span the entire range (low, mid, high values) and match the specimen matrix (e.g., serum vs. CSF) [71].
*   **IMM.33818 - AMR Verification**: Scheduler requiring AMR verification every six months. Records the verification data and holds clinical test runs if verification goes past due [71, 72].
*   **IMM.33900 - Diluted or Concentrated Samples**: Implements LIS-based specimen dilutional protocols. Patient results that exceed the AMR must not be reported as a raw value; they must trigger an automated reflex calculation in the LIS based on the diluent type and pipette dilution ratio [72, 73].
*   **IMM.33905 - Cut-Off Values for Qualitative Tests**: Active database check for assays utilizing a cut-off threshold (e.g., ELISA-based autoimmune screens). The analytic performance (sensitivity/specificity) around the cut-off value must be verified initially and re-evaluated every six months [73].
*   **IMM.33910 - Maximum Dilution**: Enforces a database registry of maximum allowable dilutions for each analyte. If a sample is too dilute to yield a result within the AMR at the maximum dilution, the LIS restricts reporting to "greater than [maximum diluted value]" [73, 74].

### Section 1.2: Controls and QC Corrective Action
*   **IMM.34120 - Daily QC - Nonwaived Tests**: Ensures that controls are run each day of patient testing. Quantitative assays require at least two controls at different concentrations. Qualitative assays require a negative control and a positive control. Titred/graded assays (e.g., ANA IFA) require a negative and a weakly reactive control [74].
*   **IMM.34140 - Control Range Establishment or Verification**: Database-driven validation of new QC lots, checking that means and standard deviations (SD) are calculated using at least 20 run repetitions before the lot is approved for daily use [75].
*   **IMM.34142 - Calibrator Preparation**: Enforces separate database profiles and preparation logs for in-house calibrators and controls to prevent cross-contamination or dual-use errors [75].
*   **IMM.34145 - Calibrators as Controls**: Blocks the use of calibrators as daily control materials unless explicitly approved under a manufacturer's protocol for an altered lot number [75].
*   **IMM.34170 - Weakly Reactive Controls**: Mandates that weakly reactive controls are prepared and analyzed daily for all serological assays reporting graded or titered results (e.g., syphilis serology, autoimmune IFA panels) to ensure test system sensitivity around the clinical decision threshold [75].
*   **IMM.34250 - QC Corrective Action**: A hard gate in the LIS that blocks the release of patient results if daily QC is out-of-range, requiring the user to select or input a documented corrective action (e.g., reagent changed, recalibrated) to resolve the block [75, 76].
*   **IMM.34270 - QC Handling**: Audit log confirming that QC runs are performed by bench technologists on rotation, in the same manner as patient testing [76].
*   **IMM.34290 - QC Confirmation of Acceptability**: Requires electronic sign-off of daily control results before patient reports can be verified [76].
*   **IMM.34315 - QC Data**: Real-time graphing engine rendering Levey-Jennings charts and calculating Westgard rules (e.g., 1_3s, 2_2s, R_4s violations) to detect analytical drift or shifts [76].
*   **IMM.34362 - Monthly QC Review**: Triggers monthly notifications for supervisors and the director to review, sign, and archive daily QC runs, outliers, and corrective actions [76, 77].
*   **IMM.34380 - Numeric QC Data**: Monthly calculations of SD, CV%, and means for all immunology parameters to track longitudinal imprecision [77].
*   **IMM.34450 - Fluorescent/Enzyme Antibody Stain QC**: Restricts verification of immunofluorescence (IFA) runs (e.g., ANA, ANCA) unless positive and negative control slides are included in the same analytical run [77].
*   **IMM.34475 - Alternative Control Procedures**: Document locker for alternative verification protocols (e.g., split-sample correlations) for low-volume or specialized immunological analytes lacking commercial QC [77].

### Section 1.3: Specialized Immunology & Serology Pathways
*   **IMM.35070 - Incubator QC**: Tracks CO2 concentration, humidity, and temperature logs for microbiology and cell-culture incubators, alerting for out-of-range readings on days of use [78].
*   **IMM.35275 - Concentration Techniques**: Annual scheduler requiring validation and protein recovery checks for sample concentration devices (e.g., clinical concentrators for CSF oligoclonal banding) [78].
*   **IMM.39800 - Tumor Marker Result Reporting**: Implements a strict tumor marker reporting validation. Since tumor marker results (e.g., PSA, CEA, CA-125, CA 19-9) vary by assay methodology, the final clinical report must [78]:
    1. State the exact manufacturer and assay methodology.
    2. Include a standardized warning that results from different methods are not directly comparable.
    3. Retain a registry of historically used methods for that patient, warning the clinician if a change in methodology occurs during serial monitoring.
*   **IMM.41100 - RPR Needles**: Calibration logger requiring verification of delivery needles used for rapid plasma reagin (RPR) syphilis testing. Must confirm that the needle delivers exactly 60 drops/mL ($\pm 2$ drops) each time a new needle is put into service, or when control patterns drift.
*   **IMM.41400 - New Reagent Lot/Shipment Confirmation of Acceptability - RPR, TPPA and VDRL**: Enforces a parallel testing protocol for new syphilis reagent shipments, checking them against an active lot using known reactive, weakly reactive (low titer), and non-reactive specimens.
*   **IMM.41420 - Syphilis Antibody Screening**: Automates the syphilis screening cascade (standard or reverse algorithm). In the **Reverse Algorithm**:
    1. Perform a treponemal-specific screening assay (e.g., EIA or CIA IgG/IgM).
    2. If reactive, the LIS must automatically reflex order a non-treponemal assay (RPR or VDRL titer).
    3. If the non-treponemal assay is non-reactive (discordant results), the LIS must reflex order a second, different treponemal assay (e.g., TPPA) to resolve and confirm the status.
*   **IMM.41450 - HIV Primary Diagnostic Testing**: Implements the CDC/APHL HIV testing algorithm. Reactive HIV-1/2 screening results must automatically reflex order an HIV-1/HIV-2 antibody differentiation immunoassay. If the differentiation assay is indeterminate or negative, the system must automatically reflex order an HIV-1 nucleic acid test (NAT/Viral Load) to confirm acute infection [79].
*   **IMM.41850 - Direct Antigen Test QC - Nonwaived Tests**: Daily positive and negative control verification for rapid direct antigen test kits (e.g., rapid Strep A, C. difficile toxin) before releasing patient results [79, 80].

---

## 2. Directory of CAP Flow Cytometry Checklist Items

This directory governs instrument performance, cell gating, and clinical reporting for flow cytometry. These items are critical for leukemia/lymphoma immunophenotyping and CD4 absolute count monitoring.

### Section 2.1: Instrument Setup, Laser Alignment & Compensation
*   **FLO.21000 - Laser Alignment & Instrument Performance**: Tracks daily check-bead runs to verify fluidics, laser alignment, and optical path stability. Captures bead peak CV% and mean fluorescence intensity (MFI) [48].
*   **FLO.21200 - Optical Alignment and Sensitivity**: Logs photomultiplier tube (PMT) voltages and laser power daily. Alarms if PMT gains shift beyond established tolerances, indicating filter or detector degradation [48].
*   **FLO.21300 - Fluorescence Compensation**: Enforces spectral compensation verification for multi-color fluorochrome panels using single-color stained control cells or capture beads, preventing optical bleed-through [48, 49].
*   **FLO.22100 - Pipette Calibration / Sample Volume**: Logs annual gravimetric or fluorometric pipette calibrations, which is critical for assays calculating absolute cell counts (e.g., CD4 T-cell count using single-platform bead-based assays) [49, 50].
*   **FLO.22500 - Monoclonal Antibody Panel Verification**: Parallel testing workflow for new lots of monoclonal antibodies (e.g., anti-CD3, anti-CD4, anti-CD8), comparing signal-to-noise ratios, stain index, and gating performance against the active lot [50].

### Section 2.2: Flow Cytometry Sample Gating, Integrity & Reporting
*   **FLO.23200 - Specimen Viability**: Requires entry of cell viability percentages (e.g., using 7-AAD or Propidium Iodide exclusion) for specimens analyzed $>24$ hours post-collection, or for low-viability specimens like tissue biopsies and bone marrow [51].
*   **FLO.23500 - Gating Strategy Documentation**: Registry of standardized gating layouts (e.g., CD45 vs. Side Scatter for lymphocyte selection, CD3 vs. CD4/CD8 for T-cell subsets). Standardizes audit checks for hand-drawn gates [51, 52].
*   **FLO.23700 - Cellular Analysis Integrity**: Verifies that a minimum count of target events (e.g., minimum 10,000 lymphocytes in the gating pool) are collected to ensure statistical accuracy in low-prevalence population detection [52].
*   **FLO.24000 - Gating Quality Control (Lymphosum Rule)**: For T, B, and NK cell subset panels, the system must verify the **Lymphosum**: the sum of CD3+ (T-cells), CD19+ (B-cells), and CD16+/CD56+ (NK-cells) must equal the total CD45+ lymphocyte gate percentage within a strict tolerance of $95\% \text{ to } 105\%$ ($\pm 5\%$). If out of range, the LIS blocks verification and flags a "Gate Audit Required" task [52, 53].
*   **FLO.25200 - Clinical Report Interpretive Comments**: Restricts verification of leukemia/lymphoma immunophenotyping panels to board-certified pathologists. Ensures reports capture cell viability, gating strategies, antigen abnormalities, and a formal clinical interpretation [55].

---

## 3. Directory of CAP Chemistry & Toxicology Checklist Items

This directory defines the operational and validation rules for the Clinical Chemistry and Toxicology department. These requirements focus on analytical measurement limits, spectrophotometric interference screening, and mathematical results calculation.

### Section 3.1: Quality Management & Calibration (Chemistry)
*   **CHM.12925 - Hemoglobin A1C Testing**: For laboratories conducting Hemoglobin A1c measurements, the system must track proficiency testing (PT) grading and verify performance limits against a strict $\pm 6\%$ target criteria [6].
*   **CHM.12950 - Calibration and Verification (Waived Tests)**: Enforces that testing personnel follow manufacturer-prescribed calibration and calibration verification protocols for waived testing systems, logging compliance [7].
*   **CHM.13000 - Calibration Procedure**: Maps detailed calibration procedures, frequencies, and target concentrations for all clinical chemistry instrumentation, with documented director review and sign-off [8].
*   **CHM.13100 - Calibration and Calibration Verification Materials**: Mandates the use of high-quality, matrix-appropriate target materials with defined analyte target values for calibration and verification whenever possible [8].
*   **CHM.13125 - Calibration Materials - Non-FDA Cleared/Approved Assays**: Requires certificates of quality and quality check logs for calibrators used in non-FDA cleared/approved assays to ensure accuracy of new lots [9].
*   **CHM.13175 - Pure Controlled Substances**: Enforces that the laboratory maintains appropriate DEA licenses and state credentials for controlled substances used in testing [9].
*   **CHM.13400 - Recalibration/Calibration Verification Criteria**: Active background daemon validating that calibration verification is performed at least every 6 months, or upon reagent lot change, major instrument maintenance, or QC drift [9].
*   **CHM.13500 - Recalibration**: Automatically locks clinical reporting for a test system if calibration verification fails, requiring a documented recalibration event to clear [9].
*   **CHM.13550 - AMR Verification Materials**: Enforces the use of matrix-appropriate linearity materials that span the low, mid, and high concentration ranges of the Analytical Measurement Range (AMR) [9].
*   **CHM.13600 - AMR Verification**: Scheduler verifying the AMR at least every 6 months after a method is initially placed in service. Retains records and holds patient runs if verification goes past due [10].
*   **CHM.13710 - Diluted or Concentrated Samples**: Implements LIS-based dilution protocols. Results exceeding the upper limit of the AMR must not be reported as raw values; they must trigger automated calculations based on the dilution factor and diluent type [10].
*   **CHM.13720 - Maximum Dilution**: Enforces a database registry of maximum allowable dilutions for each chemistry analyte to prevent reporting unreliable, over-diluted results [11].
*   **CHM.13730 - Concentration Techniques**: Annual scheduler requiring documented verification of concentration techniques used for quantitative tests (e.g., urine protein electrophoresis) [11].
*   **CHM.13750 - Cut-Off Values for Qualitative Tests**: Active verification check for qualitative tests utilizing a quantitative cut-off. Verifies the cut-off value at lot changes, major service, and at least every 6 months [11].

### Section 3.2: Quality Control & Corrective Actions (Chemistry)
*   **CHM.13840 - QC - Waived Tests**: Enforces daily recording of acceptable internal control results (at least once per day of testing) for waived devices, unless the instrument automatically locks upon QC failure [12].
*   **CHM.13860 - QC Corrective Action - Waived Tests**: Mandatory logging of corrective actions when control results for waived tests exceed defined acceptance limits [13].
*   **CHM.13900 - Daily QC - Nonwaived Tests**: Ensures that controls are run each day of patient testing. Quantitative chemistry assays require at least two controls at different concentrations. Qualitative assays require negative and positive controls. Blood gas tests require controls run every 8 hours [13].
*   **CHM.13950 - Fluorescent Antibody Stain QC**: Restricts verification of fluorescent chemistry and serological stains (e.g., ANA IFA) unless positive and negative controls are included in each run [13].
*   **CHM.14000 - Control Range Establishment or Verification**: Requires calculating means and standard deviations (SD) from at least 20 repetitive runs for each new lot of unassayed control material prior to clinical use [13].
*   **CHM.14125 - Calibrator Preparation**: Restricts the use of calibrators as QC materials. Requires separate preparation and logging for in-house calibrators and controls [14].
*   **CHM.14150 - Calibrators as Controls**: Blocks the use of calibrators as controls unless they are from a separate lot number than that used to calibrate the method [14].
*   **CHM.14200 - Alternative Control Procedures**: Document locker for alternative verification protocols (e.g., split-sample testing, patient double-runs) when commercial QC is unavailable [14].
*   **CHM.14300 - QC Data**: Real-time graphing engine plotting control runs to detect analytical trends, shifts, or instrument malfunctions [14].
*   **CHM.14500 - Numeric QC Data**: Enforces monthly calculation of QC statistics (mean, SD, %CV) to monitor and define analytical imprecision [15].
*   **CHM.14600 - QC Corrective Action**: A hard LIS gate blocking clinical result verification on QC failure. Requires documented root cause analysis and corrective action before patient result release [15].
*   **CHM.14800 - QC Handling**: Audit log confirming that QC specimens are tested by the same personnel and in the same manner as clinical samples [15].
*   **CHM.14900 - QC Confirmation of Acceptability**: Requires technologist and supervisor review of control results for acceptability before patient results are reported [15].
*   **CHM.14916 - Monthly QC Review**: Scheduler alerting for monthly director or designee review and sign-off on QC records, outliers, and corrective actions [16].

### Section 3.3: Chemistry Calculations, Reporting & Reflex Gating
*   **CHM.15225 - eGFR and LDL Cholesterol Calculated Test Results**: Standardizes LIS calculated parameters. Patient reports must indicate the exact equation name (e.g., CKD-EPI 2021 for eGFR, Friedewald equation for Calculated LDL) to ensure clinical transparency [16].
*   **CHM.29050 - Tumor Marker Result Reporting**: Implements reporting constraints for tumor markers (PSA, CEA, CA-125), requiring that reports include the exact assay manufacturer, methodology, and a warning that results from different methods are not directly comparable [16].
*   **CHM.33790 - HIV Primary Diagnostic Testing**: Automatically executes the primary and confirmatory screening algorithm, reflexing to confirmatory testing (EIA/Western blot/NAT) as recommended by public health authorities [17].

---

## 4. Database Schema Models (Optimized for GitHub Copilot Context)

GitHub Copilot can read this SQL schema to write migrations, ORM classes, or database constraint checks. These tables map the specialized logic required for high-risk clinical calculations, spectrophotometric HIL indices, and flow cytometry telemetry.

```sql
-- 1. FLOW CYTOMETRY PMT TELEMETRY & ALIGNMENT LOGS (Enforces FLO.21000 & FLO.21200)
-- Monitors PMT voltages, laser power, and alignment peak CV% to catch instrument degradation.
CREATE TABLE flow_cytometry_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_identifier VARCHAR(100) NOT NULL, -- e.g., "FLOW_FACSCAN_01"
    laser_power_mw DECIMAL(6,2) NOT NULL, -- Laser excitation power in milliwatts
    pmt_voltage_fitc INT NOT NULL, -- FITC PMT channel voltage
    pmt_voltage_pe INT NOT NULL,  -- PE PMT channel voltage
    pmt_voltage_apc INT NOT NULL, -- APC PMT channel voltage
    alignment_bead_lot VARCHAR(50) NOT NULL,
    bead_mfi_target DECIMAL(8,2) NOT NULL,
    bead_mfi_observed DECIMAL(8,2) NOT NULL,
    singlet_gate_cv_percent DECIMAL(4,2) NOT NULL, -- Peak CV% (must be < 3.00% for optimal alignment)
    is_out_of_alignment BOOLEAN GENERATED ALWAYS AS (singlet_gate_cv_percent > 3.00) STORED,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    logged_by_user_id UUID NOT NULL,
    corrective_action_id UUID -- Links to service log if out of alignment
);

-- 2. T-CELL SUBSET LYMPHOSUM QUALITY CHECK TRIGGER (Enforces FLO.24000)
-- Calculates the sum of lymphocyte subsets which must equal 100% (+/- 5%) relative to the CD45 gate.
CREATE TABLE flow_lymphosum_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    accession_number VARCHAR(50) UNIQUE NOT NULL,
    cd3_tcell_percent DECIMAL(5,2) NOT NULL, -- e.g., 72.50%
    cd19_bcell_percent DECIMAL(5,2) NOT NULL, -- e.g., 12.10%
    cd16_cd56_nkcell_percent DECIMAL(5,2) NOT NULL, -- e.g., 10.40%
    lymphosum_sum DECIMAL(6,2) GENERATED ALWAYS AS (
        cd3_tcell_percent + cd19_bcell_percent + cd16_cd56_nkcell_percent
    ) STORED,
    is_lymphosum_valid BOOLEAN GENERATED ALWAYS AS (
        lymphosum_sum >= 95.00 AND lymphosum_sum <= 105.00 -- Enforces +/- 5% tolerance
    ) STORED,
    gating_strategy_id VARCHAR(50) DEFAULT 'CD45_SSC_LYMPHS' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified_by_user_id UUID,
    is_locked_for_gate_audit BOOLEAN GENERATED ALWAYS AS (NOT (cd3_tcell_percent + cd19_bcell_percent + cd16_cd56_nkcell_percent >= 95.00 AND cd3_tcell_percent + cd19_bcell_percent + cd16_cd56_nkcell_percent <= 105.00)) STORED
);

-- 3. SYPHILIS REVERSE SCREENING REFLEX ENGINE (Enforces IMM.41420)
-- Directs the automated reflex cascade when screening treponemal antibodies are positive.
CREATE TABLE syphilis_reflex_screens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    accession_number VARCHAR(50) UNIQUE NOT NULL,
    treponemal_screen_method VARCHAR(50) NOT NULL, -- 'EIA_IGG_IGM' or 'CIA'
    treponemal_screen_result VARCHAR(20) NOT NULL, -- 'REACTIVE', 'NON_REACTIVE'
    
    rpr_reflex_ordered BOOLEAN DEFAULT FALSE,
    rpr_result VARCHAR(20), -- 'REACTIVE', 'NON_REACTIVE'
    rpr_titer_ratio VARCHAR(20), -- e.g., '1:8', '1:32' if reactive
    
    tppa_confirmation_ordered BOOLEAN DEFAULT FALSE, -- Ordered automatically if screen is REACTIVE but RPR is NON_REACTIVE
    tppa_result VARCHAR(20), -- 'REACTIVE', 'NON_REACTIVE'
    
    final_interpretation TEXT, -- Compiled clinical conclusion
    current_state VARCHAR(50) DEFAULT 'PENDING_SCREEN' NOT NULL, -- 'COMPLETED', 'DISCORDANT_HOLD', 'CONFIRMED_POSITIVE'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. TUMOR MARKER MONITORING & METHOD REGISTRY (Enforces IMM.39800 & CHM.29050)
-- Logs patient assay history and issues a warning if a patient's serial test changes manufacturer or method.
CREATE TABLE tumor_marker_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    analyte_name VARCHAR(50) NOT NULL, -- 'PSA', 'CEA', 'CA_125'
    current_value DECIMAL(8,2) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL, -- 'ng/mL' or 'U/mL'
    manufacturer_kit_name VARCHAR(100) NOT NULL, -- e.g., "Abbott Alinity"
    assay_methodology VARCHAR(100) NOT NULL, -- e.g., "Chemiluminescent Microparticle Immunoassay (CMIA)"
    
    historical_manufacturer_kit VARCHAR(100),
    historical_assay_methodology VARCHAR(100),
    is_methodology_changed BOOLEAN GENERATED ALWAYS AS (
        historical_manufacturer_kit IS NOT NULL AND historical_manufacturer_kit <> manufacturer_kit_name
    ) STORED,
    mandatory_report_comment TEXT GENERATED ALWAYS AS (
        'Results obtained with different assay methodologies or kits cannot be directly compared. Historical test was performed on: ' || COALESCE(historical_manufacturer_kit, 'Unknown') || ' using ' || COALESCE(historical_assay_methodology, 'Unknown') || '.'
    ) STORED,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified_by_user_id UUID NOT NULL
);

-- 5. CHEMISTRY CALCULATED RESULTS (Enforces CHM.15225)
-- Evaluates eGFR using CKD-EPI 2021 (race-free) and Calculated LDL using the Friedewald equation with TG constraints.
CREATE TABLE chemistry_calculated_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    accession_number VARCHAR(50) UNIQUE NOT NULL,
    patient_age INT NOT NULL,
    patient_sex VARCHAR(10) NOT NULL, -- 'MALE', 'FEMALE'
    
    -- Inputs for eGFR (CKD-EPI 2021 Equation)
    serum_creatinine_mg_dl DECIMAL(4,2) NOT NULL,
    calculated_egfr_ml_min DECIMAL(5,2) NOT NULL, -- Calculated asynchronously or via API
    egfr_equation_used VARCHAR(50) DEFAULT 'CKD-EPI 2021' NOT NULL,
    
    -- Inputs for Calculated LDL (Friedewald Equation)
    total_cholesterol_mg_dl DECIMAL(5,2) NOT NULL,
    hdl_cholesterol_mg_dl DECIMAL(5,2) NOT NULL,
    triglycerides_mg_dl DECIMAL(5,2) NOT NULL,
    calculated_ldl_mg_dl DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN triglycerides_mg_dl < 400.00 THEN total_cholesterol_mg_dl - hdl_cholesterol_mg_dl - (triglycerides_mg_dl / 5.0)
            ELSE NULL -- Invalid if TG >= 400
        END
    ) STORED,
    is_ldl_calculation_valid BOOLEAN GENERATED ALWAYS AS (triglycerides_mg_dl < 400.00) STORED,
    ldl_equation_used VARCHAR(50) DEFAULT 'Friedewald Equation' NOT NULL,
    reflex_direct_ldl_ordered BOOLEAN DEFAULT FALSE, -- Automatically marked True if triglycerides >= 400
    
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified_by_user_id UUID
);

-- 6. CHEMISTRY HIL INTERFERENCE VALIDATIONS (Enforces CHM.13710)
-- Stores spectrophotometric Hemolysis, Icterus, and Lipemia values, gating clinical result verification.
CREATE TABLE chemistry_hil_interference_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accession_number VARCHAR(50) NOT NULL,
    analyte_name VARCHAR(50) NOT NULL, -- 'POTASSIUM', 'LDH', 'AST'
    reported_value DECIMAL(8,2) NOT NULL,
    
    -- Spectrophotometric index values
    hemolysis_index INT NOT NULL, -- H-Index
    icterus_index INT NOT NULL,   -- I-Index
    lipemia_index INT NOT NULL,   -- L-Index
    
    -- Assay-specific interference cutoffs (stored as metadata/reference bounds)
    hemolysis_cutoff INT NOT NULL, -- e.g., 150 for Potassium, 50 for LDH
    icterus_cutoff INT NOT NULL,
    lipemia_cutoff INT NOT NULL,
    
    is_compromised BOOLEAN GENERATED ALWAYS AS (
        hemolysis_index >= hemolysis_cutoff OR 
        icterus_index >= icterus_cutoff OR 
        lipemia_index >= lipemia_cutoff
    ) STORED,
    gating_status VARCHAR(50) DEFAULT 'PENDING_HIL_CHECK' NOT NULL, -- 'VERIFIED_RELEASE', 'CANCELED_INTERFERENCE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_by_user_id UUID
);

-- 7. CHEMISTRY AMR LINEARITY CHECKS (Enforces CHM.13600)
-- Schedules and logs the mandatory 6-month linearity checks spanning low to high concentration limits.
CREATE TABLE chemistry_amr_linearity_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_id VARCHAR(50) NOT NULL,
    analyte_name VARCHAR(50) NOT NULL, -- 'GLUCOSE', 'CREATININE'
    linearity_material_lot VARCHAR(50) NOT NULL,
    target_concentration_low DECIMAL(8,2) NOT NULL,
    observed_concentration_low DECIMAL(8,2) NOT NULL,
    target_concentration_mid DECIMAL(8,2) NOT NULL,
    observed_concentration_mid DECIMAL(8,2) NOT NULL,
    target_concentration_high DECIMAL(8,2) NOT NULL,
    observed_concentration_high DECIMAL(8,2) NOT NULL,
    
    correlation_coefficient_r2 DECIMAL(4,3) NOT NULL, -- Linear regression fit (must be >= 0.99)
    is_linearity_acceptable BOOLEAN GENERATED ALWAYS AS (correlation_coefficient_r2 >= 0.99) STORED,
    validated_at DATE NOT NULL,
    next_validation_due_date DATE NOT NULL, -- 6-month scheduler limit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

---

## 5. Prompts & Context Injection Strategy for GitHub Copilot

When writing specific backend handlers or controllers, paste these targeted prompts into Copilot to generate compliant code.

### Prompt A: Flow Cytometry Lymphosum Check Middleware
```markdown
We are building the Flow Cytometry lymphocyte subset verification check (FLO.24000).
Refer to our active database schema in `flow_lymphosum_verifications`.
Write a service in [Python/TypeScript/Go] that intercepts incoming T-cell subset percentage results.
The service must check if the sum of CD3% + CD19% + (CD16+56)% equals 100% within a +/- 5% margin (95% to 105%).
If the sum falls outside this range (e.g. 91.2% or 108.4%):
1. Set 'is_locked_for_gate_audit' to True.
2. Intercept the verification transaction, blocking the release of results to EMR.
3. Append a system comment: "Gating validation failed: Lymphosum sum is [SUM]%. Gate audit required by supervisor."
4. Fire a high-priority "GATE_AUDIT_REQUIRED" task for the Flow Cytometry supervisor.
Include unit tests to verify both passing cases and failing margins.
```

### Prompt B: Syphilis Reverse Screening Reflex Controller
```markdown
We are implementing the automated control logic for Syphilis Reverse Algorithm Screening (IMM.41420).
Refer to our active database schema in `syphilis_reflex_screens`.
Write an asynchronous handler in [Python/JavaScript] that processes completed treponemal screen antibody results:
1. If the treponemal antibody screen is 'NON_REACTIVE', set final_interpretation to "Syphilis Infection Highly Unlikely" and state to 'COMPLETED'.
2. If the screen is 'REACTIVE', automatically trigger an order for a reflex RPR non-treponemal test (rpr_reflex_ordered = True) and update state to 'AWAITING_RPR'.
3. When the RPR result is ingested:
   - If RPR is 'REACTIVE', set final_interpretation to "Untreated or Active Syphilis Infection", set state to 'CONFIRMED_POSITIVE', and save.
   - If RPR is 'NON_REACTIVE' (discordant), automatically order a TPPA confirmation assay (tppa_confirmation_ordered = True) and set state to 'AWAITING_TPPA'.
4. When the TPPA result is ingested:
   - If TPPA is 'REACTIVE', set final_interpretation to "Past Treated Syphilis or Early/Late Syphilis, Confirmed" and state to 'COMPLETED'.
   - If TPPA is 'NON_REACTIVE', set final_interpretation to "Probable False-Positive Treponemal Screen" and state to 'COMPLETED'.
Ensure all transitions are fully logged in our audit trail tables.
```

### Prompt C: Tumor Marker Methodology Delta Checker
```markdown
We are implementing the serial monitoring methodology safety check for Tumor Markers (IMM.39800 & CHM.29050).
Refer to the `tumor_marker_monitoring` table.
Write a function in [Python/TypeScript] that runs when a tumor marker result (CEA, PSA, CA-125) is entered.
The function must:
1. Query the database for the patient's most recent prior result for that specific analyte.
2. If a prior result exists, pull its 'manufacturer_kit_name' and 'assay_methodology'.
3. Compare the prior kit name with the current kit name.
4. If they do not match, set 'is_methodology_changed' to True and automatically prepend the generated 'mandatory_report_comment' to the patient's final report comments.
5. Create a warning flag on the verification screen to alert the verifying pathologist that a methodology change occurred, prompting them to verify if a baseline redetermination is needed.
```

### Prompt D: Calculated LDL & eGFR Reflex Engine
```markdown
We are building the chemistry calculated parameters microservice (CHM.15225).
Refer to the active database schema in `chemistry_calculated_results`.
Write a service in [Python/TypeScript] that handles two specific clinical math workflows:

1. **Calculated LDL (Friedewald Equation)**:
   - Calculate LDL = Total Cholesterol - HDL - (Triglycerides / 5.0).
   - If Triglycerides are >= 400.00 mg/dL:
     - Cancel the calculation, leaving calculated_ldl_mg_dl as NULL.
     - Set is_ldl_calculation_valid to False.
     - Set reflex_direct_ldl_ordered to True.
     - Issue a reflex order for a spectrophotometric "Direct LDL Cholesterol" test.
     - Append report comment: "Calculated LDL cholesterol is invalid when Triglycerides are >= 400 mg/dL. Direct LDL has been ordered reflexively."

2. **eGFR (CKD-EPI 2021 Creatinine Equation - Race-Free)**:
   - Implement the race-free CKD-EPI 2021 creatinine equation.
   - For Female (Serum Creatinine <= 0.7): eGFR = 142 * (Scr/0.7)^-0.241 * 0.9938^Age
   - For Female (Serum Creatinine > 0.7): eGFR = 142 * (Scr/0.7)^-1.200 * 0.9938^Age
   - For Male (Serum Creatinine <= 0.9): eGFR = 142 * (Scr/0.9)^-0.302 * 0.9938^Age
   - For Male (Serum Creatinine > 0.9): eGFR = 142 * (Scr/0.9)^-1.200 * 0.9938^Age
   - Save the calculated eGFR to 'calculated_egfr_ml_min' and record the equation used.

Write unit tests to verify both standard lipid calculations, Triglyceride cutoff triggers, and creatinine eGFR math boundaries.
```

### Prompt E: Automated HIL Index Spectrophotometric Interference Gate
```markdown
We are writing database trigger/interceptor middleware to validate spectrophotometric interference values for clinical chemistry panels (CHM.13710).
Refer to the `chemistry_hil_interference_validations` table.
Write a middleware handler in [Python/SQL/TypeScript] that checks incoming patient Chemistry results prior to LIS release.
The middleware must:
1. Identify the analyte being processed (e.g., Potassium, AST, LDH) and retrieve its HIL interference thresholds from a lookup configuration.
2. Compare the specimen's observed H-index (Hemolysis), I-index (Icterus), and L-index (Lipemia) against those cutoffs.
3. If any index is equal to or greater than its cutoff (e.g., Potassium hemolysis_index is 162 against cutoff 150):
   - Set 'is_compromised' to True.
   - Update 'gating_status' to 'CANCELED_INTERFERENCE'.
   - Cancel the test run in the transaction, blocking result publication to the EMR.
   - Automatically write result: "CANCELED: Specimen compromised due to severe [HEMOLYSIS/ICTERUS/LIPEMIA]."
   - Open a secondary clinical order for an immediate specimen recollection with high-priority.
Write comprehensive logging showing the original compromised values, the blocked transaction, and the generated recollection task.
```
