from __future__ import annotations
from datetime import date, datetime
from typing import Optional
from pydantic import Field

from pydantic import BaseModel

# This file defines the API contracts between the frontend and backend.
# Each class describes what data is expected when a request is sent and what is returned to the browser.

class LaboratorySectionRead(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str]

    class Config:
        orm_mode = True

class TestRead(BaseModel):
    id: int
    section_id: Optional[int]
    code: str
    name: str
    description: Optional[str]
    result_authorization_level: Optional[str]
    competency_cycle: Optional[str]
    active: bool

    class Config:
        orm_mode = True

class StaffCreate(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    email: Optional[str]
    phone: Optional[str]
    status: Optional[str]
    section_ids: list[int] = Field(min_length=1)
    competency_procedure_ids: list[int] = []

class StaffRead(BaseModel):
    id: int
    employee_number: Optional[str]
    first_name: str
    middle_name: Optional[str]
    last_name: str
    email: Optional[str]
    phone: Optional[str]
    status: Optional[str]
    section_id: Optional[int]
    staff_sections: list['StaffSectionRead'] = []

    class Config:
        orm_mode = True

class CompetencyRecordCreate(BaseModel):
    staff_id: int
    test_id: int
    sop_ids: list[int] = Field(min_length=1)
    assessment_phase: str
    assessment_date: Optional[date]
    next_review_date: Optional[date]
    competency_status: Optional[str]
    notes: Optional[str]

class CompetencyRecordRead(BaseModel):
    id: int
    staff_id: int
    test_id: int
    sop_id: Optional[int]
    assessment_phase: str
    assessment_date: Optional[date]
    next_review_date: Optional[date]
    competency_status: Optional[str]
    notes: Optional[str]
    staff: Optional[StaffRead]
    test: Optional[TestRead]
    sop: Optional[SOPRead]
    sops: list[SOPRead]

    class Config:
        orm_mode = True

class StaffSectionRead(BaseModel):
    section: LaboratorySectionRead

    class Config:
        orm_mode = True

class CompetencyProcedureCreate(BaseModel):
    title: str
    section_id: int
    sop_ids: list[int] = Field(min_length=1)
    equipment_ids: list[int] = []

class CompetencyProcedureRead(BaseModel):
    id: int
    code: str
    title: str
    section_id: int
    test_id: int
    active: bool
    section: Optional[LaboratorySectionRead]
    sops: list['SOPRead'] = []
    equipment: list['EquipmentRead'] = []

    class Config:
        orm_mode = True

class PatientCreate(BaseModel):
    external_patient_id: Optional[str]
    first_name: str
    last_name: str
    middle_name: Optional[str]
    date_of_birth: Optional[date]
    sex: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    national_id: Optional[str]

class PatientRead(BaseModel):
    id: int
    external_patient_id: Optional[str]
    first_name: str
    last_name: str
    middle_name: Optional[str]
    date_of_birth: Optional[date]
    sex: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    national_id: Optional[str]

    class Config:
        orm_mode = True

class PatientVisitCreate(BaseModel):
    patient_id: int
    visit_date: Optional[datetime]
    clinic_name: Optional[str]
    clinician_name: Optional[str]
    visit_reason: Optional[str]
    visit_type: Optional[str]
    notes: Optional[str]

class PatientVisitRead(BaseModel):
    id: int
    patient_id: int
    visit_date: Optional[datetime]
    clinic_name: Optional[str]
    clinician_name: Optional[str]
    visit_reason: Optional[str]
    visit_type: Optional[str]
    notes: Optional[str]
    patient: Optional[PatientRead]

    class Config:
        orm_mode = True

class RequisitionCreate(BaseModel):
    visit_id: int
    requisition_number: str
    ordering_provider: Optional[str]
    ordering_department: Optional[str]
    status: Optional[str]
    requested_date: Optional[date]
    due_date: Optional[date]
    clinical_history: Optional[str]
    comments: Optional[str]

class RequisitionRead(BaseModel):
    id: int
    visit_id: int
    requisition_number: str
    ordering_provider: Optional[str]
    ordering_department: Optional[str]
    status: Optional[str]
    requested_date: Optional[date]
    due_date: Optional[date]
    clinical_history: Optional[str]
    comments: Optional[str]

    class Config:
        orm_mode = True

class AccessionNumberCreate(BaseModel):
    requisition_id: int
    accession_number: str
    assigned_date: Optional[datetime]
    specimen_count: Optional[int]
    status: Optional[str]
    notes: Optional[str]

class AccessionNumberRead(BaseModel):
    id: int
    requisition_id: int
    accession_number: str
    assigned_date: Optional[datetime]
    specimen_count: Optional[int]
    status: Optional[str]
    notes: Optional[str]

    class Config:
        orm_mode = True

class SampleCreate(BaseModel):
    accession_id: int
    sample_type: Optional[str]
    collected_at: Optional[datetime]
    received_at: Optional[datetime]
    collected_by: Optional[int]
    received_by: Optional[int]
    volume: Optional[str]
    units: Optional[str]
    condition: Optional[str]
    status: Optional[str]
    storage_location: Optional[str]
    rejection_reason: Optional[str]
    notes: Optional[str]

class SampleRead(BaseModel):
    id: int
    accession_id: int
    sample_type: Optional[str]
    collected_at: Optional[datetime]
    received_at: Optional[datetime]
    collected_by: Optional[int]
    received_by: Optional[int]
    volume: Optional[str]
    units: Optional[str]
    condition: Optional[str]
    status: Optional[str]
    storage_location: Optional[str]
    rejection_reason: Optional[str]
    notes: Optional[str]

    class Config:
        orm_mode = True

class SOPBookCreate(BaseModel):
    code: str
    name: str
    description: Optional[str]
    book_number: Optional[int]

class SOPBookRead(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str]
    book_number: Optional[int]

    class Config:
        orm_mode = True

class SOPCreate(BaseModel):
    book_id: Optional[int]
    index_code: str
    title: str
    version: Optional[str]
    effective_date: Optional[date]
    next_review_date: Optional[date]
    scope_distribution: Optional[str]
    status: Optional[str]
    description: Optional[str]

class SOPRead(BaseModel):
    id: int
    book_id: Optional[int]
    index_code: str
    title: str
    version: Optional[str]
    effective_date: Optional[date]
    next_review_date: Optional[date]
    scope_distribution: Optional[str]
    status: Optional[str]
    description: Optional[str]
    book: Optional[SOPBookRead]

    class Config:
        orm_mode = True

class LaboratorySectionWithSOPsRead(LaboratorySectionRead):
    sops: list[SOPRead]

class EquipmentCreate(BaseModel):
    name: str
    section_ids: list[int] = Field(min_length=1)

class EquipmentRead(BaseModel):
    id: int
    code: str
    name: str
    equipment_sections: list['EquipmentSectionRead'] = []

    class Config:
        orm_mode = True

class EquipmentSectionRead(BaseModel):
    section: LaboratorySectionRead

    class Config:
        orm_mode = True
