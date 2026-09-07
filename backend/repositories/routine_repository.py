from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.db.models import Reminder, RoutineItem, Task


class RoutineRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_routine(
        self,
        user_id: int,
    ) -> list[RoutineItem]:
        statement = (
            select(RoutineItem)
            .where(RoutineItem.user_id == user_id)
            .where(RoutineItem.active.is_(True))
            .order_by(RoutineItem.time_of_day)
        )

        return list(self.session.scalars(statement).all())

    def get_tasks(
        self,
        user_id: int,
    ) -> list[Task]:
        statement = (
            select(Task)
            .where(Task.user_id == user_id)
            .where(Task.status == "pending")
            .order_by(Task.scheduled_for)
        )

        return list(self.session.scalars(statement).all())

    def get_pending_reminders(
        self,
        user_id: int,
    ) -> list[Reminder]:
        statement = (
            select(Reminder)
            .where(Reminder.user_id == user_id)
            .where(Reminder.status == "pending")
            .order_by(Reminder.remind_at)
        )

        return list(self.session.scalars(statement).all())

    def create_reminder(
        self,
        user_id: int,
        title: str,
        remind_at: datetime,
    ) -> Reminder:
        reminder = Reminder(
            user_id=user_id,
            title=title,
            remind_at=remind_at,
            status="pending",
        )

        self.session.add(reminder)
        self.session.commit()
        self.session.refresh(reminder)

        return reminder