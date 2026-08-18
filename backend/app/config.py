from pydantic_settings import BaseSettings
from pathlib import Path


BACKEND_DIRECTORY = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_PATH = BACKEND_DIRECTORY.parent / "labqms.db"

class Settings(BaseSettings):
    database_url: str = f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}"

    class Config:
        env_file = BACKEND_DIRECTORY / ".env"
        env_prefix = "LABQMS_"

settings = Settings()

# Interpret relative SQLite paths from backend/.env relative to the backend
# directory, never from the directory used to launch Uvicorn.
if settings.database_url.startswith("sqlite:///"):
    configured_path = Path(settings.database_url.removeprefix("sqlite:///"))
    if not configured_path.is_absolute():
        settings.database_url = f"sqlite:///{(BACKEND_DIRECTORY / configured_path).resolve().as_posix()}"
