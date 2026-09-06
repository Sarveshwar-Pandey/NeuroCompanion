from typing import Any, Dict

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.cognitive.cognitive_service import CognitiveService


class ActivityStoreTool(CodedTool):

    async def async_invoke(
        self,
        args: Dict[str, Any],
        sly_data: Dict[str, Any],
    ) -> Any:

        service = CognitiveService()

        activity_type = args.get("activity_type")
        difficulty = args.get("difficulty")

        activities = service.get_activities(
            activity_type=activity_type,
            difficulty=difficulty,
        )

        return {
            "count": len(activities),
            "activities": activities,
        }