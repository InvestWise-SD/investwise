"""
Risk assessment models for determining user risk tolerance.
"""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field


class RiskQuestion(BaseModel):
    """A single risk assessment question."""
    id: str
    question: str
    options: list[dict]  # [{value: int, label: str}]
    category: Literal["time_horizon", "loss_tolerance", "income_stability", "experience"]


class RiskAnswers(BaseModel):
    """User's answers to risk assessment."""
    answers: dict[str, int] = Field(
        ..., 
        description="Map of question_id to selected option value"
    )


class RiskProfile(BaseModel):
    """User's calculated risk profile."""
    user_id: str
    score: int = Field(..., ge=1, le=10)
    category: Literal["conservative", "moderate", "aggressive"]
    description: str
    recommendations: list[str]
    assessed_at: datetime
    
    @classmethod
    def from_score(cls, user_id: str, score: int) -> "RiskProfile":
        """Create a risk profile from a score."""
        if score <= 3:
            category = "conservative"
            description = (
                "You prefer stability over high returns. Capital preservation "
                "is your priority, and you're uncomfortable with market volatility."
            )
            recommendations = [
                "Focus on high-yield savings accounts and CDs",
                "Consider government bonds for steady income",
                "Keep a larger emergency fund (6-12 months)",
                "If investing in stocks, stick to large, stable companies"
            ]
        elif score <= 6:
            category = "moderate"
            description = (
                "You're comfortable with some ups and downs in exchange for "
                "better potential returns. You balance growth with stability."
            )
            recommendations = [
                "A balanced mix of stocks and bonds works well for you",
                "Index funds provide diversification with moderate risk",
                "Consider target-date funds for hands-off investing",
                "Rebalance your portfolio annually"
            ]
        else:
            category = "aggressive"
            description = (
                "You're focused on long-term growth and can tolerate significant "
                "short-term volatility. You have time to recover from downturns."
            )
            recommendations = [
                "You can handle a stock-heavy portfolio (80%+ stocks)",
                "Consider growth stocks and international markets",
                "Small-cap and emerging market funds can boost returns",
                "Stay the course during market downturns"
            ]
        
        return cls(
            user_id=user_id,
            score=score,
            category=category,
            description=description,
            recommendations=recommendations,
            assessed_at=datetime.utcnow()
        )


# Default risk assessment questions
RISK_QUESTIONS: list[RiskQuestion] = [
    RiskQuestion(
        id="q1_time_horizon",
        question="When do you plan to use this money?",
        category="time_horizon",
        options=[
            {"value": 1, "label": "Less than 2 years"},
            {"value": 2, "label": "2-5 years"},
            {"value": 3, "label": "5-10 years"},
            {"value": 4, "label": "More than 10 years"}
        ]
    ),
    RiskQuestion(
        id="q2_loss_reaction",
        question="If your investment dropped 20% in a month, what would you do?",
        category="loss_tolerance",
        options=[
            {"value": 1, "label": "Sell everything immediately"},
            {"value": 2, "label": "Sell some to reduce losses"},
            {"value": 3, "label": "Hold and wait it out"},
            {"value": 4, "label": "Buy more at the lower price"}
        ]
    ),
    RiskQuestion(
        id="q3_income_stability",
        question="How stable is your current income?",
        category="income_stability",
        options=[
            {"value": 1, "label": "Very unstable (freelance, seasonal)"},
            {"value": 2, "label": "Somewhat unstable"},
            {"value": 3, "label": "Fairly stable"},
            {"value": 4, "label": "Very stable (secure job, multiple sources)"}
        ]
    ),
    RiskQuestion(
        id="q4_experience",
        question="How would you describe your investment experience?",
        category="experience",
        options=[
            {"value": 1, "label": "None - I'm brand new to this"},
            {"value": 2, "label": "Beginner - I know the basics"},
            {"value": 3, "label": "Intermediate - I've invested before"},
            {"value": 4, "label": "Experienced - I actively manage investments"}
        ]
    ),
    RiskQuestion(
        id="q5_comfort_level",
        question="Which statement best describes you?",
        category="loss_tolerance",
        options=[
            {"value": 1, "label": "I can't afford to lose any money"},
            {"value": 2, "label": "I can handle small losses for small gains"},
            {"value": 3, "label": "I accept moderate losses for moderate gains"},
            {"value": 4, "label": "I'll risk big losses for potentially big gains"}
        ]
    )
]
