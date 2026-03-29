"""
Goals API endpoints for financial goal tracking.
"""

from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.models.goal import Goal, GoalCreate, GoalUpdate, GoalSummary
from app.services.supabase import db

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("/", response_model=GoalSummary)
async def get_all_goals(
    current_user: dict = Depends(get_current_user)
):
    """Get all goals for the current user with summary stats."""
    user_id = current_user["sub"]
    
    goals_data = await db.get_goals(user_id)
    goals = [Goal(**g) for g in goals_data]
    
    total_target = sum(g.target_amount for g in goals)
    total_saved = sum(g.current_amount for g in goals)
    completed = sum(1 for g in goals if g.current_amount >= g.target_amount)
    
    return GoalSummary(
        total_goals=len(goals),
        completed_goals=completed,
        total_target=total_target,
        total_saved=total_saved,
        overall_progress=(total_saved / total_target * 100) if total_target > 0 else 0,
        goals=goals
    )


@router.post("/", response_model=Goal, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal: GoalCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new financial goal."""
    user_id = current_user["sub"]
    
    goal_data = {
        "id": str(uuid4()),
        "user_id": user_id,
        "name": goal.name,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "target_date": goal.target_date.isoformat() if goal.target_date else None,
        "category": goal.category,
        "notes": goal.notes,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    created = await db.create_goal(goal_data)
    return Goal(**created)


@router.get("/{goal_id}", response_model=Goal)
async def get_goal(
    goal_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific goal by ID."""
    user_id = current_user["sub"]
    
    goal = await db.get_goal(goal_id, user_id)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    return Goal(**goal)


@router.patch("/{goal_id}", response_model=Goal)
async def update_goal(
    goal_id: str,
    goal_update: GoalUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an existing goal."""
    user_id = current_user["sub"]
    
    # Check goal exists
    existing = await db.get_goal(goal_id, user_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Build update data
    update_data = {"updated_at": datetime.utcnow().isoformat()}
    if goal_update.name is not None:
        update_data["name"] = goal_update.name
    if goal_update.target_amount is not None:
        update_data["target_amount"] = goal_update.target_amount
    if goal_update.current_amount is not None:
        update_data["current_amount"] = goal_update.current_amount
    if goal_update.target_date is not None:
        update_data["target_date"] = goal_update.target_date.isoformat()
    if goal_update.notes is not None:
        update_data["notes"] = goal_update.notes
    
    updated = await db.update_goal(goal_id, user_id, update_data)
    return Goal(**updated)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a goal."""
    user_id = current_user["sub"]
    
    deleted = await db.delete_goal(goal_id, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )


@router.post("/{goal_id}/contribute")
async def add_contribution(
    goal_id: str,
    amount: float,
    current_user: dict = Depends(get_current_user)
):
    """Add a contribution to a goal."""
    user_id = current_user["sub"]
    
    goal = await db.get_goal(goal_id, user_id)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contribution amount must be positive"
        )
    
    new_amount = goal["current_amount"] + amount
    updated = await db.update_goal(goal_id, user_id, {
        "current_amount": new_amount,
        "updated_at": datetime.utcnow().isoformat()
    })
    
    goal_obj = Goal(**updated)
    
    # Check if goal completed
    is_completed = goal_obj.current_amount >= goal_obj.target_amount
    
    return {
        "goal": goal_obj,
        "contribution": amount,
        "is_completed": is_completed,
        "message": "Congratulations! You've reached your goal! 🎉" if is_completed else f"Great progress! ${goal_obj.amount_remaining:.2f} to go!"
    }
