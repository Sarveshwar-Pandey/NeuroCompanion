from typing import Any

from fastapi import APIRouter, HTTPException

from backend.api.context import get_request_context
from backend.api.schemas.caregiver import (
    CaregiverNotificationsResponse,
    CaregiverSummaryResponse,
)
from backend.services.caregiver.caregiver_service import CaregiverService


router = APIRouter(
    prefix="/caregiver",
    tags=["caregiver"],
)


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

    preferences = service.get_preferences(
        patient_user_id=context.user_id,
    )

    if not preferences.get("authorized_caregiver_found", False):
        raise HTTPException(
            status_code=403,
            detail="No authorized caregiver profile was found.",
        )

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

    # The current CaregiverService does not expose a notification-read
    # method, so we read existing notifications directly from the database
    # after verifying that an authorized caregiver exists.
    preferences_service = CaregiverService()

    preferences = preferences_service.get_preferences(
        patient_user_id=context.user_id,
    )

    if not preferences.get("authorized_caregiver_found", False):
        raise HTTPException(
            status_code=403,
            detail="No authorized caregiver profile was found.",
        )

    from backend.db.database import SessionLocal
    from backend.db.models import CaregiverNotification

    with SessionLocal() as db:
        notifications = list(
            db.query(CaregiverNotification)
            .filter(
                CaregiverNotification.patient_user_id
                == context.user_id
            )
            .order_by(CaregiverNotification.created_at.desc())
            .limit(50)
            .all()
        )

        notification_data = [
            {
                "notification_id": notification.id,
                "caregiver_id": notification.caregiver_id,
                "notification_type": notification.notification_type,
                "title": notification.title,
                "message": notification.message,
                "priority": notification.priority,
                "status": notification.status,
                "created_at": notification.created_at.isoformat(),
            }
            for notification in notifications
        ]

    return CaregiverNotificationsResponse(
        success=True,
        patient_user_id=context.user_id,
        count=len(notification_data),
        notifications=notification_data,
    )