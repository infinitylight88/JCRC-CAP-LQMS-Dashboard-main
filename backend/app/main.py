from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas, sop_import, section_mapping
from .database import engine, get_db, SessionLocal, ensure_schema_updates

models.Base.metadata.create_all(bind=engine)
ensure_schema_updates()
with SessionLocal() as db:
    section_mapping.seed_sections_and_sop_links(db)

app = FastAPI(title="LabQMS Backend")

@app.on_event("startup")
def import_sop_docs_on_startup():
    with SessionLocal() as db:
        result = sop_import.import_sop_docs(db)
        section_mapping.seed_sections_and_sop_links(db)
        if result["books"] or result["sops"]:
            print(f"Imported {result['books']} SOP book(s) and {result['sops']} SOP(s) from docs.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/sections", response_model=list[schemas.LaboratorySectionRead])
def read_sections(db: Session = Depends(get_db)):
    return crud.get_sections(db)


@app.get("/sections/{section_id}/sops", response_model=list[schemas.SOPRead])
def read_section_sops(section_id: int, db: Session = Depends(get_db)):
    sops = crud.get_section_sops(db, section_id)
    if sops is None:
        raise HTTPException(status_code=404, detail="Laboratory section not found")
    return sops

@app.get("/tests", response_model=list[schemas.TestRead])
def read_tests(db: Session = Depends(get_db)):
    return crud.get_tests(db)

@app.post("/competency-procedures", response_model=schemas.CompetencyProcedureRead)
def create_competency_procedure(procedure: schemas.CompetencyProcedureCreate, db: Session = Depends(get_db)):
    if not db.query(models.LaboratorySection).filter(models.LaboratorySection.id == procedure.section_id).first():
        raise HTTPException(status_code=404, detail="Laboratory section not found")
    sops = db.query(models.SOP).filter(models.SOP.id.in_(procedure.sop_ids)).all()
    if len(sops) != len(set(procedure.sop_ids)):
        raise HTTPException(status_code=404, detail="One or more selected SOPs were not found")
    equipment = db.query(models.Equipment).filter(models.Equipment.id.in_(procedure.equipment_ids)).all()
    if len(equipment) != len(set(procedure.equipment_ids)):
        raise HTTPException(status_code=404, detail="One or more selected equipment items were not found")
    return crud.create_competency_procedure(db, procedure)

