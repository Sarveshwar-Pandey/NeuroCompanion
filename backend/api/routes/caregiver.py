from fastapi import APIRouter, HTTPException

from backend.api.context import get_request_context
from backend.api.schemas.caregiver import (
    CaregiverNotificationsResponse,
    CaregiverPreferencesResponse,
    CaregiverSummaryResponse,
)
from backend.services.caregiver.caregiver_service import CaregiverService


router = APIRouter(
    prefix="/caregiver",
    tags=["caregiver"],
)


def _require_authorized_caregiver(service: CaregiverService, patient_user_id: int) -> dict:
    preferences = service.get_preferences(
        patient_user_id=patient_user_id,
    )

    if not preferences.get("authorized_caregiver_found", False):
        raise HTTPException(
            status_code=403,
            detail="No authorized caregiver profile was found.",
        )

    return preferences


@router.get(
    "/summary",
    response_model=CaregiverSummaryResponse,
)
async def get_caregiver_summary() -> CaregiverSummaryResponse:
    """
    Return authorized caregiver summary information.
    """

    context = get_request_context()
    service = CaregiverService()

    _require_authorized_caregiver(service, context.user_id)

    daily_events = service.get_daily_events(
        patient_user_id=context.user_id,
    )

    weekly_trends = service.get_weekly_trends(
        patient_user_id=context.user_id,
    )

    return CaregiverSummaryResponse(
        success=True,
        patient_user_id=context.user_id,
        daily_events=daily_events,
        weekly_trends=weekly_trends,
    )


@router.get(
    "/notifications",
    response_model=CaregiverNotificationsResponse,
)
async def get_caregiver_notifications() -> CaregiverNotificationsResponse:
    """
    Return caregiver notification history for the patient.
    """

    context = get_request_context()
    service = CaregiverService()

    _require_authorized_caregiver(service, context.user_id)

    notifications = service.get_notifications(
        patient_user_id=context.user_id,
        limit=50,
    )

    return CaregiverNotificationsResponse(
        success=True,
        patient_user_id=context.user_id,
        count=len(notifications),
        notifications=notifications,
    )


@router.get(
    "/preferences",
    response_model=CaregiverPreferencesResponse,
)
async def get_caregiver_preferences() -> CaregiverPreferencesResponse:
    context = get_request_context()
    service = CaregiverService()
    preferences = _require_authorized_caregiver(service, context.user_id)

    return CaregiverPreferencesResponse(
        success=True,
        patient_user_id=context.user_id,
        preferences=preferences,
    )
