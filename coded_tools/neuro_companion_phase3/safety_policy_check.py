from typing import Any, Dict

from neuro_san.interfaces.coded_tool import CodedTool

from backend.services.safety.policy_engine import evaluate_policy


class SafetyPolicyCheckTool(CodedTool):

    async def async_invoke(
        self,
        args: Dict[str, Any],
        sly_data: Dict[str, Any],
    ) -> Any:

        risk_level = str(
            args.get(
                "risk_level",
                "MODERATE",
            )
        )

        confidence = float(
            args.get(
                "confidence",
                0.0,
            )
        )

        risk_signals = str(
            args.get(
                "risk_signals",
                "",
            )
        )

        return evaluate_policy(
            risk_level=risk_level,
            confidence=confidence,
            risk_signals=risk_signals,
        )