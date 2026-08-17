from sqlalchemy import Column, Integer, String, Date, Text, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship

from .database import Base

class Laboratory(Base):
    __tablename__ = "laboratories"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)

    sections = relationship("LaboratorySection", back_populates="laboratory")

class LaboratorySection(Base):
    __tablename__ = "laboratory_sections"

    id = Column(Integer, primary_key=True, index=True)
    laboratory_id = Column(Integer, ForeignKey("laboratories.id"), nullable=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)

    laboratory = relationship("Laboratory", back_populates="sections")
    sops = relationship("SOP", secondary="sop_section_links", back_populates="sections")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    external_patient_id = Column(String, unique=True, nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    middle_name = Column(String)
    date_of_birth = Column(Date)
    sex = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(Text)
    national_id = Column(String)

    visits = relationship("PatientVisit", back_populates="patient")

class PatientVisit(Base):
    __tablename__ = "patient_visits"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    visit_date = Column(TIMESTAMP)
    clinic_name = Column(String)
    clinician_name = Column(String)
    visit_reason = Column(Text)
    visit_type = Column(String)
    notes = Column(Text)

    patient = relationship("Patient", back_populates="visits")
    requisitions = relationship("Requisition", back_populates="visit")

class TestCategory(Base):
    __tablename__ = "test_categories"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
    name = Column(String, nullable=False)
    description = Column(Text)

class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("laboratory_sections.id"), nullable=True)
    category_id = Column(Integer, ForeignKey("test_categories.id"), nullable=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    result_authorization_level = Column(String)
    competency_cycle = Column(String)
    active = Column(Boolean, default=True)

    section = relationship("LaboratorySection")
    category = relationship("TestCategory")

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    employee_number = Column(String, unique=True)
    first_name = Column(String, nullable=False)
    middle_name = Column(String)
    last_name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    status = Column(String, default='active')

    section_id = Column(Integer, ForeignKey("laboratory_sections.id"), nullable=True)  # legacy primary section
    section = relationship("LaboratorySection")
    staff_sections = relationship("StaffSection", back_populates="staff", cascade="all, delete-orphan")

    competencies = relationship("CompetencyRecord", back_populates="staff")

class CompetencyRecord(Base):
    __tablename__ = "competency_records"

    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    sop_id = Column(Integer, ForeignKey("sops.id"), nullable=True)
    assessment_phase = Column(String, nullable=False)
    assessment_date = Column(Date)
    next_review_date = Column(Date)
    competency_status = Column(String, default='Competent')
    notes = Column(Text)

    staff = relationship("Staff", back_populates="competencies")
    test = relationship("Test")
    sop = relationship("SOP")
    sops = relationship("SOP", secondary="competency_record_sops", back_populates="competency_records")


class StaffSection(Base):
    __tablename__ = "staff_sections"

    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=False)
    section_id = Column(Integer, ForeignKey("laboratory_sections.id"), nullable=False)

    staff = relationship("Staff", back_populates="staff_sections")
    section = relationship("LaboratorySection")


