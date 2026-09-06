from datetime import datetime

from backend.db.database import SessionLocal
from backend.repositories.routine_repository import RoutineRepository


class RoutineService:

    def get_routine(self, user_id: int) -> list[dict]:

        session = SessionLocal()

        try:
            repository = RoutineRepository(session)

            items = repository.get_routine(user_id)

            return [
                {
                    "id": item.id,
                    "title": item.title,
                    "description": item.description,
                    "time": item.time_of_day,
                    "duration_minutes": item.duration_minutes,
                    "days_of_week": item.days_of_week,
                    "category": item.category,
                }
                for item in items
            ]

        finally:
            session.close()

    def get_tasks(self, user_id: int) -> list[dict]:

        session = SessionLocal()

        try:
            repository = RoutineRepository(session)

            tasks = repository.get_tasks(user_id)

            return [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "scheduled_for": (
                        task.scheduled_for.isoformat()
                        if task.scheduled_for
                        else None
                    ),
                    "status": task.status,
                    "priority": task.priority,
                }
                for task in tasks
            ]

        finally:
            session.close()

    def create_reminder(
        self,
        user_id: int,
        title: str,
        remind_at: datetime,
    ) -> dict:

        session = SessionLocal()

        try:
            repository = RoutineRepository(session)

            reminder = repository.create_reminder(
                user_id=user_id,
                title=title,
                remind_at=remind_at,
            )

            return {
                "id": reminder.id,
                "title": reminder.title,
                "remind_at": reminder.remind_at.isoformat(),
                "status": reminder.status,
            }

        finally:
            session.close()