from backend.db.database import Base, engine
from backend.db import models  # noqa: F401


def main() -> None:
    """Create any missing database tables defined by SQLAlchemy models."""
    Base.metadata.create_all(bind=engine)

    print("Database table creation completed.")
    print(f"Database: {engine.url}")


if __name__ == "__main__":
    main()