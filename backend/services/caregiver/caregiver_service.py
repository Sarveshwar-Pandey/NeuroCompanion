from backend.db.database import SessionLocal
from backend.db.models import CaregiverProfile
from backend.repositories.caregiver_repository import (
    CaregiverRepository,
)

class CaregiverService:

    def get_preferences(
        self,
        patient_user_id: int,
    ) -> dict:
        session = SessionLocal()

        try:
            repository = CaregiverRepository(session)

            caregiver = repository.get_authorized_caregiver(
                patient_user_id=patient_user_id,
            )

            if caregiver is None:
                return {
                    "authorized_caregiver_found": False,
                    "message": (
                        "No authorized caregiver profile "
                        "was found."
                    ),
                }

            return {
                "authorized_caregiver_found": True,
                "caregiver_id": caregiver.id,
                "name": caregiver.name,
                "relationship": (
                    caregiver.relationship_to_patient
                ),
                "role": caregiver.role,
                "notifications_enabled": (
                    caregiver.notifications_enabled
                ),
                "preferred_summary_frequency": (
                    caregiver.preferred_summary_frequency
                ),
            }

        finally:
            session.close()

    def get_daily_events(
        self,
        patient_user_id: int,
    ) -> dict:
        session = SessionLocal()

        try:
            repository = CaregiverRepository(session)

            data = repository.get_daily_data(
                patient_user_id=patient_user_id,
            )

            return {
                "date": data["date"],

                "safety_events": [
                    {
                        "risk_level": event.risk_level,
                        "reason": event.reason,
                        "confidence": event.confidence,
                        "risk_signals": event.risk_signals,
                        "recommended_next_step": (
                            event.recommended_next_step
                        ),
                        "human_review_required": (
                            event.human_review_required
                        ),
                        "created_at": (
                            event.created_at.isoformat()
                        ),
                    }
                    for event in data["safety_events"]
                ],

                "cognitive_activity": [
                    {
                        "activity_id": item.activity_id,
                        "activity_type": item.activity_type,
                        "difficulty": item.difficulty,
                        "score": item.score,
                        "duration_seconds": (
                            item.duration_seconds
                        ),
                        "outcome": item.outcome,
                        "completed_at": (
                            item.completed_at.isoformat()
                        ),
                    }
                    for item in data["activities"]
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
                    for item in data["tasks"]
                ],

                "pending_reminders": [
                    {
                        "title": item.title,
                        "remind_at": item.remind_at.isoformat(),
                    }
                    for item in data["reminders"]
                ],

                "scheduled_routine": [
                    {
                        "title": item.title,
                        "time_of_day": item.time_of_day,
                        "category": item.category,
                    }
                    for item in data["routines"]
                ],

                "routine_completion_tracking": False,
            }

        finally:
            session.close()

    def get_weekly_trends(
        self,
        patient_user_id: int,
    ) -> dict:
        session = SessionLocal()

        try:
            repository = CaregiverRepository(session)

            data = repository.get_weekly_data(
                patient_user_id=patient_user_id,
            )

            activities = data["activities"]

            scores = [
                item.score
                for item in activities
                if item.score is not None
            ]

            average_score = (
                sum(scores) / len(scores)
                if scores
                else None
            )

            safety_counts: dict[str, int] = {}

            for event in data["safety_events"]:
                risk = event.risk_level.upper()
                safety_counts[risk] = (
                    safety_counts.get(risk, 0) + 1
                )

            return {
                "period_start": data["period_start"],
                "period_end": data["period_end"],

                "cognitive_activity_count": (
                    len(activities)
                ),

                "average_activity_score": average_score,

                "activity_types": sorted(
                    {
                        item.activity_type
                        for item in activities
                    }
                ),

                "safety_event_count": (
                    len(data["safety_events"])
                ),

                "safety_events_by_risk": safety_counts,

                "pending_task_count": (
                    len(data["pending_tasks"])
                ),

                "pending_reminder_count": (
                    len(data["pending_reminders"])
                ),

                "routine_adherence_available": False,
            }

        finally:
            session.close()

    def send_notification(
        self,
        patient_user_id: int,
        caregiver_id: int,
        notification_type: str,
        title: str,
        message: str,
        priority: str = "normal",
    ) -> dict:
        session = SessionLocal()

        try:
            repository = CaregiverRepository(session)

            caregiver = session.get(
                __import__(
                    "backend.db.models",
                    fromlist=["CaregiverProfile"],
                ).CaregiverProfile,
                caregiver_id,
            )

            if caregiver is None:
                return {
                    "success": False,
                    "error": "Caregiver not found.",
                }

            if caregiver.patient_user_id != patient_user_id:
                return {
                    "success": False,
                    "error": (
                        "Caregiver is not authorized "
                        "for this patient."
                    ),
                }

            if caregiver.role != "caregiver":
                return {
                    "success": False,
                    "error": "Invalid caregiver role.",
                }

            if not caregiver.authorized:
                return {
                    "success": False,
                    "error": (
                        "Caregiver authorization is disabled."
                    ),
                }

            if not caregiver.notifications_enabled:
                return {
                    "success": False,
                    "error": (
                        "Caregiver notifications are disabled."
                    ),
                }

            notification = repository.create_notification(
                patient_user_id=patient_user_id,
                caregiver_id=caregiver_id,
                notification_type=notification_type,
                title=title,
                message=message,
                priority=priority,
            )

            return {
                "success": True,
                "notification_id": notification.id,
                "status": notification.status,
                "caregiver": caregiver.name,
                "title": notification.title,
                "priority": notification.priority,
                "created_at": (
                    notification.created_at.isoformat()
                ),
            }

        finally:
            session.close()