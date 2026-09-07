from sqlalchemy import select

from backend.db.database import SessionLocal
from backend.db.models import Memory, Person, Relationship
from backend.repositories.memory_repository import MemoryRepository


class MemoryService:

    def get_person(
        self,
        user_id: int,
        name_or_alias: str,
    ) -> dict | None:

        session = SessionLocal()

        try:
            repository = MemoryRepository(session)

            person = repository.get_person(
                user_id=user_id,
                name_or_alias=name_or_alias,
            )

            # If exact name/alias search fails,
            # try interpreting the input as a relationship.
            if person is None:
                person = repository.get_person_by_relationship(
                    user_id=user_id,
                    relationship_type=name_or_alias,
                )

            if person is None:
                return None

            relationship = repository.get_relationship(
                user_id=user_id,
                person_id=person.id,
            )

            return {
                "person_id": person.id,
                "name": person.name,
                "aliases": person.aliases,
                "relationship": (
                    relationship.relationship_type
                    if relationship
                    else None
                ),
                "verification_status": (
                    relationship.verification_status
                    if relationship
                    else None
                ),
                "confidence": (
                    relationship.confidence
                    if relationship
                    else None
                ),
                "source": (
                    relationship.source
                    if relationship
                    else None
                ),
            }

        finally:
            session.close()

    def list_people(self, user_id: int) -> list[dict]:
        session = SessionLocal()

        try:
            people = list(
                session.scalars(
                    select(Person).where(Person.user_id == user_id)
                ).all()
            )

            results: list[dict] = []

            for person in people:
                relationship = session.scalar(
                    select(Relationship)
                    .where(Relationship.user_id == user_id)
                    .where(Relationship.person_id == person.id)
                )

                verification = (
                    relationship.verification_status
                    if relationship
                    else None
                )

                results.append(
                    {
                        "person_id": person.id,
                        "name": person.name,
                        "relationship": (
                            _humanize(relationship.relationship_type)
                            if relationship
                            else None
                        ),
                        "certainty": _certainty_label(verification),
                    }
                )

            return results

        finally:
            session.close()

    def list_memories(self, user_id: int) -> list[dict]:
        session = SessionLocal()

        try:
            records = list(
                session.scalars(
                    select(Memory)
                    .where(Memory.user_id == user_id)
                    .order_by(Memory.created_at.desc())
                ).all()
            )

            return [
                {
                    "memory_id": record.id,
                    "section": _memory_section(
                        record.memory_type,
                        record.content,
                    ),
                    "content": record.content,
                    "certainty": _certainty_label(
                        record.verification_status
                    ),
                    "last_confirmed": (
                        record.last_confirmed.isoformat()
                        if record.last_confirmed
                        else None
                    ),
                }
                for record in records
            ]

        finally:
            session.close()


def _humanize(value: str) -> str:
    return value.replace("_", " ").strip().title()


def _certainty_label(status: str | None) -> str:
    if status in {
        "verified",
        "caregiver_confirmed",
        "user_stated",
    }:
        return "Last confirmed recently"

    if status in {"inferred", "unknown", "stale", "conflicting"}:
        return "Your companion isn't certain about this."

    return "Remembered for you"


def _memory_section(memory_type: str, content: str) -> str:
    lowered = content.lower()

    if memory_type == "preference":
        return "help"

    if memory_type == "event":
        return "events"

    if memory_type == "episode":
        return "recent"

    if memory_type == "relationship":
        return "people"

    place_markers = (
        "lucknow",
        "home",
        "market",
        "station",
        "neighbourhood",
        "neighborhood",
        "place",
    )

    if any(marker in lowered for marker in place_markers):
        return "places"

    return "facts"