class CompetencyProcedure(Base):
    __tablename__ = "competency_procedures"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    section_id = Column(Integer, ForeignKey("laboratory_sections.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    active = Column(Boolean, default=True)

    section = relationship("LaboratorySection")
    test = relationship("Test")
    sops = relationship("SOP", secondary="competency_procedure_sops")
    equipment = relationship("Equipment", secondary="competency_procedure_equipment")


class CompetencyProcedureSOP(Base):
    __tablename__ = "competency_procedure_sops"

    competency_procedure_id = Column(Integer, ForeignKey("competency_procedures.id"), primary_key=True)
    sop_id = Column(Integer, ForeignKey("sops.id"), primary_key=True)


class CompetencyProcedureEquipment(Base):
    __tablename__ = "competency_procedure_equipment"

    competency_procedure_id = Column(Integer, ForeignKey("competency_procedures.id"), primary_key=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), primary_key=True)


class CompetencyRecordSOP(Base):
    __tablename__ = "competency_record_sops"

    competency_record_id = Column(Integer, ForeignKey("competency_records.id"), primary_key=True)
    sop_id = Column(Integer, ForeignKey("sops.id"), primary_key=True)

class Requisition(Base):
    __tablename__ = "requisitions"

    id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(Integer, ForeignKey("patient_visits.id"), nullable=False)
    requisition_number = Column(String, unique=True, nullable=False)
    ordering_provider = Column(String)
    ordering_department = Column(String)
    status = Column(String)
    requested_date = Column(Date)
    due_date = Column(Date)
    clinical_history = Column(Text)
    comments = Column(Text)

    visit = relationship("PatientVisit", back_populates="requisitions")
    accessions = relationship("AccessionNumber", back_populates="requisition")

class AccessionNumber(Base):
    __tablename__ = "accession_numbers"

    id = Column(Integer, primary_key=True, index=True)
    requisition_id = Column(Integer, ForeignKey("requisitions.id"), nullable=False)
    accession_number = Column(String, unique=True, nullable=False)
    assigned_date = Column(TIMESTAMP)
    specimen_count = Column(Integer, default=0)
    status = Column(String)
    notes = Column(Text)

    requisition = relationship("Requisition", back_populates="accessions")
    samples = relationship("Sample", back_populates="accession")

class Sample(Base):
    __tablename__ = "samples"

    id = Column(Integer, primary_key=True, index=True)
    accession_id = Column(Integer, ForeignKey("accession_numbers.id"), nullable=False)
    sample_type = Column(String)
    collected_at = Column(TIMESTAMP)
    received_at = Column(TIMESTAMP)
    collected_by = Column(Integer, ForeignKey("staff.id"), nullable=True)
    received_by = Column(Integer, ForeignKey("staff.id"), nullable=True)
    volume = Column(String)
    units = Column(String)
    condition = Column(String)
    status = Column(String)
    storage_location = Column(String)
    rejection_reason = Column(Text)
    notes = Column(Text)

    accession = relationship("AccessionNumber", back_populates="samples")

class SOPBook(Base):
    __tablename__ = "sop_books"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    book_number = Column(Integer)

    sops = relationship("SOP", back_populates="book")

class SOP(Base):
    __tablename__ = "sops"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("sop_books.id"), nullable=True)
    index_code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    version = Column(String)
    effective_date = Column(Date)
    next_review_date = Column(Date)
    scope_distribution = Column(String)
    status = Column(String, default='active')
    description = Column(Text)

    book = relationship("SOPBook", back_populates="sops")
    sections = relationship("LaboratorySection", secondary="sop_section_links", back_populates="sops")
    competency_records = relationship("CompetencyRecord", secondary="competency_record_sops", back_populates="sops")


class SOPSectionLink(Base):
    __tablename__ = "sop_section_links"

    sop_id = Column(Integer, ForeignKey("sops.id"), primary_key=True)
    section_id = Column(Integer, ForeignKey("laboratory_sections.id"), primary_key=True)

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)

class EquipmentCategory(Base):
    __tablename__ = "equipment_categories"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
    name = Column(String, nullable=False)
    description = Column(Text)

class Manufacturer(Base):
    __tablename__ = "manufacturers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    website = Column(String)
    contact = Column(String)
    description = Column(Text)

    equipment = relationship("Equipment", back_populates="manufacturer")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact = Column(String)
    address = Column(String)
    phone = Column(String)
    email = Column(String)

    equipment = relationship("Equipment", back_populates="supplier")

class EquipmentSection(Base):
    __tablename__ = "equipment_sections"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    section_id = Column(Integer, ForeignKey("laboratory_sections.id"), nullable=False)
    
    section = relationship("LaboratorySection")
    equipment = relationship("Equipment", back_populates="equipment_sections")

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("equipment_categories.id"), nullable=True)
    section_id = Column(Integer, ForeignKey("laboratory_sections.id"), nullable=True)
    manufacturer_id = Column(Integer, ForeignKey("manufacturers.id"), nullable=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    model = Column(String)
    serial_number = Column(String, unique=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    acquisition_date = Column(Date)
    installation_date = Column(Date)
    status = Column(String)
    notes = Column(Text)

    manufacturer = relationship("Manufacturer", back_populates="equipment")
    supplier = relationship("Supplier", back_populates="equipment")
    category = relationship("EquipmentCategory")
    section = relationship("LaboratorySection", foreign_keys=[section_id])
    equipment_sections = relationship("EquipmentSection", back_populates="equipment", cascade="all, delete-orphan")
    location = relationship("Location")
