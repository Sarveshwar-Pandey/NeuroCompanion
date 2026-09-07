from typing import Any

from pydantic import BaseModel


class ActivityHistoryResponse(BaseModel):
    success: bool
    user_id: int
    count: int
    history: list[dict[str, Any]]