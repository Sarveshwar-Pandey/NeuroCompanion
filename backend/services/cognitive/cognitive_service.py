import json
from pathlib import Path
from typing import Any

from backend.db.database import SessionLocal
from backend.repositories.cognitive_repository import CognitiveRepository


class CognitiveService:

    ACTIVITY_FILE = Path("data/activities/cognitive_activities.json")

    def get_activities(
        self,
        activity_type: str | None = None,
        difficulty: int | None = None,
    ) -> list[dict[str, Any]]:

        with self.ACTIVITY_FILE.open(
            "r",
            encoding="utf-8",
        ) as file:
            activities = json.load(file)

        if activity_type:
            activities = [
                activity
                for activity in activities
                if activity["activity_type"] == activity_type
            ]

        if difficulty is not None:
            activities = [
                activity
                for activity in activities
                if activity["difficulty"] == difficulty
            ]

        return activities

    def get_history(
        self,
        user_id: int,
        limit: int = 10,
    ) -> list[dict[str, Any]]:

        session = SessionLocal()

        try:
            repository = CognitiveRepository(session)

            records = repository.get_history(
                user_id=user_id,
                limit=limit,
            )

            return [
                {
                    "activity_id": record.activity_id,
                    "activity_type": record.activity_type,
                    "difficulty": record.difficulty,
                    "score": record.score,
                    "duration_seconds": record.duration_seconds,
                    "outcome": record.outcome,
                    "notes": record.notes,
                    "completed_at": record.completed_at.isoformat(),
                }
                for record in records
            ]

        finally:
            session.close()

    def log_performance(
        self,
        user_id: int,
        activity_id: str,
        activity_type: str,
        difficulty: int,
        score: float | None = None,
        duration_seconds: int | None = None,
        outcome: str | None = None,
        notes: str | None = None,
    ) -> dict[str, Any]:

        session = SessionLocal()

        try:
            repository = CognitiveRepository(session)

            record = repository.log_performance(
                user_id=user_id,
                activity_id=activity_id,
                activity_type=activity_type,
                difficulty=difficulty,
                score=score,
                duration_seconds=duration_seconds,
                outcome=outcome,
                notes=notes,
            )

            return {
                "id": record.id,
                "activity_id": record.activity_id,
                "activity_type": record.activity_type,
                "difficulty": record.difficulty,
                "score": record.score,
                "duration_seconds": record.duration_seconds,
                "outcome": record.outcome,
                "notes": record.notes,
                "completed_at": record.completed_at.isoformat(),
            }

        finally:
            session.close()