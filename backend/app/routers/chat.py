"""
Chat API endpoints for the conversational AI.
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional

from app.core.security import get_current_user
from app.models.chat import ChatRequest, ChatResponse
from app.services.supabase import db
from app.services.ai_service import ai_service
from app.services.jargon import detect_jargon

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Send a message to the AI chatbot and get a response.
    """
    user_id = current_user["sub"]
    
    try:
        # Get conversation history
        history = await db.get_chat_history(user_id, limit=20)
        
        # Build context from user's goals and risk profile if available
        context = None
        if request.context:
            if request.context == "goals":
                goals = await db.get_goals(user_id)
                if goals:
                    goal_summary = ", ".join([f"{g['name']}: ${g['current_amount']}/{g['target_amount']}" for g in goals[:3]])
                    context = f"User's financial goals: {goal_summary}"
            elif request.context == "risk":
                profile = await db.get_risk_profile(user_id)
                if profile:
                    context = f"User's risk profile: {profile['category']} (score: {profile['score']}/10)"
        
        # Generate AI response
        ai_response = await ai_service.generate_response(
            message=request.message,
            history=[{"role": m["role"], "content": m["content"]} for m in history],
            context=context
        )
        
        # Save user message
        await db.save_chat_message({
            "user_id": user_id,
            "role": "user",
            "content": request.message
        })
        
        # Save assistant response
        await db.save_chat_message({
            "user_id": user_id,
            "role": "assistant",
            "content": ai_response
        })
        
        # Detect jargon in response
        jargon = detect_jargon(ai_response)
        
        # Generate follow-up suggestions
        suggestions = _generate_suggestions(request.message, ai_response)
        
        return ChatResponse(
            message=ai_response,
            suggestions=suggestions,
            jargon_detected=jargon
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_history(
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """Get conversation history for the current user."""
    user_id = current_user["sub"]
    history = await db.get_chat_history(user_id, limit=limit)
    return {"messages": history}


@router.delete("/history")
async def clear_history(
    current_user: dict = Depends(get_current_user)
):
    """Clear all conversation history for the current user."""
    user_id = current_user["sub"]
    await db.clear_chat_history(user_id)
    return {"message": "Chat history cleared"}


def _generate_suggestions(user_message: str, ai_response: str) -> list[str]:
    """Generate follow-up question suggestions based on the conversation."""
    # Simple keyword-based suggestions
    suggestions = []
    
    msg_lower = user_message.lower()
    resp_lower = ai_response.lower()
    
    if "stock" in resp_lower and "how to buy" not in msg_lower:
        suggestions.append("How do I actually buy stocks?")
    
    if "risk" in resp_lower and "risk tolerance" not in msg_lower:
        suggestions.append("What's my risk tolerance?")
    
    if any(term in resp_lower for term in ["etf", "index fund", "mutual fund"]):
        suggestions.append("What's the difference between ETFs and mutual funds?")
    
    if "diversif" in resp_lower:
        suggestions.append("How much diversification do I need?")
    
    if "401k" in resp_lower or "ira" in resp_lower:
        suggestions.append("Should I prioritize 401k or IRA?")
    
    if "goal" in msg_lower or "save" in msg_lower:
        suggestions.append("Help me set a financial goal")
    
    # Default suggestions if none matched
    if not suggestions:
        suggestions = [
            "What should a beginner know first?",
            "How much should I save before investing?",
            "Tell me about index funds"
        ]
    
    return suggestions[:3]
