"""
Supabase database service for all database operations.
"""

from typing import Optional
from supabase import create_client, Client

from app.core.config import get_settings

settings = get_settings()


def get_supabase_client() -> Client:
    """Get Supabase client instance."""
    return create_client(settings.supabase_url, settings.supabase_key)


class SupabaseService:
    """Service class for Supabase database operations."""
    
    def __init__(self):
        self.client = get_supabase_client()
    
    # ============ User Operations ============
    
    async def get_user(self, user_id: str) -> Optional[dict]:
        """Get user by ID."""
        response = self.client.table("users").select("*").eq("id", user_id).single().execute()
        return response.data
    
    async def create_user(self, user_data: dict) -> dict:
        """Create a new user."""
        response = self.client.table("users").insert(user_data).execute()
        return response.data[0]
    
    async def update_user(self, user_id: str, user_data: dict) -> dict:
        """Update user data."""
        response = self.client.table("users").update(user_data).eq("id", user_id).execute()
        return response.data[0]
    
    # ============ Goal Operations ============
    
    async def get_goals(self, user_id: str) -> list[dict]:
        """Get all goals for a user."""
        response = (
            self.client.table("goals")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data
    
    async def get_goal(self, goal_id: str, user_id: str) -> Optional[dict]:
        """Get a specific goal."""
        response = (
            self.client.table("goals")
            .select("*")
            .eq("id", goal_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        return response.data
    
    async def create_goal(self, goal_data: dict) -> dict:
        """Create a new goal."""
        response = self.client.table("goals").insert(goal_data).execute()
        return response.data[0]
    
    async def update_goal(self, goal_id: str, user_id: str, goal_data: dict) -> dict:
        """Update a goal."""
        response = (
            self.client.table("goals")
            .update(goal_data)
            .eq("id", goal_id)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data[0]
    
    async def delete_goal(self, goal_id: str, user_id: str) -> bool:
        """Delete a goal."""
        response = (
            self.client.table("goals")
            .delete()
            .eq("id", goal_id)
            .eq("user_id", user_id)
            .execute()
        )
        return len(response.data) > 0
    
    # ============ Chat History Operations ============
    
    async def get_chat_history(self, user_id: str, limit: int = 50) -> list[dict]:
        """Get chat history for a user."""
        response = (
            self.client.table("chat_messages")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return list(reversed(response.data))
    
    async def save_chat_message(self, message_data: dict) -> dict:
        """Save a chat message."""
        response = self.client.table("chat_messages").insert(message_data).execute()
        return response.data[0]
    
    async def clear_chat_history(self, user_id: str) -> bool:
        """Clear all chat history for a user."""
        response = (
            self.client.table("chat_messages")
            .delete()
            .eq("user_id", user_id)
            .execute()
        )
        return True
    
    # ============ Risk Profile Operations ============
    
    async def get_risk_profile(self, user_id: str) -> Optional[dict]:
        """Get user's risk profile."""
        response = (
            self.client.table("risk_profiles")
            .select("*")
            .eq("user_id", user_id)
            .order("assessed_at", desc=True)
            .limit(1)
            .single()
            .execute()
        )
        return response.data
    
    async def save_risk_profile(self, profile_data: dict) -> dict:
        """Save a risk profile."""
        response = self.client.table("risk_profiles").insert(profile_data).execute()
        return response.data[0]


# Singleton instance
db = SupabaseService()
