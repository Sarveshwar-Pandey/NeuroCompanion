from backend.db.database import SessionLocal
from backend.db.models import CaregiverProfile


def main() -> None:
    session = SessionLocal()

    try:
        existing = session.query(CaregiverProfile).filter_by(
            patient_user_id=1,
            name="Harpreet Sahu",
        ).first()

        if existing:
            print(
                f"Caregiver already exists. "
                f"ID: {existing.id}"
            )
            return

        caregiver = CaregiverProfile(
            patient_user_id=1,
            name="Harpreet Sahu",
            relationship_to_patient="daughter",
            role="caregiver",
            authorized=True,
            notifications_enabled=True,
            preferred_summary_frequency="daily",
        )

        session.add(caregiver)
        session.commit()
        session.refresh(caregiver)

        print(
            f"Caregiver seeded successfully. "
            f"ID: {caregiver.id}"
        )

    finally:
        session.close()


if __name__ == "__main__":
    main()