@app.get("/competency-procedures", response_model=list[schemas.CompetencyProcedureRead])
def read_competency_procedures(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_competency_procedures(db, skip=skip, limit=limit)

@app.post("/staff", response_model=schemas.StaffRead)
def create_staff(staff: schemas.StaffCreate, db: Session = Depends(get_db)):
    if db.query(models.LaboratorySection).filter(models.LaboratorySection.id.in_(staff.section_ids)).count() != len(set(staff.section_ids)):
        raise HTTPException(status_code=404, detail="One or more selected sections were not found")
    if db.query(models.CompetencyProcedure).filter(
        models.CompetencyProcedure.id.in_(staff.competency_procedure_ids)
    ).count() != len(set(staff.competency_procedure_ids)):
        raise HTTPException(status_code=404, detail="One or more selected competencies were not found")
    return crud.create_staff(db, staff)

@app.get("/staff", response_model=list[schemas.StaffRead])
def read_staff(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_staff(db, skip=skip, limit=limit)

@app.post("/competency-records", response_model=schemas.CompetencyRecordRead)
def create_competency_record(record: schemas.CompetencyRecordCreate, db: Session = Depends(get_db)):
    staff = db.query(models.Staff).filter(models.Staff.id == record.staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    test = db.query(models.Test).filter(models.Test.id == record.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    linked_sops = db.query(models.SOP).filter(models.SOP.id.in_(record.sop_ids)).all()
    if len(linked_sops) != len(set(record.sop_ids)):
        raise HTTPException(status_code=404, detail="One or more selected SOPs were not found")
    previous = db.query(models.CompetencyRecord).filter(
        models.CompetencyRecord.staff_id == record.staff_id,
        models.CompetencyRecord.test_id == record.test_id,
    ).all()
    phases = {item.assessment_phase for item in previous}
    allowed = "Initial" if "Initial" not in phases else ("6-Mo" if "6-Mo" not in phases else "Annual")
    if record.assessment_phase != allowed:
        raise HTTPException(status_code=400, detail=f"The next permitted assessment for this staff member and procedure is {allowed}.")
    return crud.create_competency_record(db, record)

@app.get("/competency-records", response_model=list[schemas.CompetencyRecordRead])
def read_competency_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_competency_records(db, skip=skip, limit=limit)

@app.post("/patients", response_model=schemas.PatientRead)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    return crud.create_patient(db, patient)

@app.get("/patients", response_model=list[schemas.PatientRead])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_patients(db, skip=skip, limit=limit)

@app.post("/patient-visits", response_model=schemas.PatientVisitRead)
def create_patient_visit(visit: schemas.PatientVisitCreate, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == visit.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return crud.create_patient_visit(db, visit)

@app.get("/patient-visits", response_model=list[schemas.PatientVisitRead])
def read_patient_visits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_patient_visits(db, skip=skip, limit=limit)

@app.post("/requisitions", response_model=schemas.RequisitionRead)
def create_requisition(requisition: schemas.RequisitionCreate, db: Session = Depends(get_db)):
    visit = db.query(models.PatientVisit).filter(models.PatientVisit.id == requisition.visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Patient visit not found")
    return crud.create_requisition(db, requisition)

@app.get("/requisitions", response_model=list[schemas.RequisitionRead])
def read_requisitions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_requisitions(db, skip=skip, limit=limit)

@app.post("/accession-numbers", response_model=schemas.AccessionNumberRead)
def create_accession_number(accession: schemas.AccessionNumberCreate, db: Session = Depends(get_db)):
    requisition = db.query(models.Requisition).filter(models.Requisition.id == accession.requisition_id).first()
    if not requisition:
        raise HTTPException(status_code=404, detail="Requisition not found")
    return crud.create_accession_number(db, accession)

@app.get("/accession-numbers", response_model=list[schemas.AccessionNumberRead])
def read_accession_numbers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_accession_numbers(db, skip=skip, limit=limit)

@app.post("/samples", response_model=schemas.SampleRead)
def create_sample(sample: schemas.SampleCreate, db: Session = Depends(get_db)):
    accession = db.query(models.AccessionNumber).filter(models.AccessionNumber.id == sample.accession_id).first()
    if not accession:
        raise HTTPException(status_code=404, detail="Accession number not found")
    return crud.create_sample(db, sample)

@app.get("/samples", response_model=list[schemas.SampleRead])
def read_samples(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_samples(db, skip=skip, limit=limit)

@app.post("/sop-books", response_model=schemas.SOPBookRead)
def create_sop_book(book: schemas.SOPBookCreate, db: Session = Depends(get_db)):
    return crud.create_sop_book(db, book)

@app.get("/sop-books", response_model=list[schemas.SOPBookRead])
def read_sop_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sop_books(db, skip=skip, limit=limit)

@app.post("/sops", response_model=schemas.SOPRead)
def create_sop(sop: schemas.SOPCreate, db: Session = Depends(get_db)):
    return crud.create_sop(db, sop)

@app.get("/sops", response_model=list[schemas.SOPRead])
def read_sops(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    return crud.get_sops(db, skip=skip, limit=limit)

@app.post("/sop-import", response_model=dict)
def import_sop_docs_endpoint(db: Session = Depends(get_db)):
    result = sop_import.import_sop_docs(db)
    section_mapping.seed_sections_and_sop_links(db)
    return {"status": "imported", "books": result["books"], "sops": result["sops"]}

@app.post("/equipment", response_model=schemas.EquipmentRead)
def create_equipment(equipment: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    matching_sections = db.query(models.LaboratorySection).filter(
        models.LaboratorySection.id.in_(equipment.section_ids)
    ).count()
    if matching_sections != len(set(equipment.section_ids)):
        raise HTTPException(status_code=404, detail="One or more selected sections were not found")
    return crud.create_equipment(db, equipment)

@app.get("/equipment", response_model=list[schemas.EquipmentRead])
def read_equipment(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_equipment(db, skip=skip, limit=limit)
