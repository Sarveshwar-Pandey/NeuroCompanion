from backend.services.caregiver.caregiver_service import (
    CaregiverService,
)


def main() -> None:
    service = CaregiverService()

    print("\n=== CAREGIVER PREFERENCES ===")

    preferences = service.get_preferences(
        patient_user_id=1,
    )

    print(preferences)

    print("\n=== DAILY EVENTS ===")

    daily = service.get_daily_events(
        patient_user_id=1,
    )

    print(daily)

    print("\n=== WEEKLY TRENDS ===")

    weekly = service.get_weekly_trends(
        patient_user_id=1,
    )

    print(weekly)

    print("\n=== MOCK NOTIFICATION ===")

    caregiver_id = preferences.get("caregiver_id")

    if caregiver_id:
        notification = service.send_notification(
            patient_user_id=1,
            caregiver_id=caregiver_id,
            notification_type="daily_summary",
            title="Daily NeuroCompanion Summary",
            message=(
                "Synthetic caregiver notification "
                "for testing."
            ),
            priority="normal",
        )

        print(notification)

    print("\n=== COMPLETE ===")


if __name__ == "__main__":
    main()