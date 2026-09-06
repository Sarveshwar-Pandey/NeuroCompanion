from typing import Any, Dict

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.caregiver.caregiver_service import (
    CaregiverService,
)


class NotificationSendTool(CodedTool):

    async def async_invoke(
        self,
        args: Dict[str, Any],
        sly_data: Dict[str, Any],
    ) -> Any:

        user_id = int(
            args.get(
                "user_id",
                sly_data.get("user_id", 1),
            )
        )

        caregiver_id = int(args["caregiver_id"])

        service = CaregiverService()

        return service.send_notification(
            patient_user_id=user_id,
            caregiver_id=caregiver_id,
            notification_type=str(
                args["notification_type"]
            ),
            title=str(args["title"]),
            message=str(args["message"]),
            priority=str(
                args.get("priority", "normal")
            ),
        )