from fastapi import APIRouter

from backend.api.context import get_request_context
from backend.api.schemas.activities import ActivityHistoryResponse
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