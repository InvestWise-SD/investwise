"""
Security utilities for authentication with Supabase.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx

from app.core.config import get_settings

settings = get_settings()
security = HTTPBearer()


async def verify_supabase_token(token: str) -> dict:
    """Verify a Supabase JWT token by calling Supabase Auth API."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.supabase_key
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                user_data = response.json()
                return {"sub": user_data["id"], "email": user_data.get("email")}
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not verify token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """Dependency to get current authenticated user from Supabase token."""
    return await verify_supabase_token(credentials.credentials)
