-- LabQMS PostgreSQL database schema
-- Generated from repository documentation and markdown architecture notes.

CREATE TABLE laboratories (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE laboratory_sections (
    id SERIAL PRIMARY KEY,
    laboratory_id INTEGER REFERENCES laboratories(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    location_code TEXT UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE staff_positions (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    employee_number TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    position_id INTEGER REFERENCES staff_positions(id) ON DELETE SET NULL,
    section_id INTEGER REFERENCES laboratory_sections(id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    supervisor_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    email TEXT UNIQUE,
    phone TEXT,
    hire_date DATE,
    termination_date DATE,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_accounts (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sop_books (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    book_number INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sops (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES sop_books(id) ON DELETE SET NULL,
    index_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    version TEXT,
    effective_date DATE,
    next_review_date DATE,
    scope_distribution TEXT,
    status TEXT DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sop_versions (
    id SERIAL PRIMARY KEY,
    sop_id INTEGER REFERENCES sops(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    effective_date DATE,
    review_date DATE,
    description TEXT,
    change_summary TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sop_control_pages (
    id SERIAL PRIMARY KEY,
    sop_id INTEGER REFERENCES sops(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sop_reviews (
    id SERIAL PRIMARY KEY,
    sop_id INTEGER REFERENCES sops(id) ON DELETE CASCADE,
    review_date DATE,
    reviewer_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    review_status TEXT,
    comments TEXT,
    next_review_date DATE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sop_change_logs (
    id SERIAL PRIMARY KEY,
    sop_id INTEGER REFERENCES sops(id) ON DELETE CASCADE,
    changed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    changed_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    change_summary TEXT NOT NULL,
    effective_date DATE,
    notes TEXT
);

CREATE TABLE sop_readers (
    id SERIAL PRIMARY KEY,
    sop_id INTEGER REFERENCES sops(id) ON DELETE CASCADE,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    version_id INTEGER REFERENCES sop_versions(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP WITHOUT TIME ZONE,
    status TEXT,
    notes TEXT
);

CREATE TABLE sop_controlled_copies (
    id SERIAL PRIMARY KEY,
    sop_id INTEGER REFERENCES sops(id) ON DELETE CASCADE,
    location TEXT,
    copy_number TEXT,
    issued_date DATE,
    current_holder INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    status TEXT,
    notes TEXT
);

CREATE TABLE sop_attachments (
    id SERIAL PRIMARY KEY,
    sop_id INTEGER REFERENCES sops(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    description TEXT
);

CREATE TABLE test_categories (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE tests (
    id SERIAL PRIMARY KEY,
    section_id INTEGER REFERENCES laboratory_sections(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES test_categories(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    result_authorization_level TEXT,
    competency_cycle TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE test_methods (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    method_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sample_types (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE specimen_requirements (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    sample_type_id INTEGER REFERENCES sample_types(id) ON DELETE SET NULL,
    volume TEXT,
    container TEXT,
    transport_conditions TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE turnaround_times (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    target_hours INTEGER,
    priority TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    external_patient_id TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    date_of_birth DATE,
    sex TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    national_id TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE patient_visits (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    visit_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    clinic_name TEXT,
    clinician_name TEXT,
    visit_reason TEXT,
    visit_type TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE requisitions (
    id SERIAL PRIMARY KEY,
    visit_id INTEGER REFERENCES patient_visits(id) ON DELETE CASCADE,
    requisition_number TEXT UNIQUE NOT NULL,
    ordering_provider TEXT,
    ordering_department TEXT,
    status TEXT,
    requested_date DATE,
    due_date DATE,
    clinical_history TEXT,
    comments TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE accession_numbers (
    id SERIAL PRIMARY KEY,
    requisition_id INTEGER REFERENCES requisitions(id) ON DELETE CASCADE,
    accession_number TEXT UNIQUE NOT NULL,
    assigned_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    specimen_count INTEGER DEFAULT 0,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE samples (
    id SERIAL PRIMARY KEY,
    accession_id INTEGER REFERENCES accession_numbers(id) ON DELETE CASCADE,
    sample_type_id INTEGER REFERENCES sample_types(id) ON DELETE SET NULL,
    collected_at TIMESTAMP WITHOUT TIME ZONE,
    received_at TIMESTAMP WITHOUT TIME ZONE,
    collected_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    received_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    volume TEXT,
    units TEXT,
    condition TEXT,
    status TEXT,
    storage_location TEXT,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE sample_barcodes (
    id SERIAL PRIMARY KEY,
    sample_id INTEGER REFERENCES samples(id) ON DELETE CASCADE UNIQUE,
    barcode TEXT UNIQUE NOT NULL,
    generated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    assigned_to INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    status TEXT,
    notes TEXT
);

CREATE TABLE sample_storage (
    id SERIAL PRIMARY KEY,
    sample_id INTEGER REFERENCES samples(id) ON DELETE CASCADE,
    storage_location TEXT NOT NULL,
    stored_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    temperature NUMERIC,
    expiry_date DATE,
    storage_notes TEXT
);

CREATE TABLE sample_disposal (
    id SERIAL PRIMARY KEY,
    sample_id INTEGER REFERENCES samples(id) ON DELETE CASCADE,
    disposed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    method TEXT,
    reason TEXT,
    disposed_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT
);

CREATE TABLE competency_programs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE competency_requirements (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES competency_programs(id) ON DELETE SET NULL,
    test_id INTEGER REFERENCES tests(id) ON DELETE SET NULL,
    sop_id INTEGER REFERENCES sops(id) ON DELETE SET NULL,
    requirement_text TEXT,
    cycle TEXT,
    authorization_level TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE competency_events (
    id SERIAL PRIMARY KEY,
    competency_requirement_id INTEGER REFERENCES competency_requirements(id) ON DELETE CASCADE,
    staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    event_date DATE,
    event_type TEXT,
    status TEXT,
    evaluator_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE competency_results (
    id SERIAL PRIMARY KEY,
    competency_event_id INTEGER REFERENCES competency_events(id) ON DELETE CASCADE,
    score NUMERIC,
    result TEXT,
    due_date DATE,
    valid_until DATE,
    remarks TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE competency_authorizations (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES tests(id) ON DELETE SET NULL,
    sop_id INTEGER REFERENCES sops(id) ON DELETE SET NULL,
    authorized_on DATE,
    expires_on DATE,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE equipment_categories (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    contact TEXT,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES equipment_categories(id) ON DELETE SET NULL,
    section_id INTEGER REFERENCES laboratory_sections(id) ON DELETE SET NULL,
    manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    model TEXT,
    serial_number TEXT UNIQUE,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    acquisition_date DATE,
    installation_date DATE,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE equipment_sections (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES laboratory_sections(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    UNIQUE(equipment_id, section_id)
);

CREATE TABLE equipment_maintenance (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    performed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    performed_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    maintenance_type TEXT,
    result TEXT,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE equipment_calibration (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    calibration_date DATE,
    calibrated_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    calibration_method TEXT,
    result TEXT,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE equipment_verification (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    verification_date DATE,
    verified_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    verification_method TEXT,
    result TEXT,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE equipment_service_history (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    service_date DATE,
    service_provider TEXT,
    service_description TEXT,
    cost NUMERIC,
    next_service_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE equipment_downtime (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITHOUT TIME ZONE,
    end_time TIMESTAMP WITHOUT TIME ZONE,
    reason TEXT,
    reported_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE reagents (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    description TEXT,
    unit TEXT,
    storage_conditions TEXT,
    shelf_life_days INTEGER,
    status TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE reagent_lots (
    id SERIAL PRIMARY KEY,
    reagent_id INTEGER REFERENCES reagents(id) ON DELETE CASCADE,
    lot_number TEXT NOT NULL,
    manufacture_date DATE,
    expiry_date DATE,
    quantity_received NUMERIC,
    quantity_available NUMERIC,
    received_date DATE,
    storage_location TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE supply_kits (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    description TEXT,
    status TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE kit_lots (
    id SERIAL PRIMARY KEY,
    supply_kit_id INTEGER REFERENCES supply_kits(id) ON DELETE CASCADE,
    lot_number TEXT NOT NULL,
    manufacture_date DATE,
    expiry_date DATE,
    quantity_received NUMERIC,
    quantity_available NUMERIC,
    received_date DATE,
    storage_location TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE consumables (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    unit TEXT,
    status TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    item_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    transaction_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    transaction_type TEXT,
    quantity NUMERIC,
    unit TEXT,
    source TEXT,
    destination TEXT,
    performed_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT
);

CREATE TABLE qc_materials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    manufacturer_id INTEGER REFERENCES manufacturers(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE qc_lots (
    id SERIAL PRIMARY KEY,
    qc_material_id INTEGER REFERENCES qc_materials(id) ON DELETE CASCADE,
    lot_number TEXT NOT NULL,
    manufacture_date DATE,
    expiry_date DATE,
    quantity NUMERIC,
    storage_location TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE qc_runs (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE SET NULL,
    run_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    performed_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    instrument_id INTEGER REFERENCES equipment(id) ON DELETE SET NULL,
    qc_lot_id INTEGER REFERENCES qc_lots(id) ON DELETE SET NULL,
    comments TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE qc_results (
    id SERIAL PRIMARY KEY,
    qc_run_id INTEGER REFERENCES qc_runs(id) ON DELETE CASCADE,
    analyte TEXT,
    target_value NUMERIC,
    mean_value NUMERIC,
    standard_deviation NUMERIC,
    result_value NUMERIC,
    status TEXT,
    out_of_control BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE westgard_rules (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE eqa_providers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT,
    website TEXT,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE eqa_events (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES eqa_providers(id) ON DELETE SET NULL,
    event_name TEXT,
    event_date DATE,
    sample_type TEXT,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE eqa_results (
    id SERIAL PRIMARY KEY,
    eqa_event_id INTEGER REFERENCES eqa_events(id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES tests(id) ON DELETE SET NULL,
    participant_result TEXT,
    consensus_result TEXT,
    score NUMERIC,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE cap_checklists (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    phase TEXT,
    standard_reference TEXT,
    description TEXT,
    laboratory_id INTEGER REFERENCES laboratories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE cap_requirements (
    id SERIAL PRIMARY KEY,
    checklist_id INTEGER REFERENCES cap_checklists(id) ON DELETE CASCADE,
    requirement_code TEXT NOT NULL,
    description TEXT,
    criteria TEXT,
    responsible_role TEXT,
    related_entities TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE cap_questions (
    id SERIAL PRIMARY KEY,
    requirement_id INTEGER REFERENCES cap_requirements(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    phase TEXT,
    section TEXT,
    question_type TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE cap_evidence (
    id SERIAL PRIMARY KEY,
    requirement_id INTEGER REFERENCES cap_requirements(id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES tests(id) ON DELETE SET NULL,
    sop_id INTEGER REFERENCES sops(id) ON DELETE SET NULL,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE SET NULL,
    evidence_type TEXT,
    evidence_date DATE,
    document_reference TEXT,
    description TEXT,
    status TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE cap_findings (
    id SERIAL PRIMARY KEY,
    requirement_id INTEGER REFERENCES cap_requirements(id) ON DELETE SET NULL,
    audit_id INTEGER,
    finding_type TEXT,
    description TEXT,
    severity TEXT,
    reported_date DATE,
    status TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE test_cap (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES cap_requirements(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE clia_requirements (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE,
    description TEXT,
    category TEXT,
    standard_reference TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE clia_mapping (
    id SERIAL PRIMARY KEY,
    clia_requirement_id INTEGER REFERENCES clia_requirements(id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES tests(id) ON DELETE SET NULL,
    sop_id INTEGER REFERENCES sops(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE iso_requirements (
    id SERIAL PRIMARY KEY,
    clause TEXT,
    description TEXT,
    standard_reference TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE iso_mapping (
    id SERIAL PRIMARY KEY,
    iso_requirement_id INTEGER REFERENCES iso_requirements(id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES tests(id) ON DELETE SET NULL,
    sop_id INTEGER REFERENCES sops(id) ON DELETE SET NULL,
    cap_requirement_id INTEGER REFERENCES cap_requirements(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE internal_audits (
    id SERIAL PRIMARY KEY,
    audit_date DATE,
    audited_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    section_id INTEGER REFERENCES laboratory_sections(id) ON DELETE SET NULL,
    audit_type TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE audit_findings (
    id SERIAL PRIMARY KEY,
    audit_id INTEGER REFERENCES internal_audits(id) ON DELETE CASCADE,
    standard_type TEXT,
    requirement_code TEXT,
    description TEXT,
    severity TEXT,
    status TEXT,
    assigned_to INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    due_date DATE,
    closed_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE capas (
    id SERIAL PRIMARY KEY,
    finding_id INTEGER REFERENCES audit_findings(id) ON DELETE CASCADE,
    title TEXT,
    corrective_action TEXT,
    preventive_action TEXT,
    assigned_to INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    due_date DATE,
    status TEXT,
    effectiveness_review_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    report_type TEXT,
    description TEXT,
    created_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE test_sops (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    sop_id INTEGER REFERENCES sops(id) ON DELETE CASCADE,
    relationship_type TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE test_equipment (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE test_reagents (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    reagent_id INTEGER REFERENCES reagents(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE test_competencies (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
    competency_requirement_id INTEGER REFERENCES competency_requirements(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
