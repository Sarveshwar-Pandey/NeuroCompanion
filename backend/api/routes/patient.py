from datetime import date

from fastapi import APIRouter, HTTPException

from backend.api.context import get_request_context
from backend.api.schemas.patient import (
    PatientMemoriesResponse,
    PatientPeopleResponse,
    PatientProfileResponse,
    PatientRoutineResponse,
)
from backend.db.database import SessionLocal
from backend.db.models import User
from backend.services.memory.memory_service import MemoryService
from backend.services.routine.routine_service import RoutineService


router = APIRouter(
    prefix="/patient",
    tags=["patient"],
)


def calculate_age(date_of_birth: date) -> int:
    """Calculate age accurately from date of birth."""
    today = date.today()

    age = today.year - date_of_birth.year

    if (today.month, today.day) < (
        date_of_birth.month,
        date_of_birth.day,
    ):
        age -= 1

    return age


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

        if user.date_of_birth is None:
            raise HTTPException(
                status_code=500,
                detail="Patient date of birth is unavailable.",
            )

        age = calculate_age(user.date_of_birth.date())

        return PatientProfileResponse(
            success=True,
            id=user.id,
            name=user.name,
            preferred_name=user.preferred_name,
            age=age,
            occupation=user.occupation,
            employer=user.employer,
            city=user.city,
            primary_language=user.primary_language,
        )


@router.get(
    "/routine",
    response_model=PatientRoutineResponse,
)
async def get_patient_routine() -> PatientRoutineResponse:
    context = get_request_context()
    service = RoutineService()

    return PatientRoutineResponse(
        success=True,
        user_id=context.user_id,
        routine=service.get_routine(user_id=context.user_id),
        pending_tasks=service.get_tasks(user_id=context.user_id),
        pending_reminders=service.get_pending_reminders(
            user_id=context.user_id,
        ),
        routine_completion_tracking=False,
    )


@router.get(
    "/people",
    response_model=PatientPeopleResponse,
)
async def get_patient_people() -> PatientPeopleResponse:
    context = get_request_context()
    service = MemoryService()
    people = service.list_people(user_id=context.user_id)

    return PatientPeopleResponse(
        success=True,
        user_id=context.user_id,
        count=len(people),
        people=people,
    )


@router.get(
    "/memories",
    response_model=PatientMemoriesResponse,
)
async def get_patient_memories() -> PatientMemoriesResponse:
    context = get_request_context()
    service = MemoryService()
    memories = service.list_memories(user_id=context.user_id)

    return PatientMemoriesResponse(
        success=True,
        user_id=context.user_id,
        count=len(memories),
        memories=memories,
    )
