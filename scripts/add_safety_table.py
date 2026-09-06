from backend.db.database import engine, Base
from backend.db.models import SafetyEvent


def main() -> None:
    print("Creating missing SafetyEvent table...")

    SafetyEvent.__table__.create(
        bind=engine,
        checkfirst=True,
    )

    print("SafetyEvent table: OK")


if __name__ == "__main__":
    main()