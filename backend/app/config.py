from pydantic_settings import BaseSettings
from pathlib import Path

# This file controls the application's environment and database settings.
# It is read before the app starts so the backend knows where to save data.

# The backend folder is the directory that contains this file.
BACKEND_DIRECTORY = Path(__file__).resolve().parents[1]

# Default database location is a local SQLite file stored in the project root.
DEFAULT_DATABASE_PATH = BACKEND_DIRECTORY.parent / "labqms.db"

# Settings is the central configuration object used by the backend.
# It reads values from environment variables or a .env file.
class Settings(BaseSettings):
    # Default database URL is SQLite unless a user overrides it in the environment.
    database_url: str = f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}"

    class Config:
        # The .env file is expected inside the backend folder.
        env_file = BACKEND_DIRECTORY / ".env"
        env_prefix = "LABQMS_"

# Create the config object once and reuse it when the app initializes.
settings = Settings()

# If a relative SQLite path is configured, convert it to an absolute path based on the backend folder.
# This prevents confusion when the app is started from another working directory.
if settings.database_url.startswith("sqlite:///"):
    configured_path = Path(settings.database_url.removeprefix("sqlite:///"))
    if not configured_path.is_absolute():
        settings.database_url = f"sqlite:///{(BACKEND_DIRECTORY / configured_path).resolve().as_posix()}"
