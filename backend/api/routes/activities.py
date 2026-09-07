from fastapi import APIRouter, HTTPException

from backend.api.context import get_request_context
from backend.api.schemas.activities import (
    ActivityHistoryResponse,
    ActivityLibraryResponse,
    ActivityLogRequest,
    ActivityLogResponse,
)
from backend.services.cognitive.cognitive_service import CognitiveService


router = APIRouter(
    prefix="/activities",
    tags=["activities"],
)


@router.get(
    "/history",
    response_model=ActivityHistoryResponse,
)
async def get_activity_history() -> ActivityHistoryResponse:
    context = get_request_context()

    service = CognitiveService()

    history = service.get_history(
        user_id=context.user_id,
        limit=20,
    )

    return ActivityHistoryResponse(
        success=True,
        user_id=context.user_id,
        count=len(history),
        history=history,
    )


@router.get(
    "/library",
    response_model=ActivityLibraryResponse,
)
async def get_activity_library() -> ActivityLibraryResponse:
    service = CognitiveService()
    activities = service.get_activities()

    return ActivityLibraryResponse(
        success=True,
        count=len(activities),
        activities=activities,
    )


@router.post(
    "/log",
    response_model=ActivityLogResponse,
)
async def log_activity_performance(
    request: ActivityLogRequest,
) -> ActivityLogResponse:
    context = get_request_context()
    service = CognitiveService()

    library = service.get_activities()
    activity = next(
        (
            item
            for item in library
            if item.get("id") == request.activity_id
        ),
        None,
    )

    if activity is None:
        raise HTTPException(
            status_code=404,
            detail="That activity is not available.",
        )

    record = service.log_performance(
        user_id=context.user_id,
        activity_id=str(activity["id"]),
        activity_type=str(activity["activity_type"]),
        difficulty=int(activity["difficulty"]),
        score=None,
        duration_seconds=request.duration_seconds,
        outcome=request.outcome or "completed",
        notes=request.notes,
    )

    return ActivityLogResponse(
        success=True,
        record=record,
    )
