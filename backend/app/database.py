from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

engine = create_engine(settings.database_url, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, future=True)
Base = declarative_base()


def ensure_schema_updates():
    """Apply the small additive schema updates needed by existing SQLite files."""
    inspector = inspect(engine)
    if "staff" in inspector.get_table_names():
        staff_columns = {column["name"] for column in inspector.get_columns("staff")}
        if "section_id" not in staff_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE staff ADD COLUMN section_id INTEGER"))
        if "middle_name" not in staff_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE staff ADD COLUMN middle_name VARCHAR"))

    if "competency_procedures" in inspector.get_table_names():
        procedure_columns = {column["name"] for column in inspector.get_columns("competency_procedures")}
        if "test_id" not in procedure_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE competency_procedures ADD COLUMN test_id INTEGER"))

    # Preserve legacy single-SOP competency records in the new multi-SOP link table.
    if {"competency_records", "competency_record_sops"}.issubset(inspector.get_table_names()):
        with engine.begin() as connection:
            connection.execute(text("""
                INSERT OR IGNORE INTO competency_record_sops (competency_record_id, sop_id)
                SELECT id, sop_id FROM competency_records WHERE sop_id IS NOT NULL
            """))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
