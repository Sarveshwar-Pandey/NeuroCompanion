from backend.services.safety.safety_service import SafetyService


def main() -> None:
    service = SafetyService()

    print("\n=== BASELINE ===")

    baseline = service.get_baseline(
        user_id=1,
    )

    print(baseline)

    print("\n=== RECENT EVENTS ===")

    events = service.get_recent_events(
        user_id=1,
        limit=5,
    )

    print(events)

    print("\n=== CREATE SAFETY EVENT ===")

    result = service.create_escalation(
        user_id=1,
        risk_level="MODERATE",
        reason="Synthetic test event.",
        confidence=0.80,
        risk_signals="repeated_confusion",
        recommended_next_step="VERIFY",
        human_review_required=True,
    )

    print(result)

    print("\n=== LOGGED SAFETY EVENTS ===")

    logged = service.get_logged_events(
        user_id=1,
        limit=5,
    )

    for event in logged:
        print(event)


if __name__ == "__main__":
    main()