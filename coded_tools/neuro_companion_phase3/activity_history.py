from typing import Any, Dict

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.cognitive.cognitive_service import CognitiveService


class ActivityHistoryTool(CodedTool):

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

        limit = int(args.get("limit", 10))

        service = CognitiveService()

        history = service.get_history(
            user_id=user_id,
            limit=limit,
        )

        return {
            "user_id": user_id,
            "count": len(history),
            "history": history,
        }