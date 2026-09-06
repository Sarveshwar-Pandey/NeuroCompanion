from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.db.models import (
    ActivityPerformance,
    CaregiverNotification,
    CaregiverProfile,
    Reminder,
    RoutineItem,
    SafetyEvent,
    Task,
)


class CaregiverRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_authorized_caregiver(
        self,
        patient_user_id: int,
    ) -> CaregiverProfile | None:
        statement = (
            select(CaregiverProfile)
            .where(
                CaregiverProfile.patient_user_id
                == patient_user_id
            )
            .where(CaregiverProfile.role == "caregiver")
            .where(CaregiverProfile.authorized.is_(True))
            .order_by(CaregiverProfile.id)
        )

        return self.session.scalar(statement)

    def get_daily_data(
        self,
        patient_user_id: int,
    ) -> dict:
        now = datetime.now()
        start_of_day = datetime(
            now.year,
            now.month,
            now.day,
        )

        safety_events = list(
            self.session.scalars(
                select(SafetyEvent)
                .where(
                    SafetyEvent.user_id
                    == patient_user_id
                )
                .where(
                    SafetyEvent.created_at
                    >= start_of_day
                )
                .order_by(
                    SafetyEvent.created_at.desc()
                )
            ).all()
        )

        activities = list(
            self.session.scalars(
                select(ActivityPerformance)
                .where(
                    ActivityPerformance.user_id
                    == patient_user_id
                )
                .where(
                    ActivityPerformance.completed_at
                    >= start_of_day
                )
                .order_by(
                    ActivityPerformance.completed_at.desc()
                )
            ).all()
        )

        tasks = list(
            self.session.scalars(
                select(Task)
                .where(
                    Task.user_id
                    == patient_user_id
                )
                .where(
                    Task.status == "pending"
                )
                .order_by(Task.scheduled_for)
            ).all()
        )

        reminders = list(
            self.session.scalars(
                select(Reminder)
                .where(
                    Reminder.user_id
                    == patient_user_id
                )
                .where(
                    Reminder.status == "pending"
                )
                .order_by(Reminder.remind_at)
            ).all()
        )

        routines = list(
            self.session.scalars(
                select(RoutineItem)
                .where(
                    RoutineItem.user_id
                    == patient_user_id
                )
                .where(
                    RoutineItem.active.is_(True)
                )
                .order_by(RoutineItem.time_of_day)
            ).all()
        )

        return {
            "date": now.date().isoformat(),
            "safety_events": safety_events,
            "activities": activities,
            "tasks": tasks,
            "reminders": reminders,
            "routines": routines,
        }

    def get_weekly_data(
        self,
        patient_user_id: int,
    ) -> dict:
        now = datetime.now()
        start = now - timedelta(days=7)

        safety_events = list(
            self.session.scalars(
                select(SafetyEvent)
                .where(
                    SafetyEvent.user_id
                    == patient_user_id
                )
                .where(
                    SafetyEvent.created_at >= start
                )
                .order_by(
                    SafetyEvent.created_at.desc()
                )
            ).all()
        )

        activities = list(
            self.session.scalars(
                select(ActivityPerformance)
                .where(
                    ActivityPerformance.user_id
                    == patient_user_id
                )
                .where(
                    ActivityPerformance.completed_at >= start
                )
                .order_by(
                    ActivityPerformance.completed_at.desc()
                )
            ).all()
        )

        tasks = list(
            self.session.scalars(
                select(Task)
                .where(
                    Task.user_id
                    == patient_user_id
                )
                .where(
                    Task.status == "pending"
                )
                .order_by(Task.scheduled_for)
            ).all()
        )

        reminders = list(
            self.session.scalars(
                select(Reminder)
                .where(
                    Reminder.user_id
                    == patient_user_id
                )
                .where(
                    Reminder.status == "pending"
                )
                .order_by(Reminder.remind_at)
            ).all()
        )

        return {
            "period_start": start.isoformat(),
            "period_end": now.isoformat(),
            "safety_events": safety_events,
            "activities": activities,
            "pending_tasks": tasks,
            "pending_reminders": reminders,
        }

    def create_notification(
        self,
        patient_user_id: int,
        caregiver_id: int,
        notification_type: str,
        title: str,
        message: str,
        priority: str,
    ) -> CaregiverNotification:
        notification = CaregiverNotification(
            patient_user_id=patient_user_id,
            caregiver_id=caregiver_id,
            notification_type=notification_type,
            title=title,
            message=message,
            priority=priority,
            status="mocked",
        )

        self.session.add(notification)
        self.session.commit()
        self.session.refresh(notification)

        return notification

    def get_notifications(
        self,
        patient_user_id: int,
        limit: int = 10,
    ) -> list[CaregiverNotification]:
        statement = (
            select(CaregiverNotification)
            .where(
                CaregiverNotification.patient_user_id
                == patient_user_id
            )
            .order_by(
                CaregiverNotification.created_at.desc()
            )
            .limit(limit)
        )

        return list(self.session.scalars(statement).all())