from backend.db.database import SessionLocal
from backend.db.models import RoutineItem


ROUTINE = [
    ("Wake up", "06:30", 15, "daily", "morning"),
    ("Have morning tea", "07:00", 20, "daily", "morning"),
    ("Read the newspaper", "07:30", 30, "daily", "morning"),
    ("Morning walk", "08:00", 30, "daily", "exercise"),
    ("Breakfast", "09:00", 30, "daily", "meal"),
    ("Lunch", "13:00", 30, "daily", "meal"),
    ("Rest", "13:30", 45, "daily", "rest"),
    ("Evening walk", "17:30", 30, "daily", "exercise"),
    ("Dinner", "20:00", 30, "daily", "meal"),
    ("Prepare for bed", "21:30", 30, "daily", "evening"),
    ("Sleep", "22:00", 480, "daily", "sleep"),
]


def main():

    session = SessionLocal()

    try:

        existing = session.query(RoutineItem).filter(
            RoutineItem.user_id == 1
        ).all()

        for item in existing:
            session.delete(item)

        session.commit()

        for (
            title,
            time_of_day,
            duration,
            days,
            category,
        ) in ROUTINE:

            item = RoutineItem(
                user_id=1,
                title=title,
                time_of_day=time_of_day,
                duration_minutes=duration,
                days_of_week=days,
                category=category,
                active=True,
            )

            session.add(item)

        session.commit()

        print("Routine seeded successfully.")

        items = session.query(RoutineItem).filter(
            RoutineItem.user_id == 1
        ).order_by(
            RoutineItem.time_of_day
        ).all()

        for item in items:
            print(
                f"{item.time_of_day} - "
                f"{item.title}"
            )

    finally:
        session.close()


if __name__ == "__main__":
    main()