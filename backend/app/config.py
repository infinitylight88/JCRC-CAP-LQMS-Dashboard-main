from pathlib import Path
import os

# Minimal configuration loader without external dependencies.
# Reads `LABQMS_database_url` or `LABQMS_DATABASE_URL` from the environment,
# otherwise falls back to a local SQLite file `labqms.db` next to the backend folder.

# The backend folder is the directory that contains this file.
BACKEND_DIRECTORY = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_PATH = BACKEND_DIRECTORY.parent / "labqms.db"


class Settings:
    def __init__(self):
        # Allow multiple environment variable spellings for portability.
        env_keys = [
            'LABQMS_database_url', 'LABQMS_DATABASE_URL',
            'DATABASE_URL', 'database_url'
        ]
        value = None
        for key in env_keys:
            value = os.getenv(key)
            if value:
                break
        if not value:
            value = f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}"
        self.database_url = value


# Single, shared settings instance used by the app.
settings = Settings()

# Normalize relative sqlite paths to absolute paths based on the backend folder.
if settings.database_url.startswith("sqlite:///"):
    configured_path = Path(settings.database_url.replace("sqlite:///", ""))
    if not configured_path.is_absolute():
        settings.database_url = f"sqlite:///{(BACKEND_DIRECTORY / configured_path).resolve().as_posix()}"
