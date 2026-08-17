"""Seed laboratory sections and link SOPs to the sections they govern."""

from sqlalchemy.orm import Session

from . import models


SECTION_DEFINITIONS = (
    ("PHLEB", "Phlebotomy"),
    ("PROC", "Processing"),
    ("STOR", "Storage"),
    ("MICRO", "Microbiology"),
    ("HEM", "Hematology"),
    ("CHEM", "Chemistry"),
    ("IMM2", "Immunology 2"),
    ("IMM1", "Immunology 1"),
    ("VIRO", "Virology"),
    ("MYCO", "Mycobacteriology"),
    ("MOLBIO", "Molecular Biology"),
)

BOOK_SECTION_CODES = {
    "MYCO": ("MYCO",),
    "MOLBIO": ("MOLBIO",),
    "PROC-STOR": ("PHLEB", "PROC", "STOR"),
    "MICRO": ("MICRO",),
    "HEMAT": ("HEM",),
    "CHEM": ("CHEM",),
    "IMMUN-2": ("IMM2",),
    "IMMUN-1": ("IMM1",),
    "VIROL": ("VIRO",),
}

ALL_SECTION_CODES = tuple(code for code, _ in SECTION_DEFINITIONS)


def _scope_section_codes(scope: str | None) -> set[str]:
    text = (scope or "").lower().replace("_", " ")
    if any(marker in text for marker in ("all 13 sections", "each of the 13 sections", "each of the 9 sections", "each of the 8 labs", "each lab", "all sections")):
        return set(ALL_SECTION_CODES)

    matches: set[str] = set()
    aliases = {
        "PHLEB": ("phlebotomy",),
        "PROC": ("processing",),
        "STOR": ("storage",),
        "MICRO": ("microbiology", "microb"),
        "HEM": ("hematology", "hematolgoy"),
        "CHEM": ("chemistry",),
        "IMM2": ("immunology 2", "immunology2", "immun2", "immuno 2"),
        "IMM1": ("immunology 1", "immunology1", "immuno 1"),
        "VIRO": ("virology",),
        "MYCO": ("mycobacteriology", "mycobacterialogy", "tb lab", " tb", "t.b."),
        "MOLBIO": ("molecular biology", " mol"),
    }
    for code, terms in aliases.items():
        if any(term in text for term in terms):
            matches.add(code)
    return matches


def seed_sections_and_sop_links(db: Session) -> None:
    """Create the approved sections and add missing SOP links idempotently."""
    for code, name in SECTION_DEFINITIONS:
        if not db.query(models.LaboratorySection).filter_by(code=code).first():
            db.add(models.LaboratorySection(code=code, name=name))
    db.flush()

    sections_by_code = {section.code: section for section in db.query(models.LaboratorySection).all()}
    for sop in db.query(models.SOP).all():
        section_codes = _scope_section_codes(sop.scope_distribution)
        if not section_codes and sop.book:
            section_codes = set(BOOK_SECTION_CODES.get(sop.book.code, ()))

        existing_codes = {section.code for section in sop.sections}
        for code in section_codes - existing_codes:
            section = sections_by_code.get(code)
            if section:
                sop.sections.append(section)
    db.commit()
