# CAP Departmental Compliance & Database Architecture Specification
> **System Purpose:** Continuous audit readiness, quality assurance, and clinical validation logic for Hematology, Coagulation, and Transfusion Medicine departments.
> **AI Instruction:** This document is optimized for LLMs and GitHub Copilot. Keep this file active in your IDE workspace. When drafting services, database tables, or clinical validation handlers, refer directly to the CAP codes (e.g., `HEM.XXXXX` or `TRM.XXXXX`) to inherit their specific functional and logic requirements.

---

## 1. Directory of CAP Hematology & Coagulation Checklist Items

This directory defines the operational and validation rules for Hematology and Coagulation. Use these codes as lookup keys in your validation middleware.

### Section 1.1: General Quality Control (Nonwaived Testing)
*   **HEM.19360 - Daily QC - Nonwaived Tests**: Ensures that at least two concentrations of controls are analyzed each day of testing for quantitative tests, or negative and positive controls for qualitative tests. For coagulation tests, controls must run every eight hours of patient testing.
*   **HEM.19380 - Control Range Establishment or Verification**: Establishes or verifies acceptable control ranges for each new lot of control material prior to use, using repetitive analysis (typically 20 runs).
*   **HEM.20050 - Numeric QC Data**: Monthly calculation of QC statistics (mean, SD, coefficient of variation %CV) to define and monitor analytical imprecision.
*   **HEM.20090 - Alternative Control Procedures**: Written, director-approved alternative control protocols (e.g., split sample testing, patient double-runs) for rare testing parameters where commercial controls are unavailable.
*   **HEM.20120 - QC Handling**: Enforces that control specimens are analyzed in the same manner and by the same personnel as patient samples.
*   **HEM.20140 - QC Confirmation of Acceptability**: A hard gate in the LIS requiring review and electronic sign-off of QC results before releasing patient results.
*   **HEM.20143 - QC Corrective Action**: Mandatory logging of out-of-range QC deviations, root causes, and corrective actions (e.g., recalibration, reagent replacement), with a lock blocking patient result verification until QC is resolved.
*   **HEM.20146 - Monthly QC Review**: Triggers monthly alerts for the laboratory director or qualified designee to review and sign off on QC logs, outliers, and trend deviations.

### Section 1.2: Specimen Collection & Handling (Hematology)
*   **HEM.22000 - Collection in Anticoagulant**: Enforces documented validation of rocker platforms or manual specimen mixing methods to ensure complete blood count (CBC) tubes are completely mixed without cell damage.
*   **HEM.22050 - CBC Anticoagulant**: Hard LIS validation block that rejects specimens for routine CBC and blood film morphology if they are not collected in Potassium EDTA (K2/K3 EDTA).
*   **HEM.22100 - Capillary Tube Collection Criteria**: Restricts capillary tube collections to duplicate runs whenever possible and logs collection method (venous vs. capillary) to apply appropriate reference intervals.
*   **HEM.22150 - Specimen Quality Assessment - CBC**: Enforces manual inspection or analyzer flag checks for microclots before running hematology tests.
*   **HEM.22200 - Hemolyzed or Lipemic Specimens - CBC**: Implements analyzer flag validations and automatic plasma-blanking or specimen rejection for samples exhibiting significant in vitro hemolysis or lipemia.
*   **HEM.22625 - Storage and Stability - Hematology**: A database clock tracking sample collection times, flagging specimens that exceed stability limits (e.g., 24 hours at room temp or 48 hours refrigerated for automated CBC).

### Section 1.3: Complete Blood Count (CBC) Instruments & Calibration
*   **HEM.25400 - Precalibrated Instrument Verification**: Verification checks confirming manufacturer-applied calibrations with independent materials prior to clinical reporting.
*   **HEM.25700 - Calibration**: Logs full analyzer calibration events using primary reference standards.
*   **HEM.25760 - Calibration Verification Criteria**: Automated scheduler alerting for calibration verification at least every 6 months, after reagent changes, or after major maintenance.
*   **HEM.25780 - Recalibration**: Standardizes recalibration events when verification checks fail to meet manufacturer tolerances.
*   **HEM.25850 - QC - Stabilized Controls**: Requires running two distinct levels of stabilized control specimens at least once every 24-hour testing cycle.
*   **HEM.25920 - QC - Moving Averages**: Implementation of Bull's Algorithm (weighted moving averages for RBC indices: MCV, MCH, MCHC) on patient results in real-time, detecting drift or calibration shifts when sample sizes reach target batches (typically $N=20$).
*   **HEM.25990 - QC Procedure**: Combines moving averages with commercial stabilized controls to create a multi-layered quality evaluation engine.
*   **HEM.26660 - QC - Retained Patient Specimens**: In labs using retained patient specimens as a QC supplement, the system must calculate and enforce statistical limits of agreement for duplicate testing over defined time intervals.
*   **HEM.27330 - QC - CBC Defined Range**: Restricts retained specimen checks to normal or defined CBC ranges to avoid imprecision skewing.

