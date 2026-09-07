from fastapi import APIRouter, HTTPException

from backend.api.context import get_request_context
from backend.api.schemas.patient import PatientProfileResponse
from backend.db.database import SessionLocal
from backend.db.models import User


router = APIRouter(
    prefix="/patient",
    tags=["patient"],
)


@router.get(
    "/profile",
    response_model=PatientProfileResponse,
)
async def get_patient_profile() -> PatientProfileResponse:
    context = get_request_context()

    with SessionLocal() as db:
        user = db.get(User, context.user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="Patient not found.",
            )

        return PatientProfileResponse(
            success=True,
            id=user.id,
            name=user.name,
            age=user.age,
        )