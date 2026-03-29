"""
Chat-related Pydantic models for request/response validation.
"""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """A single chat message."""
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    """Request body for chat endpoint."""
    message: str = Field(..., min_length=1, max_length=2000)
    context: Optional[str] = Field(
        default=None,
        description="Additional context like 'goals' or 'risk_assessment'"
    )


class ChatResponse(BaseModel):
    """Response from chat endpoint."""
    message: str
    suggestions: list[str] = Field(
        default_factory=list,
        description="Follow-up question suggestions"
    )
    jargon_detected: list[dict] = Field(
        default_factory=list,
        description="Financial terms with plain-English definitions"
    )


class ConversationHistory(BaseModel):
    """Full conversation history for a user."""
    user_id: str
    messages: list[ChatMessage]
    created_at: datetime
    updated_at: datetime
