from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator
from typing import List
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    app_name: str = os.getenv("APP_NAME", "kos-vitae")
    environment: str = os.getenv("ENV", "dev")

    db_host: str | None = os.getenv("DB_HOST")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_user: str | None = os.getenv("DB_USER")
    db_password: str | None = os.getenv("DB_PASSWORD")
    db_name: str | None = os.getenv("DB_NAME")

    jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret")
    jwt_expires_min: int = int(os.getenv("JWT_EXPIRES_MIN", "15"))
    refresh_expires_days: int = int(os.getenv("REFRESH_EXPIRES_DAYS", "7"))

    s3_endpoint: str | None = os.getenv("S3_ENDPOINT")
    s3_bucket: str | None = os.getenv("S3_BUCKET")
    s3_access_key: str | None = os.getenv("S3_ACCESS_KEY")
    s3_secret_key: str | None = os.getenv("S3_SECRET_KEY")

    cors_origins: List[str] = ["*"]

    @property
    def database_url(self) -> str:
        # async psycopg driver for SQLAlchemy 2.0
        if self.db_host and self.db_user and self.db_password and self.db_name:
            return f"postgresql+psycopg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
        # fallback to legacy var if present (dev only)
        return os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/postgres")

    @field_validator('cors_origins', mode='before')
    @classmethod
    def split_cors(cls, v):
        if isinstance(v, str):
            return [x.strip() for x in v.split(',') if x.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
