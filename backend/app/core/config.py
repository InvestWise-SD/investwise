"""
Application configuration using Pydantic settings.
Loads from environment variables or .env file.
"""

from functools import lru_cache
from typing import Literal
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment."""
    
    # App
    app_name: str = "InvestWise"
    debug: bool = False
    secret_key: str
    cors_origins: str = "http://localhost:3000"
    
    # Supabase
    supabase_url: str
    supabase_key: str
    supabase_service_key: str | None = None
    
    # AI Provider
    ai_provider: Literal["groq", "anthropic", "ollama"] = "groq"
    
    # Groq (free tier recommended)
    groq_api_key: str | None = None
    groq_model: str = "llama-3.1-70b-versatile"
    
    # Anthropic
    anthropic_api_key: str | None = None
    anthropic_model: str = "claude-3-haiku-20240307"
    
    # Ollama (local, free)
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1"
    
    @property
    def cors_origin_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
