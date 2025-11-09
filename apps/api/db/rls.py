from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession

@asynccontextmanager
async def rls_session(session: AsyncSession, user_id: str, profissional_id: str | None, is_admin: bool, request_id: str):
    async with session.begin():
        await session.execute("SET LOCAL app.current_user_id = :u", {"u": user_id})
        await session.execute("SET LOCAL app.current_profissional_id = :p", {"p": profissional_id})
        await session.execute("SET LOCAL app.current_is_admin = :a", {"a": "true" if is_admin else "false"})
        await session.execute("SET LOCAL app.request_id = :r", {"r": request_id})
        yield session
