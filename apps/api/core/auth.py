from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from pydantic import BaseModel
from config import get_settings

router = APIRouter(tags=["Auth"])

ALGO = "HS256"

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class User(BaseModel):
    id: str
    email: str
    is_admin: bool = False
    profissional_id: Optional[str] = None

# NOTE: stub user store for scaffolding only
FAKE_USER = User(id="00000000-0000-0000-0000-000000000001", email="dev@example.com", is_admin=False, profissional_id="00000000-0000-0000-0000-0000000000AA")


def create_access_token(user: User) -> Token:
    settings = get_settings()
    exp = datetime.now(tz=timezone.utc) + timedelta(minutes=settings.jwt_expires_min)
    payload = {"sub": user.id, "email": user.email, "is_admin": user.is_admin, "profissional_id": user.profissional_id, "exp": exp}
    encoded = jwt.encode(payload, settings.jwt_secret, algorithm=ALGO)
    return Token(access_token=encoded, expires_in=settings.jwt_expires_min * 60)

@router.post("/login", response_model=Token, operation_id="auth_login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    # scaffold: accept any user/password; replace with real repo later
    return create_access_token(FAKE_USER)

@router.get("/me", response_model=User, operation_id="auth_me")
async def me():
    return FAKE_USER
