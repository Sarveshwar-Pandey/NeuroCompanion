from typing import Any, Dict

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.safety.safety_service import SafetyService


class SafetyEscalationCreateTool(CodedTool):

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

        return service.create_escalation(
            user_id=user_id,
            risk_level=str(args["risk_level"]),
            reason=str(args["reason"]),
            confidence=float(args["confidence"]),
            risk_signals=str(
                args.get(
                    "risk_signals",
                    "",
                )
            ),
            recommended_next_step=str(
                args["recommended_next_step"]
            ),
            human_review_required=bool(
                args["human_review_required"]
            ),
        )