from backend.db.database import Base, engine
from backend.db import models  # noqa: F401


def main() -> None:
    print("Creating database...")
    print(f"Database URL: {engine.url}")

    Base.metadata.create_all(bind=engine)

    print("Database created successfully.")


if __name__ == "__main__":
    main()