### Section 1.4: Hematology Error Detection & Verification
*   **HEM.30070 - Sampling Mode Comparison**: An annual scheduler requiring comparison studies between primary (automated sampler) and secondary (manual open-vial) aspiration modes on CBC instruments to ensure matching results.
*   **HEM.30100 - Detection/Correction Procedure - WBC**: LIS verification rule that detects nucleated red blood cells (nRBCs) or megakaryocytes, calculates correct WBC count (using the formula: $\text{Corrected WBC} = \frac{\text{Uncorrected WBC} \times 100}{100 + \text{nRBC per 100 WBC}}$), and appends audit remarks.
*   **HEM.30150 - Spurious CBC Results**: Flagging rules to catch anomalous readings caused by cold agglutinins (MCHC > 36.5 g/dL), rouleaux, or hyperlipidemia, prompting warming or saline replacement protocols.
*   **HEM.30200 - Red Cell Indices**: Real-time delta-check validation of MCV, MCH, and MCHC against historical patient baselines to detect specimen misidentification or instrument aspiration errors.
*   **HEM.30250 - Reportable Range**: Restricts verified results within instrument-validated analytical measurement ranges (AMR), holding results that fall outside upper/lower limits for dilution or manual counting.
*   **HEM.30300 - Platelet Abnormalities**: Automatic reflex slide review triggers when platelet clumps, giant platelets, or platelet satelliteism flags are generated by the analyzer.
*   **HEM.30350 - Spuriously High WBC Concentration**: Automatic reflex to manual check or lysing-agent adjustments for unlysed RBCs or high platelets that artificially inflate the leukocyte count.
*   **HEM.30400 - Platelet Count Verification**: Implements alternate counting methods (e.g., optical fluorescent or manual Neubauer hemocytometer) when extreme microcytosis or cell fragments interfere with electrical impedance counts.

