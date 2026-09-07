from typing import Any

from pydantic import BaseModel


class CaregiverSummaryResponse(BaseModel):
    success: bool
    patient_user_id: int
    daily_events: dict[str, Any]
    weekly_trends: dict[str, Any]


class CaregiverNotificationsResponse(BaseModel):
    success: bool
    patient_user_id: int
    count: int
    notifications: list[dict[str, Any]]


class CaregiverPreferencesResponse(BaseModel):
    success: bool
    patient_user_id: int
    preferences: dict[str, Any]
