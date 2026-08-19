from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# This file is the connection center for the database.
# It creates the SQLAlchemy engine and gives each request a database session.

# Engine is used to talk to the database.
engine = create_engine(settings.database_url, future=True)

# SessionLocal creates a new SQLAlchemy session whenever the app needs database access.
SessionLocal = sessionmaker(bind=engine, autoflush=False, future=True)

# Base is the parent class for all ORM models.
Base = declarative_base()


def ensure_schema_updates():
    """Apply small additive schema updates for older SQLite database files."""
    # This is essentially a lightweight migration helper.
    # It checks the live database structure and adds columns if they are missing.
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

        if "equipment" in inspector.get_table_names():
            equipment_columns = {column["name"] for column in inspector.get_columns("equipment")}
            with engine.begin() as connection:
                if "service_date" not in equipment_columns:
                    connection.execute(text("ALTER TABLE equipment ADD COLUMN service_date DATE"))
                if "next_service_date" not in equipment_columns:
                    connection.execute(text("ALTER TABLE equipment ADD COLUMN next_service_date DATE"))

    # Older data may have stored a single SOP on a competency record.
    # The new schema uses a many-to-many table, so this migration copies old values into the new table.
    if {"competency_records", "competency_record_sops"}.issubset(inspector.get_table_names()):
        with engine.begin() as connection:
            connection.execute(text("""
                INSERT OR IGNORE INTO competency_record_sops (competency_record_id, sop_id)
                SELECT id, sop_id FROM competency_records WHERE sop_id IS NOT NULL
            """))


def get_db():
    """Return a database session for each API request and close it afterward."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
