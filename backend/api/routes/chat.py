from fastapi import APIRouter, HTTPException

from backend.api.context import get_request_context
from backend.api.schemas.chat import ChatRequest, ChatResponse
from backend.integrations.neuro_san_client import NeuroSanClient


router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Send a conversational request to the Neuro-SAN front orchestrator.
    """

    context = get_request_context()

    client = NeuroSanClient()

    try:
        response = await client.chat(
            message=request.message,
            sly_data={},
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Neuro-SAN companion service is unavailable.",
        ) from exc

    return ChatResponse(
        success=True,
        message=request.message,
        response=response,
        user_id=context.user_id,
    )