from backend.db.database import SessionLocal
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