from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.db.models import Person, Relationship


class MemoryRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_person(
        self,
        user_id: int,
        name_or_alias: str,
    ) -> Person | None:
        search = name_or_alias.strip().lower()

        statement = (
            select(Person)
            .where(Person.user_id == user_id)
            .where(
                (Person.name.ilike(search))
                | (Person.aliases.ilike(f"%{search}%"))
            )
        )

        return self.session.scalar(statement)

    def get_person_by_relationship(
        self,
        user_id: int,
        relationship_type: str,
    ) -> Person | None:
        search = relationship_type.strip().lower()

        statement = (
            select(Person)
            .join(
                Relationship,
                Relationship.person_id == Person.id,
            )
            .where(Person.user_id == user_id)
            .where(
                Relationship.relationship_type.ilike(search)
            )
        )

        return self.session.scalar(statement)

    def get_relationship(
        self,
        user_id: int,
        person_id: int,
    ) -> Relationship | None:
        statement = (
            select(Relationship)
            .where(Relationship.user_id == user_id)
            .where(Relationship.person_id == person_id)
        )

        return self.session.scalar(statement)