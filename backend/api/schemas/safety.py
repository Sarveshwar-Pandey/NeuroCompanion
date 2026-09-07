from typing import Any

from pydantic import BaseModel


class SafetyEventsResponse(BaseModel):
    success: bool
    user_id: int
    count: int
    events: list[dict[str, Any]]