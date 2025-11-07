from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

async def start_scheduler():
    if not scheduler.running:
        scheduler.start()
