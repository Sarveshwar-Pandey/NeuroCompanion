from typing import Any, Dict

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.caregiver.caregiver_service import (
    CaregiverService,
)


class CaregiverPreferencesTool(CodedTool):

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

        service = CaregiverService()

        return service.get_preferences(
            patient_user_id=user_id,
        )