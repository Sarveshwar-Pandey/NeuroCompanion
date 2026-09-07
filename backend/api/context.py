from dataclasses import dataclass

from backend.config import (
    DEV_ACTOR_ID,
    DEV_ROLE,
    DEV_USER_ID,
)


@dataclass(frozen=True)
class RequestContext:
    user_id: int
    actor_id: int
    role: str
    session_id: str


def get_request_context() -> RequestContext:
    """
    Development request context.

    For the hackathon, all requests represent the synthetic
    Sukhvinder Sahu patient session.
    """
    return RequestContext(
        user_id=DEV_USER_ID,
        actor_id=DEV_ACTOR_ID,
        role=DEV_ROLE,
        session_id="dev-session",
    )