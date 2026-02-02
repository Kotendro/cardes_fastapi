from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class DatabaseSettings(BaseModel):
    pg_user: str
    pg_password: str
    pg_db: str
    pg_host: str

    @property
    def pg_dst(self) -> str:
        return (
            f"postgresql+asyncpg://{self.pg_user}:"
            f"{self.pg_password}@"
            f"{self.pg_host}:"
            f"5432/"
            f"{self.pg_db}"
        )

class PathSettings(BaseModel):    
    image: Path
    

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_nested_delimiter="__"
    )
    
    db: DatabaseSettings
    paths: PathSettings

settings = Settings()