from sqlalchemy.exc import IntegrityError

from backend.app import models
from backend.app.database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

sections = [
    {"code": "HEM", "name": "Hematology & Transfusion Medicine", "description": "Section 1"},
    {"code": "MOL1", "name": "Molecular Biology I — Drug Resistance", "description": "Section 2"},
    {"code": "MOL2", "name": "Molecular Biology II — Viral Quantitation", "description": "Section 3"},
    {"code": "IMM1", "name": "Immunology I", "description": "Section 4"},
    {"code": "IMM2", "name": "Immunology II — Flow Cytometry & Serology", "description": "Section 5"},
    {"code": "CHM", "name": "Clinical Chemistry", "description": "Section 6"},
    {"code": "MIC", "name": "Microbiology", "description": "Section 7"},
    {"code": "PSS", "name": "Specimen Processing & Biorepository", "description": "Section 8"},
    {"code": "MYCO", "name": "Mycobacteriology / TB BSL-3", "description": "Section 9"}
]

tests = [
    {"code": "HEM-001", "name": "CBC / DIFF", "description": "Sysmex XN-550", "section_code": "HEM", "competency_cycle": "Initial, 6-Mo, Annual", "result_authorization_level": "Tech / Section Head"},
    {"code": "CHM-001", "name": "Liver Function Panel", "description": "COBAS Integra, Abbott Architect", "section_code": "CHM", "competency_cycle": "Initial, 6-Mo, Annual", "result_authorization_level": "Tech / Section Head"},
    {"code": "MOL2-001", "name": "HIV RNA PCR (Viral Load)", "description": "COBAS / Abbott m2000", "section_code": "MOL2", "competency_cycle": "Initial, 6-Mo, Annual", "result_authorization_level": "Tech / Section Head"},
    {"code": "IMM2-001", "name": "CD4% / CD4 Absolute Count", "description": "FACSCalibur / Guava Muse", "section_code": "IMM2", "competency_cycle": "Initial, 6-Mo, Annual", "result_authorization_level": "Tech / Section Head"},
    {"code": "MYCO-001", "name": "Xpert MTB-RIF Ultra", "description": "GeneXpert System", "section_code": "MYCO", "competency_cycle": "Initial, 6-Mo, Annual", "result_authorization_level": "TB Tech / Section Head"}
]

with SessionLocal() as session:
    for section in sections:
        existing = session.query(models.LaboratorySection).filter_by(code=section["code"]).first()
        if not existing:
            session.add(models.LaboratorySection(**section))
    session.commit()

    sections_map = {section.code: section for section in session.query(models.LaboratorySection).all()}

    for test in tests:
        section = sections_map.get(test["section_code"])
        if not section:
            continue
        test_data = {
            "section_id": section.id,
            "code": test["code"],
            "name": test["name"],
            "description": test["description"],
            "competency_cycle": test["competency_cycle"],
            "result_authorization_level": test["result_authorization_level"],
            "active": True
        }
        existing_test = session.query(models.Test).filter_by(code=test["code"]).first()
        if not existing_test:
            session.add(models.Test(**test_data))
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        print("Some seed records already exist or violate constraints.")

print("Seed data loaded into LabQMS backend.")
