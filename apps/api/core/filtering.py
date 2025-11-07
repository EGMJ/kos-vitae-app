from typing import Optional
from pydantic import BaseModel

class DateRange(BaseModel):
    from_dt: Optional[str] = None
    to_dt: Optional[str] = None
