import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///spec2mcp.db")
    secret_key: str = os.getenv("SPEC2MCP_SECRET_KEY", "dev-key-change-in-prod")
    data_dir: Path = Path.home() / ".spec2mcp"

    model_config = {"env_prefix": "SPEC2MCP_"}


settings = Settings()


def ensure_dirs():
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    for d in ["projects", "artifacts", "servers"]:
        (settings.data_dir / d).mkdir(exist_ok=True)
