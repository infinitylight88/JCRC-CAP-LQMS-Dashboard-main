from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./labqms.db"

    class Config:
        env_file = ".env"
        env_prefix = "LABQMS_"

settings = Settings()
