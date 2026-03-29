"""
AI Service supporting multiple providers: Groq (free), Anthropic, Ollama.
"""

from abc import ABC, abstractmethod
from typing import Optional
import httpx

from app.core.config import get_settings

settings = get_settings()


# System prompt for the investment education chatbot
SYSTEM_PROMPT = """You are InvestWise, a friendly AI assistant that helps everyday people understand investing.

Your core mission: Make investing feel accessible, not intimidating.

Key principles:
1. NEVER use jargon without explaining it first
2. Use relatable analogies (investing is like...)
3. Personalize advice based on user's goals and risk profile
4. Be encouraging but honest about risks
5. If you don't know something, say so

When explaining concepts:
- Start with "In simple terms..."
- Use everyday examples (groceries, sports, relationships)
- Break complex topics into bite-sized pieces
- End with "Does that make sense?" or similar

Remember:
- You're talking to someone who might be scared of investing
- Your job is to educate, not to give specific investment advice
- Always remind users to consult a financial advisor for personal decisions
- Celebrate their curiosity and progress

Tone: Warm, patient, like a knowledgeable friend who happens to understand finance."""


class AIProvider(ABC):
    """Abstract base class for AI providers."""
    
    @abstractmethod
    async def generate_response(
        self, 
        message: str, 
        history: list[dict],
        context: Optional[str] = None
    ) -> str:
        """Generate a response from the AI."""
        pass


class GroqProvider(AIProvider):
    """Groq provider - recommended for free tier."""
    
    def __init__(self):
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
        self.base_url = "https://api.groq.com/openai/v1"
    
    async def generate_response(
        self, 
        message: str, 
        history: list[dict],
        context: Optional[str] = None
    ) -> str:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        if context:
            messages.append({
                "role": "system", 
                "content": f"User context: {context}"
            })
        
        # Add conversation history
        for msg in history[-10:]:  # Last 10 messages
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "max_tokens": 1024,
                    "temperature": 0.7
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]


class AnthropicProvider(AIProvider):
    """Anthropic Claude provider."""
    
    def __init__(self):
        self.api_key = settings.anthropic_api_key
        self.model = settings.anthropic_model
        self.base_url = "https://api.anthropic.com/v1"
    
    async def generate_response(
        self, 
        message: str, 
        history: list[dict],
        context: Optional[str] = None
    ) -> str:
        system = SYSTEM_PROMPT
        if context:
            system += f"\n\nUser context: {context}"
        
        messages = []
        for msg in history[-10:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        messages.append({"role": "user", "content": message})
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/messages",
                headers={
                    "x-api-key": self.api_key,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "system": system,
                    "messages": messages,
                    "max_tokens": 1024
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            return data["content"][0]["text"]


class OllamaProvider(AIProvider):
    """Local Ollama provider - completely free."""
    
    def __init__(self):
        self.base_url = settings.ollama_base_url
        self.model = settings.ollama_model
    
    async def generate_response(
        self, 
        message: str, 
        history: list[dict],
        context: Optional[str] = None
    ) -> str:
        system = SYSTEM_PROMPT
        if context:
            system += f"\n\nUser context: {context}"
        
        # Format messages for Ollama
        full_prompt = f"{system}\n\n"
        for msg in history[-10:]:
            role = "User" if msg["role"] == "user" else "Assistant"
            full_prompt += f"{role}: {msg['content']}\n"
        full_prompt += f"User: {message}\nAssistant:"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": full_prompt,
                    "stream": False
                },
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            return data["response"]


def get_ai_provider() -> AIProvider:
    """Get the configured AI provider."""
    if settings.ai_provider == "groq":
        return GroqProvider()
    elif settings.ai_provider == "anthropic":
        return AnthropicProvider()
    elif settings.ai_provider == "ollama":
        return OllamaProvider()
    else:
        raise ValueError(f"Unknown AI provider: {settings.ai_provider}")


# Singleton instance
ai_service = get_ai_provider()
