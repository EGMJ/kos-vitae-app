from typing import Any, List, Optional
from pydantic import BaseModel

class PageMeta(BaseModel):
    next_cursor: Optional[str] = None

class Page(BaseModel):
    items: List[Any]
    meta: PageMeta