### Section 1.5: Automated Differentials & Blood Film Microorganisms
*   **HEM.34100 - Acceptable Limits - WBC**: Enforces statistical limits of agreement between automated differentials and manual microscopic blood film counts.
*   **HEM.34200 - WBC Differential Verification**: Flags patient results for microscopic slide review based on preset pathological criteria (e.g., blast cells, severe left shift, pancytopenia).
*   **HEM.34655 - Blood Film Parasitology**: Compliance log tracking the availability of reference materials (atlases, positive control slides) to assist technicians in identifying bloodborne parasites (malaria, Babesia).
*   **HEM.34687 - Parasite Load Reporting**: Restricts result entry for positive malaria smears so that the final report must include the calculated parasite load (either as % parasitemia or count per $\mu\text{L}$ of blood) along with species identification.
*   **HEM.34724 - Thick and Thin Smears**: Verification check that both thick smears (for detection) and thin smears (for speciation/quantification) are performed and reported.
*   **HEM.34725 - Stain Reactivity**: Daily log verifying stain reactivity of Wright-Giemsa or rapid malaria stains prior to clinical specimen processing.
*   **HEM.34798 - Malaria Stain Buffer pH**: Logs verification of buffer pH, enforcing a strict range of 6.8 to 7.2 to guarantee the visualization of malarial inclusions (e.g., Schüffner's dots).
*   **HEM.34872 - Slide Review Procedure**: Logs slide review counts under oil immersion, ensuring an adequate number of high-power fields (e.g., 200–300 fields) are evaluated for negative malaria calls.
*   **HEM.36820 - Reference Intervals**: Attaches age- and sex-specific reference ranges and mandatory absolute counts (not just percentages) to all differential results.

### Section 1.6: Coagulation Specimen Handling & Testing
*   **HEM.36840 - Specimen Collection - Intravenous Lines**: Hard validation check confirming that IV draw lines are flushed with at least 5 mL of saline and the first 5 mL (or 6 times the line dead-space volume) of blood is discarded to prevent heparin contamination.
*   **HEM.36860 - Anticoagulant - Coagulation**: Enforces strict sample rejection for coagulation tests drawn in tubes other than 3.2% buffered sodium citrate.
*   **HEM.36880 - Fill Volume and Specimen Mixing - Coagulation**: Automated rejection of underfilled sodium citrate tubes (draw volume < 90% of nominal fill, corresponding to a 9:1 blood-to-anticoagulant ratio).
*   **HEM.36900 - Elevated Hematocrits - Coagulation**: Enforces manual calculation or automated formulation check to adjust the citrate anticoagulant volume for patients with a hematocrit > 55% to prevent falsely prolonged clotting times.
*   **HEM.36920 - Specimen Quality Assessment - Coagulation**: Rejection system for clotted coagulation samples, requiring visual and applicator-stick checks before plasma separation.
*   **HEM.36940 - Specimen Handling for Plasma-Based Testing**: Enforces strict cold-chain and stability tracking:
    *   Uncentrifuged PT specimens stable up to 24 hours at room temp ($18\text{--}24^\circ\text{C}$).
    *   Uncentrifuged aPTT specimens stable up to 4 hours at room temp.
    *   If testing is delayed, plasma must be separated, made platelet-poor (< 10,000/$\mu\text{L}$), and stored at $-20^\circ\text{C}$ (up to 2 weeks) or $-70^\circ\text{C}$ (up to 12 months).
*   **HEM.36960 - Specimen Handling for Whole Blood-Based Testing**: Restricts samples for viscoelastic coagulation testing (e.g., TEG, ROTEM) from being refrigerated or frozen, mandating analysis within validated room temperature stability windows.
*   **HEM.37150 - DIC - Test Availability**: LIS order set rule ensuring that platelet count, aPTT, PT/INR, fibrinogen, and D-dimer are available 24/7 if Disseminated Intravascular Coagulation (DIC) monitoring is ordered.
*   **HEM.37165 - Coagulation Testing and Therapeutic Anticoagulant Recommendations**: Appends interpretive comments and therapeutic range guidelines (e.g., therapeutic heparin anti-Xa target or warfarin INR ranges) directly to clinical reports.
*   **HEM.37175 - Platelet-Poor Plasma**: Calibration scheduler logging annual centrifugation verification (centrifuge speed and duration checks) to guarantee that platelet-poor plasma contains $< 10 \times 10^9/\text{L}$ platelets.
*   **HEM.37300 - Coagulation Quality Control**: Hard gate requiring two levels of controls analyzed every 8 hours of patient testing, and immediately with any change in reagent lot.
*   **HEM.37390 - Cut-Off Values for Qualitative Tests**: Verifies and logs cut-off values for qualitative coagulation tests (e.g., lupus anticoagulant screening ratio) at least every 6 months.

### Section 1.7: Coagulation Studies, PT/INR, and aPTT Calibration
*   **HEM.37400 - Alternative Method Criteria**: Pre-programmed optical instrument overrides (switching to mechanical clot detection or manual dilutions) if specimens exhibit extreme lipemia, hemolysis, or hyperbilirubinemia.
*   **HEM.37600 - Clot Detection**: Logs cleaning cycles and manual probe alignment checks for electromechanical clot detection systems.
*   **HEM.37800 - Duplicate Testing - Manual Testing**: Forces manual PT/aPTT runs to be performed in duplicate, calculating variance and rejecting results that exceed preset limits of agreement.
*   **HEM.37820 - International Sensitivity Index (ISI)**: Registry tracking active ISI values for every lot of thromboplastin, ensuring values correspond to the specific instrument/reagent system combination.
*   **HEM.37830 - INR Calculation Adjustment for ISI**: Automatically recalculates INR values whenever a new lot of thromboplastin reagent is checked into inventory.
*   **HEM.37840 - INR Geometric Mean**: Active calculator determining the geometric mean of the normal population (typically using 20 healthy donor samples) for each new reagent lot to calculate the patient INR: $\text{INR} = \left(\frac{\text{Patient PT}}{\text{Geometric Mean PT}}\right)^{\text{ISI}}$.
*   **HEM.37860 - Report Verification Criteria**: Enforces annual manual verification of LIS INR calculations at critical diagnostic intervals (e.g., INR 2.0 and 3.0).
*   **HEM.37870 - Reference Intervals**: Ensures immediate LIS updates of PT/aPTT reference ranges when reagent lots are changed.
*   **HEM.37880 - Unfractionated Heparin Therapeutic Interval**: Logs the calculation and validation of the aPTT therapeutic interval for unfractionated heparin (UFH) using anti-Xa correlation curves or protamine titration, re-verifying with each new reagent lot.

---

## 2. Directory of CAP Transfusion Medicine Checklist Items

This directory governs blood bank operations, specimen collection, compatibility testing, and storage. These codes are critical for validating blood safety workflows.

### Section 2.1: Quality Management & Risk Reduction (Blood Bank)
*   **TRM.22000 - LIS Transfusion Validation**: Mandatory validation logs verifying all possible permutations of computer-based blood crossmatching and group-specific unit selection before system go-live.
*   **TRM.30000 - Monthly QC Review**: Monthly alerts requiring document sign-off by the medical director or qualified designee on all transfusion service QC logs.
*   **TRM.30550 - Misidentification and Mistransfusion Risk Monitoring**: Continuous quality indicator monitoring pre-transfusion sample errors and mislabeling events to identify system vulnerabilities.
*   **TRM.30575 - Mistransfusion Risk Reduction**: Implements a strict clinical protocol to prevent ABO mistransfusion for non-emergent red cell transfusions:
    *   Requires a secondary confirmation specimen drawn at a separate time to verify ABO group, OR
    *   Enforces an active electronic bedside patient barcode scanning verification system linked to the LIS.
*   **TRM.30700 - QC Records**: Tracks daily performance, reagent cell reactivity, and output of blood preparation devices.
*   **TRM.30800 - Disposition Records**: Secure ledger tracking the final fate of every single blood component received (transfused, discarded with reason, or returned to supplier).
*   **TRM.30850 - Blood/Tissue Supplier Service Agreement**: Document locker holding active, signed agreements/LOU with accredited blood centers and tissue banks.
*   **TRM.30866 - Service Agreement**: Enforces service agreements between transfusion services and clinical departments, specifying turnaround times for emergency and routine blood needs.
*   **TRM.30882 - Supplier Evaluation/Selection Process**: Logs supplier performance audits (e.g., delivery temp deviations, product quality issues).
*   **TRM.30900 - Records of Deviation From SOP**: Restricts non-standard procedural changes (e.g., issuing out-of-temperature units during massive hemorrhage) to instances where the medical director provides an electronic authorization sign-off.
*   **TRM.30950 - Biologic Product Deviation (BPD) Notifications**: Standardized template for filing FDA CBER notifications within 45 days of discovering a manufacturing or distribution deviation that affects safety, purity, or potency.
*   **TRM.30970 - Donor and Transfusion-Related Fatality Notifications**: Severe priority alert workflow to notify the FDA CBER within 24 hours of any transfusion-associated death, with a formal investigation report submitted within 7 days.

### Section 2.2: Reagents, Equipment & Records (Blood Bank)
*   **TRM.31227 - Package Inserts/Manufacturer's Instructions**: Archiving system retaining package inserts for blood bank reagents for 10 years beyond the expiration of the reagent lot.
*   **TRM.31234 - Reagent Handling - Typing Sera**: Restricts use of blood typing sera to manufacturer-approved protocols or validated modifications.
*   **TRM.31241 - Reagent QC**: Locks reagent inventory lots so they cannot be checked out for clinical testing until verification testing is logged.
*   **TRM.31375 - Inventory Control**: Tracks reagent lot numbers, dates received, and disposal dates.
*   **TRM.31400 - Antisera/Reagent Red Cell QC**: Daily reactivity and specificity logging for typing sera and reagent red cells.
*   **TRM.31900 - Serologic Centrifuge Checks**: Maintenance scheduler tracking speed and timer audits on cell washers and serological centrifuges every 6 months.
*   **TRM.32208 - Collection/Processing Equipment**: Periodic calibration and maintenance logs for blood bag scales, shakers, and apheresis devices.
*   **TRM.32250 - Record Retention - Transfusion Medicine**: Database retention policies that restrict archiving or deletion actions based on record type:
    *   **10-Year Retention**: Donor blood testing logs, component production records, patient pre-transfusion tests, transfusion administration records, adverse reaction investigations, and emergency release logs.
    *   **Indefinite Retention**: Donor deferral files, patient blood typing discrepancies, and antibody histories.
*   **TRM.32275 - Component Records**: Visual timeline showing the path of each blood unit from supplier receipt, through processing/testing, to final patient infusion or discard.
*   **TRM.32300 - Receipt of Blood**: Verification log checking that incoming blood shipments arrive with proper temperature indicator status, shipping box integrity, and invoice reconciliation.
*   **TRM.32900 - Bacteriologic Studies**: Registers bacterial culture results for platelets or post-reaction blood components.
*   **TRM.33200 - Personnel Audit Trail**: Logs the unique user ID, workstation IP, and timestamp for every critical step: sample receipt, typing, crossmatch, and unit release.

### Section 2.3: Compatibility Testing & Specimen Verification
*   **TRM.40050 - Agglutination/Hemolysis Criteria**: Standardized visual scales (e.g., $1+$ to $4+$ scoring) built into result entry screens to ensure consistent reporting.
*   **TRM.40100 - Test Result Recording**: Enforces real-time entry of results, blocking retrospectively typed data entries without director-approved justification.
*   **TRM.40120 - QC Handling**: Logs that blood bank control tests are performed by the bench technician running clinical samples.
*   **TRM.40130 - Alternative Control Procedures**: SOP for testing and confirming rare typing antisera.
*   **TRM.40140 - QC Confirmation of Acceptability**: Gating function verifying that daily blood bank QC passed before allowing patient compatibility testing.
*   **TRM.40145 - QC Corrective Action**: Log for documenting action plans when blood bank reagents show weak reactivity or specificity.
*   **TRM.40150 - Anti-D Controls**: Checks that appropriate saline controls are analyzed alongside high-protein anti-D typing reagents.
*   **TRM.40200 - Antiglobulin Test Controls - Anti-IgG**: Standardizes the use of IgG-coated Coombs control cells to verify all negative antiglobulin tests.
*   **TRM.40210 - Antiglobulin Test Controls - Anti-C3**: Enforces C3-coated red cells to verify negative direct/indirect Coombs results using anti-C3 reagents.
*   **TRM.40215 - ABO Typing on Solid Organ Donors**: SOP ensuring duplicate ABO typing and subtyping (e.g., A1 vs. A2) for organ transplant donors.
*   **TRM.40230 - Specimen Labeling for Pretransfusion Testing**: Verification check confirming that recipient specimens are labeled at the bedside in the presence of the patient with the patient's first/last name, unique ID, date/time of draw, and phlebotomist's ID.
*   **TRM.40250 - Specimen/Requisition Verification**: Double-verification log checking that the specimen label matches the clinical requisition form exactly, rejecting samples with minor discrepancies.
*   **TRM.40300 - Historical Record Check**: Automated database check that compares current ABO/Rh and antibody screen results with the patient's historical records.
*   **TRM.40350 - Typing Discrepancies - Investigation/Reconciliation**: Automated lock routing patient specimens to an "Investigation" state if a discrepancy exists between current typing and historical records.
*   **TRM.40450 - Donor Unit ABO/Rh Confirmation**: Re-typing validation log requiring the laboratory to verify the ABO group of all incoming red cell units using segments from the units.
*   **TRM.40500 - Recipient Sample**: Enforces sample expiration rules: pretransfusion specimens must be drawn within 3 days of transfusion if the patient has been transfused or pregnant within the past 3 months, or if history is unknown.
*   **TRM.40550 - Forward/Reverse Typing**: Enforces that both forward (anti-A, anti-B, anti-D) and reverse (A1 cells, B cells) typing are completed to define patient blood group.
*   **TRM.40575 - ABO Group and Rh(D) Verification**: Enforces that a patient's ABO group is verified by repeat testing of the current sample, testing of a second sample, or a matching historical record before issuing blood.
*   **TRM.40600 - Unexpected Antibody Screen**: LIS rule validating that antibody screening includes $37^\circ\text{C}$ incubation, a Coombs phase, and use of unpooled screening cells.
*   **TRM.40650 - Serologic Crossmatch**: Verification log for immediate spin or antiglobulin crossmatches.
*   **TRM.40651 - Autologous Unit Crossmatch**: Specifically manages crossmatch requirements for patient-donated autologous units.
*   **TRM.40652 - Neonate Transfusion**: Directs compatibility checks for infants under 4 months, verifying maternal antibody screen status.
*   **TRM.40655 - DAT Algorithm**: Standardized testing paths when a Direct Antiglobulin Test is ordered, identifying IgG vs. C3 bound proteins.

### Section 2.4: Computer Crossmatches & Component Selection
*   **TRM.40680 - Donor Unit/Recipient Information**: Computer-crossmatch logic requiring input of donor unit number, component type, verified ABO/Rh, confirmatory test, and recipient ABO/Rh.
*   **TRM.40690 - Data Entry Verification**: System safety gate that blocks unit issuance if an ABO incompatibility is detected by the LIS during computer crossmatch.
*   **TRM.40700 - Selection of Blood Components**: System rules mapping correct component selection based on recipient blood type (e.g., compatible red cells, type-specific fresh frozen plasma).
*   **TRM.40705 - Use of Low-Titer Group O Whole Blood**: Strict limits on volume and indications for using low-titer O whole blood in massive transfusion protocols.
*   **TRM.40707 - Stewardship of Group O Rh(D)-Negative Red Blood Cells**: Algorithmic conservation rules for O-negative red blood cells, restricting their use to females of childbearing potential or patients with unknown blood types during active emergency hemorrhage.
*   **TRM.40710 - Rh Negative Transfusion Recipients**: Approval gateway requiring medical director authorization to switch an Rh-negative recipient to Rh-positive blood during inventory shortages.
*   **TRM.40720 - Provisions for Special Components**: Automated reflex rules for ordering special components (e.g., irradiated for bone marrow transplant patients, CMV-negative/leukoreduced for neonates).
*   **TRM.40740 - ABO-Incompatible Plasma and Platelet Transfusions in Infants**: Enforces volume restriction calculations for pediatric patients receiving ABO-incompatible plasma/platelets to prevent hemolysis.
*   **TRM.40760 - Granulocytes and/or Platelets Crossmatch-Compatible**: Mandates serological crossmatching if apheresis platelets contain $> 2\text{ mL}$ of red blood cells.
*   **TRM.40770 - Life-Threatening Situations**: Emergency release workflow:
    *   Generates highly visible "UN-CROSSMATCHED" tags for units issued before compatibility testing is complete.
    *   Enforces continuous testing to complete crossmatches as soon as possible, notifying the physician immediately if an incompatibility is discovered.
*   **TRM.40780 - RhIG Candidates**: Algorithmic identification of postpartum or post-abortion Rh-negative mothers who are candidates for Rh immune globulin (RhIG).
*   **TRM.40800 - RhIG Dosage**: Calculates maternal bleed volume (e.g., Kleihauer-Betke or flow cytometry) and calculates required RhIG vials to ensure administration within 72 hours of delivery.

### Section 2.5: Transfusion Procedures & Safety Logs
*   **TRM.40875 - Transfusion Service Medical Director Responsibility**: Logs annual director evaluations of clinical consent forms and institutional transfusion practices.
*   **TRM.40900 - Blood/Tissue Sign-Out**: A clinical dispatch module prompting a visual inspection of the unit (clots, abnormal color) and clerical verification immediately prior to releasing the unit from the blood bank.
*   **TRM.40925 - Blood/Component Compatibility Label or Tag**: Automatically prints a secure compatibility tag containing two unique patient identifiers, unit ID, component name, donor ABO/Rh, and interpretation of crossmatch tests.
*   **TRM.40950 - Clerical Identification and Transfusion Records Final Check**: Dual-technician electronic sign-off confirming patient identity matches the unit tag perfectly at the time of issue.
*   **TRM.41000 - Blood Administration Procedure**: Patient monitoring logs tracking vital signs (pre-transfusion, 15 minutes post-initiation, and post-transfusion).
*   **TRM.41025 - Transfusionist Training**: Training logs showing annual competency assessments for clinical staff performing bedside transfusions.
*   **TRM.41050 - Handling of Blood Products**: Enforces a 30-minute return rule: blood components returned to the blood bank $> 30\text{ minutes}$ after issuance are discarded unless temperature validation ($1\text{--}10^\circ\text{C}$) is maintained and documented.
*   **TRM.41150 - Addition of Fluids/Drugs**: Bedside auditing system to enforce that no solutions other than 0.9% Normal Saline are co-infused with blood components.
*   **TRM.41300 - Donor and Recipient Information Verification**: Bedside verification checklist requiring two qualified professionals (or electronic barcoding) to verify patient ID, unit number, compatibility tag, and blood type immediately before infusing.
*   **TRM.41450 - Blood Administration Record**: Implements the final transfusion chart record, capturing transfusionist ID, start/stop times, infused volume, and any adverse events.
*   **TRM.41475 - Post-Transfusion Observation**: Standardized patient discharge instruction guidelines for home-transfused patients regarding delayed hemolytic or febrile reactions.
*   **TRM.41500 - Blood Warming System**: Logs annual maintenance and alarm testing for specialized blood warmers to ensure they don't exceed $42^\circ\text{C}$ (hemolysis trigger).

### Section 2.6: Adverse Transfusion Reactions
*   **TRM.41650 - Transfusion Reaction Recognition**: Prompts immediate halt of transfusion and emergency protocol activation if clinical symptoms (e.g., fever $> 1^\circ\text{C}$ rise, chills, hypotension, flank pain, dyspnea) are logged.
*   **TRM.41750 - Reporting of Transfusion Reactions and Incidents**: Automated workflow launching an "Adverse Event investigation" the instant clinical staff flag a suspected reaction.
*   **TRM.41770 - System Failure**: Tracks system-wide errors (e.g., unit issued to the wrong patient) requiring immediate clinical containment, medical director involvement, and root-cause mapping.
*   **TRM.41800 - Post Transfusion Specimen Storage**: Enforces database-driven cold-chain tracking for post-reaction recipient blood samples and corresponding donor bags, which must be refrigerated ($1\text{--}6^\circ\text{C}$) for at least 7 days post-transfusion.
*   **TRM.41850 - Investigation of Suspected Hemolytic Transfusion Reaction**: Implements the immediate post-reaction testing algorithm:
    1. Clerical check for labeling or patient ID errors.
    2. Visual inspection of post-reaction serum/plasma for free hemoglobin (hemolysis check).
    3. Direct Antiglobulin Test (DAT) on post-reaction sample.
*   **TRM.42000 - Additional Transfusion Reaction Evaluation**: Automated secondary testing paths: repeat ABO/Rh typing, repeat antibody screen, and repeat pre-transfusion crossmatch.
*   **TRM.42050 - Transfusion Reaction Interpretation**: Mandatory sign-off screen for the blood bank medical director to review all investigation data and enter a formal diagnostic interpretation (e.g., acute hemolytic, febrile non-hemolytic, TRALI, TACO).
*   **TRM.42060 - Transfusion Reaction Monitoring**: Quality dashboard tracking reaction incidence rates categorized by event type.
*   **TRM.42100 - Blood Supplier Notification**: Standardized email/fax template to notify the blood center within 24 hours of suspected septic reactions or donor-related hazards (e.g., TRALI, infectious disease transmission).
*   **TRM.42110 - TRALI**: Records the hospital's TRALI mitigation protocols and reports suspected cases to the blood supplier.
*   **TRM.42120 - Blood Component Recall and Quarantine**: Instantly locks database records and triggers immediate quarantine alarms for any co-components in inventory if a supplier issues a donor safety recall.
*   **TRM.42135 - Blood Supplier Notifications**: Centralized dashboard to track and action vendor notifications, recalls, and withdrawals.
*   **TRM.42170 - Notifications for Potentially Infectious Blood**: Enforces look-back notification tracking for recipients of blood from donors subsequently found to be positive for HIV, HBV, HCV, or HTLV.

### Section 2.7: Component Preparation, Storage & Modification
*   **TRM.42350 - Blood Component Storage**: Logs adequacy of physical cold storage capacities.
*   **TRM.42400 - Issuance/Release Control**: Maps refrigerator shelving layouts, ensuring crossmatched units are physically separated from un-crossmatched units to prevent inadvertent issuance.
*   **TRM.42450 - Blood/Blood Component Inspection**: Mandatory visual inspection logging (hemolysis, clots, abnormal color, leakage) for incoming units and units at the time of issuance.
*   **TRM.42460 - Blood and Blood Component Shipping**: Logs shipping container validation studies, confirming that transport coolers maintain correct temperatures ($1\text{--}10^\circ\text{C}$ for red cells, below freezing for frozen plasma) during transit.
*   **TRM.42470 - Acceptance Back Into Inventory**: Restricts re-inventory of returned units to those that verify:
    *   The unit was returned within 30 minutes of issuance, OR
    *   The unit temperature remained between $1\text{--}10^\circ\text{C}$ (using validated transport indicators), AND
    *   The bag closure was not breached.
*   **TRM.42480 - Blood Components Storage Requirements**: Enforces strict expiration limits based on modification type (e.g., irradiated red cells expire in 28 days or original expiry, whichever is sooner; opened systems expire in 24 hours).
*   **TRM.42500 - Blood/Component Storage Monitoring**: Enforces continuous automated temperature monitoring gateways or manual logs recorded at least every 4 hours. Generates emergency alerts if cold storage units deviate from target ranges:
    *   **Red Blood Cells / Whole Blood**: $1.0\text{--}6.0^\circ\text{C}$.
    *   **Platelets**: $20.0\text{--}24.0^\circ\text{C}$ (requires continuous gentle agitation).
    *   **Fresh Frozen Plasma / Cryoprecipitate**: $\le -18.0^\circ\text{C}$.
*   **TRM.42550 - Storage Temperature Range Corrective Action**: Triggers emergency action steps (transfer of inventory, technical service dispatch) if a storage unit remains out of temp for $> 15\text{ minutes}$.
*   **TRM.42600 - Consistent Temperature**: Standardizes temperature mapping protocols for blood bank refrigerators, placing sensor probes in volumes of liquid that match the heat-transfer characteristics of blood.
*   **TRM.42700 - Emergency Power Supply**: Daily check showing that all blood refrigerators, freezers, and platelet incubators are plugged into emergency generator circuits.
*   **TRM.42750 - Storage Unit Alarms**: Logs weekly testing of high/low alarm trigger thresholds.
*   **TRM.42850 - Alarm Adjustment**: Enforces that temperature alarms are calibrated to trigger before temperatures go outside acceptable boundaries ($1.0\text{--}6.0^\circ\text{C}$ for refrigerators).
*   **TRM.42900 - Power Failure Back-Up**: Quarterly testing logs of battery-backups for blood storage alarms.
*   **TRM.42950 - Storage Temperature Variances**: Procedural guides showing fallback plans if a blood refrigerator suffers catastrophic mechanical breakdown.
*   **TRM.43500 - Component Processing/Storage**: Registers modification events (pooling, washing, aliquoting) and automatically adjusts unit volumes and expiration times.
*   **TRM.43600 - Component Labeling**: Enforces strict ISBT 128 labeling compliance for all blood components and modifications.
*   **TRM.43605 - Component Labeling - Final Inspection**: Verification log (using dual signatures or validated barcode scanning) to check that modified labels match the unit's actual attributes.
*   **TRM.43610 - Red Blood Cell Unit Labeling with Historical Antigen Typing**: Enforces verification rules before labeling a unit as antigen-negative based on historical records.
*   **TRM.43625 - Label Approval**: Medical director sign-off logs for any new or modified blood component labels.
*   **TRM.43650 - Component Handling**: Audits the sterility of sterile connecting devices, logging weld checks and inspections.
*   **TRM.43700 - Pooled Components**: Retains the parent unit ID, volume, and donor group for every unit consolidated into a pool.
*   **TRM.43750 - 24 Hour Expiration**: Automatically shortens the expiration time of any red blood cell unit to 24 hours if the bag system is opened (non-sterile connection).
*   **TRM.43800 - RBC Hematocrit Limit**: Restricts verified hematocrit levels of prepared red cell units (without additive solution) to $\le 80\%$.
*   **TRM.43900 - RBC Storage**: Freezer monitoring for frozen red cells maintained at $\le -65^\circ\text{C}$.
*   **TRM.43950 - RBC Freezing Method**: Validation logs confirming red cells are frozen using glycerol within 6 days of collection.
*   **TRM.44000 - Pre-Transfusion Testing**: Verifies that recipient testing specimens remain available and linked to thawed/deglycerolized units.
*   **TRM.44100 - Open System Preparation Usage**: Database clock flagging deglycerolized red cell units that exceed 24-hour room temperature stability.
*   **TRM.44150 - Deglycerolization Requirements**: Quality control records showing minimum 80% red cell recovery, complete glycerol removal, and absence of hemolysis.
*   **TRM.44400 - Plasma Freezer Monitoring**: Freezer logs for plasma components stored at $\le -18^\circ\text{C}$ or $\le -65^\circ\text{C}$.
*   **TRM.44450 - Plasma and Cryoprecipitate Thawing**: Waterbath logs verifying thawing temperatures of $30.0\text{--}37.0^\circ\text{C}$, with mandatory use of protective plastic overwraps.
*   **TRM.44525 - Thawed Plasma Label**: Automatically updates unit type to "Thawed Plasma" and changes shelf life to exactly 5 days when stored at $1.0\text{--}6.0^\circ\text{C}$.
*   **TRM.44537 - Thawed Cryoprecipitate-Reduced Plasma Usage**: Enforces a 5-day expiration clock for thawed cryo-poor plasma.
*   **TRM.44950 - Platelet Component Storage**: Continuous telemetry tracking platelet incubator ambient temperatures ($20.0\text{--}24.0^\circ\text{C}$) and rotator speeds, flagging any pauses in agitation $> 15\text{ minutes}$.
*   **TRM.44955 - Bacterial Contamination in Platelets**: Laboratory database checks verifying that platelets have been screened for bacterial contamination (using culture or rapid assay methods) before release.
*   **TRM.44957 - Bacterial Contamination in Platelets Notification**: Immediate priority alert dispatcher to quarantine co-components and notify suppliers/clinicians if platelet screens return positive.
*   **TRM.44970 - Radiation Dose**: Logs irradiation device measurements, verifying a minimum dose of 2500 cGy applied to the center of the container, with 1500 cGy minimum at any point.
*   **TRM.44977 - Blood Component Labeling and Expiration Dates**: Shortens the shelf life of irradiated red blood cells to exactly 28 days (or original expiry, whichever is sooner) and updates the label.
*   **TRM.44984 - Blood Irradiator Maintenance**: Logs annual dose mapping, leakage testing, and timer audits.
*   **TRM.44991 - Irradiated Blood/Component Records**: Enforces a 10-year retention policy for all component irradiation logs.
*   **TRM.50050 - Transfusion Service Medical Director Qualifications**: Registry verifying that the medical director is a board-certified pathologist or holds equivalent transfusion medicine qualifications.
*   **TRM.50150 - Training and Competency for Critical Tasks**: Tracks annual competency evaluations for non-testing critical roles (e.g., blood transport, unit labeling, and component modification).

---

## 3. Database Schema Models (Optimized for GitHub Copilot Context)

GitHub Copilot can read this SQL schema to write migrations, ORM classes, or seed data. These tables map the specialized logic required for high-risk clinical calculations and validation gates.

```sql
-- 1. DAILY COAGULATION CITRATE VOLUME CORRECTION (Enforces HEM.36900)
-- Patients with Hematocrit > 55% have reduced plasma volume, causing false coagulation prolongation in standard tubes.
-- This table tracks the hematocrit correction calculation, logging adjusted citrate values.
CREATE TABLE coagulation_citrate_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    accession_number VARCHAR(50) UNIQUE NOT NULL,
    recorded_hematocrit DECIMAL(5,2) NOT NULL, -- Must be > 55.00% to trigger adjustment
    standard_blood_draw_ml DECIMAL(3,2) DEFAULT 4.50 NOT NULL, -- Typically 4.5 mL draw for 5.0 mL tube
    calculated_citrate_vol_ml DECIMAL(4,3) GENERATED ALWAYS AS (
        -- Formula: Citrate Vol = (0.00185) * (100 - recorded_hematocrit) * standard_blood_draw_ml
        0.00185 * (100.00 - recorded_hematocrit) * standard_blood_draw_ml
    ) STORED,
    standard_citrate_vol_ml DECIMAL(3,2) DEFAULT 0.50 NOT NULL, -- Typically 0.5 mL in standard tubes
    excess_citrate_to_remove_ml DECIMAL(4,3) GENERATED ALWAYS AS (
        0.50 - (0.00185 * (100.00 - recorded_hematocrit) * standard_blood_draw_ml)
    ) STORED,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    calculated_by_user_id UUID NOT NULL,
    is_used_for_draw BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_hematocrit_trigger CHECK (recorded_hematocrit > 55.00 AND recorded_hematocrit < 100.00)
);

-- 2. MOVING AVERAGES MONITOR (Enforces HEM.25920: Bull's Algorithm for RBC Indices)
-- Groups patient runs into batches of N=20, calculates moving average, and flags instrument drift.
CREATE TABLE hematology_moving_averages_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument_id UUID NOT NULL,
    batch_number INT NOT NULL,
    batch_size INT DEFAULT 20 NOT NULL,
    mean_mcv DECIMAL(5,2) NOT NULL, -- MCV target range: e.g., 80-100 fL
    mean_mch DECIMAL(5,2) NOT NULL, -- MCH target range: e.g., 27-33 pg
    mean_mchc DECIMAL(5,2) NOT NULL, -- MCHC target range: e.g., 32-36 g/dL
    deviation_mcv_percent DECIMAL(4,2) NOT NULL,
    deviation_mch_percent DECIMAL(4,2) NOT NULL,
    deviation_mchc_percent DECIMAL(4,2) NOT NULL,
    is_out_of_control BOOLEAN DEFAULT FALSE, -- Flaged if indices deviate > 3% from moving baseline
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    corrective_action_id UUID -- Links to recalibration check if out of control
);

-- 3. TRANSFUSION BEDSIDE DOUBLE-VERIFICATION LOGGER (Enforces TRM.40230, TRM.40950 & TRM.41300)
-- Logs the bedside double-check or barcode scanning verification immediately prior to blood infusion.
CREATE TABLE transfusion_bedside_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_patient_id UUID NOT NULL,
    recipient_verified_name VARCHAR(200) NOT NULL,
    recipient_verified_dob DATE NOT NULL,
    blood_component_unit_id VARCHAR(100) NOT NULL, -- ISBT 128 Unit Barcode
    blood_component_type VARCHAR(50) NOT NULL, -- 'RED_CELLS', 'PLATELETS', 'PLASMA'
    donor_verified_abo_group VARCHAR(5) NOT NULL,
    donor_verified_rh_type VARCHAR(10) NOT NULL,
    recipient_verified_abo_group VARCHAR(5) NOT NULL,
    recipient_verified_rh_type VARCHAR(10) NOT NULL,
    unit_expiration_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    is_abo_rh_compatible BOOLEAN NOT NULL,
    verification_method VARCHAR(20) NOT NULL, -- 'BARCODE_SCAN', 'DUAL_TECHNICIAN_CHECK'
    technician_1_user_id UUID NOT NULL, -- First bedside verifier
    technician_2_user_id UUID NOT NULL, -- Second bedside verifier (mandatory if verification_method is dual check)
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_approved_for_infusion BOOLEAN GENERATED ALWAYS AS (
        is_abo_rh_compatible AND (unit_expiration_datetime > verified_at)
    ) STORED
);

-- 4. BLOOD STORAGE FOUR-HOUR TEMPERATURE CHECKS & TELEMETRY (Enforces TRM.42500 & TRM.42550)
-- Enforces cold-chain bounds for specialized blood bank products, logging status.
CREATE TABLE blood_bank_storage_temp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_unit_identifier VARCHAR(100) NOT NULL, -- e.g., \"PLATELET_INCUBATOR_01\"
    monitored_product_type VARCHAR(50) NOT NULL, -- 'RED_CELLS', 'PLATELETS', 'FROZEN_PLASMA'
    recorded_temp DECIMAL(4,2) NOT NULL,
    acceptable_range_min DECIMAL(4,2) NOT NULL, -- e.g., 20.00°C for Platelets, 1.00°C for Red Cells
    acceptable_range_max DECIMAL(4,2) NOT NULL, -- e.g., 24.00°C for Platelets, 6.00°C for Red Cells
    is_out_of_range BOOLEAN GENERATED ALWAYS AS (recorded_temp < acceptable_range_min OR recorded_temp > acceptable_range_max) STORED,
    rotator_speed_rpm INT, -- Mandated for platelets: must show active agitation
    is_rotator_paused BOOLEAN DEFAULT FALSE,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    logged_by_method VARCHAR(20) DEFAULT 'SENSOR_TELEMETRY' NOT NULL, -- 'SENSOR_TELEMETRY' or 'MANUAL_4_HOUR_CHECK'
    logged_by_user_id UUID, -- NULL if sensor telemetry
    corrective_action_id UUID -- Required if is_out_of_range OR is_rotator_paused is true
);
```

---

## 4. Prompts & Context Injection Strategy for GitHub Copilot

When writing specific backend handlers or controllers, paste these targeted prompts into Copilot to generate compliant code.

### Prompt A: Coagulation Citrate Adjustment Handler
```markdown
We are building the coagulation specimen intake handler (HEM.36900).
Refer to our `coagulation_citrate_adjustments` table.
Write a function in [Python/TypeScript/Go] that intercepts patient hematocrit results.
If the hematocrit is > 55.0%, calculate the exact volume of 3.2% sodium citrate required to draw 4.5 mL of blood using the CLSI formula:
Citrate Vol = 0.00185 * (100 - Hematocrit) * 4.5
The function must return:
1. The target citrate volume.
2. The excess volume of citrate to remove from a standard 0.5 mL citrate tube.
3. A priority action alert for phlebotomy to prepare a modified collection tube before draw.
Include validation boundaries rejecting inputs where hematocrit is <= 55% or >= 100%.
```

### Prompt B: Real-Time Historical Blood Type Discrepancy Gate
```markdown
We are building the pre-transfusion historical check system (TRM.40300 & TRM.40350).
Write an database trigger or handler in [Python/SQL/TypeScript] that runs prior to any compatibility testing transaction.
The system must:
1. Accept the patient's current ABO and Rh typing results.
2. Execute a search for the patient's historical typing records in the database.
3. If no historical record exists, save the current group as 'VERIFIED_PRIMARY' and prompt for a secondary confirmation sample draw (TRM.30575).
4. If a historical record is found, compare the current ABO group and Rh type with the history.
5. If there is a discrepancy (e.g., historical is O Positive, current is A Positive), immediately:
   - Lock the patient's record status to 'DISCREPANCY_HOLD'.
   - Block all automated computer and serological crossmatches.
   - Dispatch an urgent investigation ticket to the Blood Bank Medical Director.
```

### Prompt C: Platelet Agitation & Temperature Monitor
```markdown
We are writing the continuous telemetry monitoring worker for Platelet Incubators (TRM.44950 & TRM.42500).
Refer to the `blood_bank_storage_temp_logs` table.
Write a background worker in [Python/Node.js/Go] that listens to MQTT telemetry events from our incubator sensors.
Every 60 seconds, check the payload for:
1. Refrigerator ambient temperature (must be between 20.0°C and 24.0°C).
2. Platelet agitator rotation speed (must be $> 0$ RPM and `is_rotator_paused` is false).
If the temperature is out of range OR the rotator has been paused for $> 10\text{ minutes}$:
1. Fire an immediate emergency SMS/Pager alert to the blood bank supervisor.
2. Create an unresolved corrective action record in the DB, blocking platelet unit release until resolved.
```
