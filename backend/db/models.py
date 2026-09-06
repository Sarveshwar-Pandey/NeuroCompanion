from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.db.database import Base


class MemoryType(str, Enum):
    FACT = "fact"
    PREFERENCE = "preference"
    EVENT = "event"
    EPISODE = "episode"
    RELATIONSHIP = "relationship"


class VerificationStatus(str, Enum):
    VERIFIED = "verified"
    USER_STATED = "user_stated"
    CAREGIVER_CONFIRMED = "caregiver_confirmed"
    INFERRED = "inferred"
    STALE = "stale"
    CONFLICTING = "conflicting"
    UNKNOWN = "unknown"


class SourceType(str, Enum):
    USER_STATEMENT = "user_statement"
    CAREGIVER_STATEMENT = "caregiver_statement"
    IMPORTED_RECORD = "imported_record"
    SYSTEM = "system"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    preferred_name: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    date_of_birth: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    gender: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    occupation: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    employer: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    retirement_year: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    state: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    primary_language: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    cognitive_support_level: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    profile_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    persons: Mapped[list["Person"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    memories: Mapped[list["Memory"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Person(Base):
    __tablename__ = "persons"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    aliases: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    user: Mapped["User"] = relationship(
        back_populates="persons",
    )


class Relationship(Base):
    __tablename__ = "relationships"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    person_id: Mapped[int] = mapped_column(
        ForeignKey("persons.id"),
        nullable=False,
    )

    relationship_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    verification_status: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=1.0,
    )


class Memory(Base):
    __tablename__ = "memories"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    memory_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    verification_status: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=1.0,
    )

    sensitivity: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="normal",
    )

    last_confirmed: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    observed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    valid_from: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    valid_until: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    user: Mapped["User"] = relationship(
        back_populates="memories",
    )

class RoutineItem(Base):
    __tablename__ = "routine_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    time_of_day: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    duration_minutes: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    days_of_week: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="daily",
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="routine",
    )

    active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    scheduled_for: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="pending",
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="normal",
    )


class Reminder(Base):
    __tablename__ = "reminders"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    remind_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="pending",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

class ActivityPerformance(Base):
    __tablename__ = "activity_performance"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    activity_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    activity_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    difficulty: Mapped[int] = mapped_column(
        nullable=False,
    )

    score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    duration_seconds: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    outcome: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    completed_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

class SafetyEvent(Base):
    __tablename__ = "safety_events"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    risk_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    risk_signals: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    recommended_next_step: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    human_review_required: Mapped[bool] = mapped_column(
        nullable=False,
        default=False,
    )

    source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="safety_triage",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

class CaregiverProfile(Base):
    __tablename__ = "caregiver_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)

    patient_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    relationship_to_patient: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="caregiver",
    )

    authorized: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )

    notifications_enabled: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )

    preferred_summary_frequency: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="daily",
    )


class CaregiverNotification(Base):
    __tablename__ = "caregiver_notifications"

    id: Mapped[int] = mapped_column(primary_key=True)

    patient_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    caregiver_id: Mapped[int] = mapped_column(
        ForeignKey("caregiver_profiles.id"),
        nullable=False,
    )

    notification_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="normal",
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="mocked",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )