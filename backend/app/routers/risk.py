"""
Risk assessment API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user
from app.models.risk import (
    RiskQuestion, 
    RiskAnswers, 
    RiskProfile, 
    RISK_QUESTIONS
)
from app.services.supabase import db

router = APIRouter(prefix="/risk", tags=["risk"])


@router.get("/questions", response_model=list[RiskQuestion])
async def get_risk_questions():
    """Get all risk assessment questions."""
    return RISK_QUESTIONS


@router.post("/assess", response_model=RiskProfile)
async def submit_assessment(
    answers: RiskAnswers,
    current_user: dict = Depends(get_current_user)
):
    """
    Submit risk assessment answers and get a risk profile.
    """
    user_id = current_user["sub"]
    
    # Validate all questions are answered
    question_ids = {q.id for q in RISK_QUESTIONS}
    answered_ids = set(answers.answers.keys())
    
    if not question_ids.issubset(answered_ids):
        missing = question_ids - answered_ids
        raise HTTPException(
            status_code=400,
            detail=f"Missing answers for questions: {missing}"
        )
    
    # Calculate score (sum of answer values, normalized to 1-10)
    total = sum(answers.answers.values())
    max_possible = len(RISK_QUESTIONS) * 4  # Max value per question is 4
    min_possible = len(RISK_QUESTIONS) * 1  # Min value per question is 1
    
    # Normalize to 1-10 scale
    normalized = ((total - min_possible) / (max_possible - min_possible)) * 9 + 1
    score = round(normalized)
    
    # Create risk profile
    profile = RiskProfile.from_score(user_id, score)
    
    # Save to database
    profile_data = {
        "user_id": user_id,
        "score": profile.score,
        "category": profile.category,
        "description": profile.description,
        "recommendations": profile.recommendations,
        "assessed_at": profile.assessed_at.isoformat(),
        "answers": answers.answers
    }
    
    await db.save_risk_profile(profile_data)
    
    return profile


@router.get("/profile", response_model=RiskProfile)
async def get_risk_profile(
    current_user: dict = Depends(get_current_user)
):
    """Get the current user's risk profile."""
    user_id = current_user["sub"]
    
    profile = await db.get_risk_profile(user_id)
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="No risk assessment found. Please take the assessment first."
        )
    
    return RiskProfile(
        user_id=profile["user_id"],
        score=profile["score"],
        category=profile["category"],
        description=profile["description"],
        recommendations=profile["recommendations"],
        assessed_at=profile["assessed_at"]
    )


@router.get("/explanation/{category}")
async def get_category_explanation(category: str):
    """Get detailed explanation of a risk category."""
    explanations = {
        "conservative": {
            "title": "Conservative Investor",
            "emoji": "🛡️",
            "summary": "Safety first! You prefer steady, predictable growth over risky bets.",
            "characteristics": [
                "You prioritize protecting what you have",
                "Market drops make you uncomfortable",
                "You prefer knowing what to expect",
                "Slow and steady wins the race for you"
            ],
            "typical_allocation": {
                "stocks": "20-30%",
                "bonds": "50-60%",
                "cash_equivalents": "10-30%"
            },
            "best_for": [
                "Near-term goals (1-5 years)",
                "Emergency funds",
                "People near retirement",
                "Those with unstable income"
            ]
        },
        "moderate": {
            "title": "Moderate Investor",
            "emoji": "⚖️",
            "summary": "Balance is key! You want growth but aren't willing to lose sleep over it.",
            "characteristics": [
                "You're okay with some ups and downs",
                "You understand that risk and reward go together",
                "You have a medium-term outlook",
                "You check your investments occasionally, not obsessively"
            ],
            "typical_allocation": {
                "stocks": "50-60%",
                "bonds": "30-40%",
                "cash_equivalents": "5-15%"
            },
            "best_for": [
                "Medium-term goals (5-10 years)",
                "General wealth building",
                "Most working professionals",
                "Those with stable income"
            ]
        },
        "aggressive": {
            "title": "Aggressive Investor",
            "emoji": "🚀",
            "summary": "Go big or go home! You're focused on maximum growth and can handle the ride.",
            "characteristics": [
                "You have a long time horizon",
                "Market crashes are buying opportunities",
                "You're comfortable with volatility",
                "You understand you might lose money short-term"
            ],
            "typical_allocation": {
                "stocks": "80-90%",
                "bonds": "5-15%",
                "cash_equivalents": "0-5%"
            },
            "best_for": [
                "Long-term goals (10+ years)",
                "Young investors",
                "Those with high stable income",
                "People who won't need the money soon"
            ]
        }
    }
    
    if category not in explanations:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown category. Must be one of: {list(explanations.keys())}"
        )
    
    return explanations[category]
