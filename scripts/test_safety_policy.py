from backend.services.safety.policy_engine import evaluate_policy


def main() -> None:

    tests = [
        (
            "LOW",
            0.95,
            "",
        ),
        (
            "MODERATE",
            0.80,
            "repeated_confusion",
        ),
        (
            "HIGH",
            0.85,
            "lost_orientation",
        ),
        (
            "EMERGENCY",
            0.90,
            "immediate danger",
        ),
        (
            "LOW",
            0.95,
            "fall",
        ),
        (
            "garbage",
            0.30,
            "",
        ),
    ]

    for risk_level, confidence, signals in tests:

        result = evaluate_policy(
            risk_level=risk_level,
            confidence=confidence,
            risk_signals=signals,
        )

        print(
            f"{risk_level:10} | "
            f"{signals or 'none':25} | "
            f"{result['action']:22} | "
            f"review={result['human_review_required']}"
        )


if __name__ == "__main__":
    main()