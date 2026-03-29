"""
InvestWise API - Main Application Entry Point

An AI-powered investment education chatbot that makes investing
accessible to everyone through jargon-free explanations,
personalized goal tracking, and risk assessment.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import chat_router, goals_router, risk_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown."""
    # Startup
    print(f"🚀 Starting {settings.app_name}...")
    print(f"📊 AI Provider: {settings.ai_provider}")
    print(f"🔗 Supabase: {settings.supabase_url[:30]}...")
    yield
    # Shutdown
    print(f"👋 Shutting down {settings.app_name}...")


app = FastAPI(
    title="InvestWise API",
    description="""
    ## Making investing accessible to everyone 🎯
    
    InvestWise is an AI-powered chatbot that helps ordinary people 
    understand investing without the intimidating jargon.
    
    ### Features
    - 💬 **Chat**: Conversational AI that explains investing in plain English
    - 🎯 **Goals**: Track and manage your financial goals
    - ⚖️ **Risk Assessment**: Understand your investment risk tolerance
    
    ### Free Stack
    This API runs on a completely free stack:
    - Backend: Render free tier
    - Database: Supabase free tier
    - AI: Groq free tier (or local Ollama)
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router, prefix="/api/v1")
app.include_router(goals_router, prefix="/api/v1")
app.include_router(risk_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "message": "Welcome to InvestWise! Making investing less scary, one conversation at a time. 📈"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring."""
    return {
        "status": "healthy",
        "ai_provider": settings.ai_provider,
        "database": "connected"
    }


# For running directly with Python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
