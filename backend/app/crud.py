from datetime import date
from sqlalchemy.orm import Session
import uuid

from . import models, schemas


def generate_equipment_code():
    """Generate a unique equipment code using UUID."""
    return f"EQP-{uuid.uuid4().hex[:8].upper()}"


def generate_staff_code():
    return f"STF-{uuid.uuid4().hex[:8].upper()}"


def generate_competency_code():
    return f"CMP-{uuid.uuid4().hex[:8].upper()}"


def get_sections(db: Session):
    return db.query(models.LaboratorySection).order_by(models.LaboratorySection.code).all()


def get_section_sops(db: Session, section_id: int):
    section = db.query(models.LaboratorySection).filter(models.LaboratorySection.id == section_id).first()
    return section.sops if section else None


def get_tests(db: Session):
    return db.query(models.Test).order_by(models.Test.code).all()


def create_staff(db: Session, staff: schemas.StaffCreate):
    data = staff.dict(exclude={"section_ids", "competency_procedure_ids"})
    db_staff = models.Staff(**data, employee_number=generate_staff_code(), section_id=staff.section_ids[0])
    db.add(db_staff)
    db.flush()
    for section_id in set(staff.section_ids):
        db.add(models.StaffSection(staff_id=db_staff.id, section_id=section_id))
    procedures = db.query(models.CompetencyProcedure).filter(
        models.CompetencyProcedure.id.in_(staff.competency_procedure_ids)
    ).all()
    for procedure in procedures:
        db_record = models.CompetencyRecord(
            staff_id=db_staff.id,
            test_id=procedure.test_id,
            assessment_phase="Initial",
            assessment_date=date.today(),
            competency_status="Competent",
        )
        db_record.sops = procedure.sops
        db.add(db_record)
    db.commit()
    db.refresh(db_staff)
    return db_staff


def get_staff(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Staff).order_by(models.Staff.employee_number).offset(skip).limit(limit).all()


def create_competency_procedure(db: Session, procedure: schemas.CompetencyProcedureCreate):
    code = generate_competency_code()
    test = models.Test(code=code, name=procedure.title, section_id=procedure.section_id, active=True)
    db.add(test)
    db.flush()
    db_procedure = models.CompetencyProcedure(
        code=code, title=procedure.title, section_id=procedure.section_id, test_id=test.id
    )
    db_procedure.sops = db.query(models.SOP).filter(models.SOP.id.in_(procedure.sop_ids)).all()
    db_procedure.equipment = db.query(models.Equipment).filter(models.Equipment.id.in_(procedure.equipment_ids)).all()
    db.add(db_procedure)
    db.commit()
    db.refresh(db_procedure)
    return db_procedure


def get_competency_procedures(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CompetencyProcedure).order_by(models.CompetencyProcedure.code).offset(skip).limit(limit).all()


def create_competency_record(db: Session, record: schemas.CompetencyRecordCreate):
    record_data = record.dict(exclude={"sop_ids"})
    db_record = models.CompetencyRecord(**record_data)
    db_record.sops = db.query(models.SOP).filter(models.SOP.id.in_(record.sop_ids)).all()
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_competency_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CompetencyRecord).order_by(models.CompetencyRecord.assessment_date.desc()).offset(skip).limit(limit).all()


def create_patient(db: Session, patient: schemas.PatientCreate):
    db_patient = models.Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patient).offset(skip).limit(limit).all()


def create_patient_visit(db: Session, visit: schemas.PatientVisitCreate):
    db_visit = models.PatientVisit(**visit.dict())
    db.add(db_visit)
    db.commit()
    db.refresh(db_visit)
    return db_visit


def get_patient_visits(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.PatientVisit).offset(skip).limit(limit).all()


def create_requisition(db: Session, requisition: schemas.RequisitionCreate):
    db_requisition = models.Requisition(**requisition.dict())
    db.add(db_requisition)
    db.commit()
    db.refresh(db_requisition)
    return db_requisition


def get_requisitions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Requisition).offset(skip).limit(limit).all()


def create_accession_number(db: Session, accession: schemas.AccessionNumberCreate):
    db_accession = models.AccessionNumber(**accession.dict())
    db.add(db_accession)
    db.commit()
    db.refresh(db_accession)
    return db_accession


def get_accession_numbers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AccessionNumber).offset(skip).limit(limit).all()


def create_sample(db: Session, sample: schemas.SampleCreate):
    db_sample = models.Sample(**sample.dict())
    db.add(db_sample)
    db.commit()
    db.refresh(db_sample)
    return db_sample


def get_samples(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Sample).offset(skip).limit(limit).all()


def create_sop_book(db: Session, book: schemas.SOPBookCreate):
    db_book = models.SOPBook(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def get_sop_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SOPBook).offset(skip).limit(limit).all()


def create_sop(db: Session, sop: schemas.SOPCreate):
    db_sop = models.SOP(**sop.dict())
    db.add(db_sop)
    db.commit()
    db.refresh(db_sop)
    return db_sop


def get_sops(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SOP).offset(skip).limit(limit).all()


def create_equipment(db: Session, equipment: schemas.EquipmentCreate):
    db_equipment = models.Equipment(
        name=equipment.name,
        code=generate_equipment_code()
    )
    db.add(db_equipment)
    db.flush()  # Flush to get the ID without committing
    
    # Add sections
    for section_id in set(equipment.section_ids):
        equipment_section = models.EquipmentSection(
            equipment_id=db_equipment.id,
            section_id=section_id
        )
        db.add(equipment_section)
    
    db.commit()
    db.refresh(db_equipment)
    return db_equipment


def get_equipment(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Equipment).order_by(models.Equipment.name).offset(skip).limit(limit).all()
