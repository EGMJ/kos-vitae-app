from typing import AsyncGenerator
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import async_session
from db.rls import rls_session
from core.auth import User, FAKE_USER

async def get_current_user() -> User:
    # TODO: parse JWT and fetch user from repo; stub for scaffolding
    return FAKE_USER

async def get_rls_session(request: Request, user: User = Depends(get_current_user)) -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        async with rls_session(
            session,
            user_id=user.id,
            profissional_id=user.profissional_id,
            is_admin=user.is_admin,
            request_id=getattr(request.state, "request_id", "") or "req-unknown",
        ) as tx:
            yield tx
