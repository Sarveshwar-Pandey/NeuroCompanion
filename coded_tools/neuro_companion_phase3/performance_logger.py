from typing import Any, Dict

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.cognitive.cognitive_service import CognitiveService


class PerformanceLoggerTool(CodedTool):

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

        service = CognitiveService()

        result = service.log_performance(
            user_id=user_id,
            activity_id=args["activity_id"],
            activity_type=args["activity_type"],
            difficulty=int(args["difficulty"]),
            score=(
                float(args["score"])
                if args.get("score") is not None
                else None
            ),
            duration_seconds=(
                int(args["duration_seconds"])
                if args.get("duration_seconds") is not None
                else None
            ),
            outcome=args.get("outcome"),
            notes=args.get("notes"),
        )

        return result