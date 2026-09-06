from sqlalchemy import select

from backend.db.database import SessionLocal
from backend.db.models import (
    ActivityPerformance,
    Memory,
    Reminder,
    RoutineItem,
    Task,
    User,
)
from backend.repositories.safety_repository import SafetyRepository


class SafetyService:

    def get_baseline(self, user_id: int) -> dict:
        session = SessionLocal()

        try:
            user = session.scalar(
                select(User).where(User.id == user_id)
            )

            if user is None:
                return {
                    "found": False,
                    "message": "User baseline not found.",
                }

            memories = list(
                session.scalars(
                    select(Memory)
                    .where(Memory.user_id == user_id)
                    .where(
                        Memory.memory_type.in_(
                            ["fact", "episode", "event"]
                        )
                    )
                    .order_by(Memory.created_at.desc())
                    .limit(10)
                ).all()
            )

            safety_memories = [
                memory.content
                for memory in memories
                if any(
                    keyword in memory.content.lower()
                    for keyword in [
                        "confusion",
                        "safety",
                        "wandering",
                        "fall",
                        "support",
                        "cognitive",
                        "orientation",
                    ]
                )
            ]

            return {
                "found": True,
                "user_id": user.id,
                "name": user.name,
                "age_context": "older adult",
                "cognitive_support_level": user.cognitive_support_level,
                "profile_notes": user.profile_notes,
                "relevant_baseline_observations": safety_memories,
            }

        finally:
            session.close()

    def get_recent_events(
        self,
        user_id: int,
        limit: int = 10,
    ) -> dict:
        session = SessionLocal()

        try:
            activities = list(
                session.scalars(
                    select(ActivityPerformance)
                    .where(ActivityPerformance.user_id == user_id)
                    .order_by(
                        ActivityPerformance.completed_at.desc()
                    )
                    .limit(limit)
                ).all()
            )

            tasks = list(
                session.scalars(
                    select(Task)
                    .where(Task.user_id == user_id)
                    .where(Task.status == "pending")
                    .order_by(Task.scheduled_for)
                    .limit(limit)
                ).all()
            )

            reminders = list(
                session.scalars(
                    select(Reminder)
                    .where(Reminder.user_id == user_id)
                    .where(Reminder.status == "pending")
                    .order_by(Reminder.remind_at)
                    .limit(limit)
                ).all()
            )

            routine_items = list(
                session.scalars(
                    select(RoutineItem)
                    .where(RoutineItem.user_id == user_id)
                    .where(RoutineItem.active.is_(True))
                    .order_by(RoutineItem.time_of_day)
                    .limit(limit)
                ).all()
            )

            return {
                "user_id": user_id,
                "recent_cognitive_activity": [
                    {
                        "activity_id": item.activity_id,
                        "activity_type": item.activity_type,
                        "difficulty": item.difficulty,
                        "score": item.score,
                        "outcome": item.outcome,
                        "completed_at": (
                            item.completed_at.isoformat()
                            if item.completed_at
                            else None
                        ),
                    }
                    for item in activities
                ],
                "pending_tasks": [
                    {
                        "title": item.title,
                        "scheduled_for": (
                            item.scheduled_for.isoformat()
                            if item.scheduled_for
                            else None
                        ),
                        "priority": item.priority,
                    }
                    for item in tasks
                ],
                "pending_reminders": [
                    {
                        "title": item.title,
                        "remind_at": item.remind_at.isoformat(),
                    }
                    for item in reminders
                ],
                "routine_items": [
                    {
                        "title": item.title,
                        "time_of_day": item.time_of_day,
                        "category": item.category,
                    }
                    for item in routine_items
                ],
            }

        finally:
            session.close()

    def create_escalation(
        self,
        user_id: int,
        risk_level: str,
        reason: str,
        confidence: float,
        risk_signals: str,
        recommended_next_step: str,
        human_review_required: bool,
    ) -> dict:
        session = SessionLocal()

        try:
            repository = SafetyRepository(session)

            event = repository.create_event(
                user_id=user_id,
                risk_level=risk_level,
                reason=reason,
                confidence=confidence,
                risk_signals=risk_signals,
                recommended_next_step=recommended_next_step,
                human_review_required=human_review_required,
            )

            return {
                "event_id": event.id,
                "user_id": event.user_id,
                "risk_level": event.risk_level,
                "reason": event.reason,
                "confidence": event.confidence,
                "risk_signals": event.risk_signals,
                "recommended_next_step": event.recommended_next_step,
                "human_review_required": event.human_review_required,
                "created_at": event.created_at.isoformat(),
            }

        finally:
            session.close()

    def get_logged_events(
        self,
        user_id: int,
        limit: int = 10,
    ) -> list[dict]:
        session = SessionLocal()

        try:
            repository = SafetyRepository(session)

            events = repository.get_recent_events(
                user_id=user_id,
                limit=limit,
            )

            return [
                {
                    "event_id": event.id,
                    "risk_level": event.risk_level,
                    "reason": event.reason,
                    "confidence": event.confidence,
                    "risk_signals": event.risk_signals,
                    "recommended_next_step": event.recommended_next_step,
                    "human_review_required": event.human_review_required,
                    "created_at": event.created_at.isoformat(),
                }
                for event in events
            ]

        finally:
            session.close()