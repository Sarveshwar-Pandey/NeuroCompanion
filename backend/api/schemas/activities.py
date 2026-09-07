from typing import Any

from pydantic import BaseModel, Field


class ActivityHistoryResponse(BaseModel):
    success: bool
    user_id: int
    count: int
    history: list[dict[str, Any]]


class ActivityLibraryResponse(BaseModel):
    success: bool
    count: int
    activities: list[dict[str, Any]]


class ActivityLogRequest(BaseModel):
    activity_id: str = Field(..., min_length=1, max_length=100)
    notes: str | None = Field(default=None, max_length=4000)
    duration_seconds: int | None = Field(default=None, ge=0)
    outcome: str | None = Field(default="completed", max_length=100)


class ActivityLogResponse(BaseModel):
    success: bool
    record: dict[str, Any]
