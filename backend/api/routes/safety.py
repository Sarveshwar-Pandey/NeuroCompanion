from fastapi import APIRouter

from backend.api.context import get_request_context
from backend.api.schemas.safety import SafetyEventsResponse
from backend.services.safety.safety_service import SafetyService


router = APIRouter(
    prefix="/safety",
    tags=["safety"],
)


@router.get(
    "/events",
    response_model=SafetyEventsResponse,
)
async def get_safety_events() -> SafetyEventsResponse:
    """
    Return logged safety events for the current patient.
    """

    context = get_request_context()

    service = SafetyService()

    events = service.get_logged_events(
        user_id=context.user_id,
        limit=20,
    )

    return SafetyEventsResponse(
        success=True,
        user_id=context.user_id,
        count=len(events),
        events=events,
    )