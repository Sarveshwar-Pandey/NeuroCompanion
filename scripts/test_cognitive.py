from backend.services.cognitive.cognitive_service import CognitiveService


def main() -> None:
    service = CognitiveService()

    print("\n=== ACTIVITIES ===")

    activities = service.get_activities()

    for activity in activities:
        print(
            activity["id"],
            "|",
            activity["activity_type"],
            "| difficulty:",
            activity["difficulty"],
            "|",
            activity["title"],
        )

    print("\n=== HISTORY ===")

    history = service.get_history(
        user_id=1,
    )

    print(history)

    print("\n=== LOG PERFORMANCE ===")

    result = service.log_performance(
        user_id=1,
        activity_id="rem_001",
        activity_type="reminiscence",
        difficulty=1,
        score=0.8,
        duration_seconds=420,
        outcome="completed",
        notes="User successfully recalled a family member.",
    )

    print(result)

    print("\n=== HISTORY AFTER LOGGING ===")

    history = service.get_history(
        user_id=1,
    )

    for item in history:
        print(item)


if __name__ == "__main__":
    main()