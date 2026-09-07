from typing import Any

from pydantic import BaseModel


class PatientProfileResponse(BaseModel):
    success: bool
    id: int
    name: str
    preferred_name: str | None = None
    age: int
    occupation: str | None = None
    employer: str | None = None
    city: str | None = None
    primary_language: str | None = None


class PatientRoutineResponse(BaseModel):
    success: bool
    user_id: int
    routine: list[dict[str, Any]]
    pending_tasks: list[dict[str, Any]]
    pending_reminders: list[dict[str, Any]]
    routine_completion_tracking: bool = False


class PatientPeopleResponse(BaseModel):
    success: bool
    user_id: int
    count: int
    people: list[dict[str, Any]]


class PatientMemoriesResponse(BaseModel):
    success: bool
    user_id: int
    count: int
    memories: list[dict[str, Any]]
