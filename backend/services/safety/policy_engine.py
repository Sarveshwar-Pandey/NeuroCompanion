CRITICAL_SIGNALS = {
    "fall",
    "unconscious",
    "severe injury",
    "difficulty breathing",
    "chest pain",
    "immediate danger",
    "suicidal",
    "self harm",
}


def evaluate_policy(
    risk_level: str,
    confidence: float,
    risk_signals: str | None = None,
) -> dict:
    normalized_risk = risk_level.strip().upper()

    signals = {
        signal.strip().lower()
        for signal in (risk_signals or "").split(",")
        if signal.strip()
    }

    # Deterministic hard override.
    # The LLM cannot downgrade an explicitly critical signal.
    if signals.intersection(CRITICAL_SIGNALS):
        return {
            "risk_level": "EMERGENCY",
            "action": "EMERGENCY_HUMAN_PATH",
            "human_review_required": True,
            "reason": (
                "A critical safety signal was detected. "
                "Human review is required immediately."
            ),
        }

    if normalized_risk == "LOW":
        return {
            "risk_level": "LOW",
            "action": "ASSIST",
            "human_review_required": False,
            "reason": "No significant immediate safety concern detected.",
        }

    if normalized_risk == "MODERATE":
        return {
            "risk_level": "MODERATE",
            "action": "VERIFY",
            "human_review_required": True,
            "reason": (
                "The situation may require verification "
                "or additional context."
            ),
        }

    if normalized_risk == "HIGH":
        return {
            "risk_level": "HIGH",
            "action": "CAREGIVER",
            "human_review_required": True,
            "reason": (
                "The situation indicates a significant concern "
                "requiring caregiver review."
            ),
        }

    if normalized_risk == "EMERGENCY":
        return {
            "risk_level": "EMERGENCY",
            "action": "EMERGENCY_HUMAN_PATH",
            "human_review_required": True,
            "reason": (
                "The situation may represent an immediate safety "
                "concern and requires a human response."
            ),
        }

    # Unknown or malformed model output is never treated as safe.
    return {
        "risk_level": "MODERATE",
        "action": "VERIFY",
        "human_review_required": True,
        "reason": (
            "The safety assessment was unclear, so verification "
            "is required."
        ),
    }