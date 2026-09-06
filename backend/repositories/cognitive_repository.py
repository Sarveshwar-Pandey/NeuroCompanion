from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.db.models import ActivityPerformance


class CognitiveRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_history(
        self,
        user_id: int,
        limit: int = 10,
    ) -> list[ActivityPerformance]:
        statement = (
            select(ActivityPerformance)
            .where(ActivityPerformance.user_id == user_id)
            .order_by(ActivityPerformance.completed_at.desc())
            .limit(limit)
        )

        return list(self.session.scalars(statement).all())

    def log_performance(
        self,
        user_id: int,
        activity_id: str,
        activity_type: str,
        difficulty: int,
        score: float | None = None,
        duration_seconds: int | None = None,
        outcome: str | None = None,
        notes: str | None = None,
    ) -> ActivityPerformance:

        record = ActivityPerformance(
            user_id=user_id,
            activity_id=activity_id,
            activity_type=activity_type,
            difficulty=difficulty,
            score=score,
            duration_seconds=duration_seconds,
            outcome=outcome,
            notes=notes,
            completed_at=datetime.utcnow(),
        )

        self.session.add(record)
        self.session.commit()
        self.session.refresh(record)

        return record