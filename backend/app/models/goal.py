"""
Goal-related Pydantic models for financial goal tracking.
"""

from datetime import date, datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field, field_validator


class GoalCreate(BaseModel):
    """Request body for creating a new goal."""
    name: str = Field(..., min_length=1, max_length=100)
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(default=0, ge=0)
    target_date: Optional[date] = None
    category: Literal[
        "emergency_fund",
        "retirement", 
        "house",
        "education",
        "vacation",
        "car",
        "debt_payoff",
        "other"
    ] = "other"
    notes: Optional[str] = Field(default=None, max_length=500)
    
    @field_validator("target_date")
    @classmethod
    def target_date_must_be_future(cls, v):
        if v and v < date.today():
            raise ValueError("Target date must be in the future")
        return v


class GoalUpdate(BaseModel):
    """Request body for updating a goal."""
    name: Optional[str] = Field(default=None, max_length=100)
    target_amount: Optional[float] = Field(default=None, gt=0)
    current_amount: Optional[float] = Field(default=None, ge=0)
    target_date: Optional[date] = None
    notes: Optional[str] = Field(default=None, max_length=500)


class Goal(BaseModel):
    """Complete goal object from database."""
    id: str
    user_id: str
    name: str
    target_amount: float
    current_amount: float
    target_date: Optional[date]
    category: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    @property
    def progress_percent(self) -> float:
        """Calculate progress as percentage."""
        if self.target_amount == 0:
            return 100.0
        return min(100.0, (self.current_amount / self.target_amount) * 100)
    
    @property
    def amount_remaining(self) -> float:
        """Calculate remaining amount."""
        return max(0, self.target_amount - self.current_amount)


class GoalSummary(BaseModel):
    """Summary of all user goals."""
    total_goals: int
    completed_goals: int
    total_target: float
    total_saved: float
    overall_progress: float
    goals: list[Goal]
