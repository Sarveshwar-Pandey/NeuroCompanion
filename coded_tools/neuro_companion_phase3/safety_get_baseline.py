from typing import Any, Dict

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.safety.safety_service import SafetyService


class SafetyGetBaselineTool(CodedTool):

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

        service = SafetyService()

        return service.get_baseline(
            user_id=user_id,
        )