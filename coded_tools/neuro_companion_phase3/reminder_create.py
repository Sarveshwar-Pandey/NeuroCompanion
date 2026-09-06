from datetime import datetime

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.routine.routine_service import RoutineService


class ReminderCreateTool(CodedTool):
    """
    Create a reminder for the user.
    """

    async def async_invoke(
        self,
        args: dict,
        sly_data: dict,
    ) -> dict:

        title = args.get("title")
        remind_at = args.get("remind_at")

        if not title:
            return {
                "success": False,
                "error": "title is required",
            }

        if not remind_at:
            return {
                "success": False,
                "error": "remind_at is required",
            }

        try:
            reminder_time = datetime.fromisoformat(
                remind_at
            )
        except ValueError:
            return {
                "success": False,
                "error": (
                    "remind_at must be an ISO datetime, "
                    "for example 2026-09-06T17:30:00"
                ),
            }

        user_id = 1

        service = RoutineService()

        reminder = service.create_reminder(
            user_id=user_id,
            title=title,
            remind_at=reminder_time,
        )

        return {
            "success": True,
            "reminder": reminder,
        }