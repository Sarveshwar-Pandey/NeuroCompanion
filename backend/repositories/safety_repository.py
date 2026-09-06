from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.db.models import SafetyEvent


class SafetyRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_event(
        self,
        user_id: int,
        risk_level: str,
        reason: str,
        confidence: float,
        risk_signals: str | None,
        recommended_next_step: str,
        human_review_required: bool,
    ) -> SafetyEvent:
        event = SafetyEvent(
            user_id=user_id,
            risk_level=risk_level,
            reason=reason,
            confidence=confidence,
            risk_signals=risk_signals,
            recommended_next_step=recommended_next_step,
            human_review_required=human_review_required,
        )

        self.session.add(event)
        self.session.commit()
        self.session.refresh(event)

        return event

    def get_recent_events(
        self,
        user_id: int,
        limit: int = 10,
    ) -> list[SafetyEvent]:
        statement = (
            select(SafetyEvent)
            .where(SafetyEvent.user_id == user_id)
            .order_by(SafetyEvent.created_at.desc())
            .limit(limit)
        )

        return list(self.session.scalars(statement).all())