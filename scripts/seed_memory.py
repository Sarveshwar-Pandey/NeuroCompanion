from datetime import datetime

from backend.db.database import SessionLocal
from backend.db.models import (
    Memory,
    MemoryType,
    Person,
    Relationship,
    SourceType,
    User,
    VerificationStatus,
)


def add_person(
    session,
    user,
    name,
    relationship_type,
    aliases=None,
    source=SourceType.CAREGIVER_STATEMENT.value,
    verification=VerificationStatus.VERIFIED.value,
    confidence=0.98,
):
    person = Person(
        user_id=user.id,
        name=name,
        aliases=aliases,
    )

    session.add(person)
    session.flush()

    relationship = Relationship(
        user_id=user.id,
        person_id=person.id,
        relationship_type=relationship_type,
        source=source,
        verification_status=verification,
        confidence=confidence,
    )

    session.add(relationship)

    return person


def add_memory(
    session,
    user,
    memory_type,
    content,
    source=SourceType.CAREGIVER_STATEMENT.value,
    verification_status=VerificationStatus.CAREGIVER_CONFIRMED.value,
    confidence=0.95,
    sensitivity="personal",
    observed_at=None,
    valid_from=None,
    valid_until=None,
    last_confirmed=None,
):
    memory = Memory(
        user_id=user.id,
        memory_type=memory_type,
        content=content,
        source=source,
        verification_status=verification_status,
        confidence=confidence,
        sensitivity=sensitivity,
        observed_at=observed_at,
        valid_from=valid_from,
        valid_until=valid_until,
        last_confirmed=last_confirmed,
    )

    session.add(memory)


def main() -> None:
    session = SessionLocal()

    try:
        # ============================================================
        # 1. USER PROFILE
        # ============================================================

        user = User(
            name="Sukhvinder Sahu",
            preferred_name="Sukhvinder",
            date_of_birth=datetime(1956, 3, 18),
            gender="Male",
            occupation="Retired Senior Technician",
            employer="Indian Railways",
            retirement_year=2016,
            city="Lucknow",
            state="Uttar Pradesh",
            primary_language="Hindi",
            cognitive_support_level=(
                "Synthetic cognitive-support scenario: "
                "mild cognitive impairment / early-dementia-style needs"
            ),
            profile_notes=(
                "Synthetic demonstration profile for NeuroCompanion. "
                "Sukhvinder benefits from predictable routines, short explanations, "
                "gentle reminders, repetition when needed, and confirmation of "
                "important facts before they are treated as current."
            ),
        )

        session.add(user)
        session.flush()

        # ============================================================
        # 2. FAMILY / PEOPLE
        # ============================================================

        harjit = add_person(
            session,
            user,
            "Harjit Kaur",
            "spouse",
            aliases="wife",
        )

        harpreet = add_person(
            session,
            user,
            "Harpreet Sahu",
            "daughter",
            aliases="Harpreet, elder daughter",
        )

        manpreet = add_person(
            session,
            user,
            "Manpreet Sahu",
            "son",
            aliases="Manpreet, son",
        )

        simran = add_person(
            session,
            user,
            "Simran Sahu",
            "daughter",
            aliases="Simran, younger daughter",
        )

        aarav = add_person(
            session,
            user,
            "Aarav Sahu",
            "grandson",
            aliases="Aarav",
        )

        meher = add_person(
            session,
            user,
            "Meher Sahu",
            "granddaughter",
            aliases="Meher",
        )

        # ============================================================
        # 3. PERSONAL FACTS
        # ============================================================

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder Sahu was born on 18 March 1956.",
            verification_status=VerificationStatus.VERIFIED.value,
            confidence=1.0,
            sensitivity="personal",
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder is 70 years old as of September 2026.",
            verification_status=VerificationStatus.VERIFIED.value,
            confidence=1.0,
            sensitivity="personal",
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder lives in Lucknow, Uttar Pradesh.",
            verification_status=VerificationStatus.CAREGIVER_CONFIRMED.value,
            confidence=0.98,
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder's primary language is Hindi.",
            verification_status=VerificationStatus.USER_STATED.value,
            confidence=0.95,
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder understands Punjabi and basic English.",
            verification_status=VerificationStatus.USER_STATED.value,
            confidence=0.90,
        )

        # ============================================================
        # 4. FAMILY MEMORIES
        # ============================================================

        add_memory(
            session,
            user,
            MemoryType.RELATIONSHIP.value,
            "Harjit Kaur is Sukhvinder's wife.",
        )

        add_memory(
            session,
            user,
            MemoryType.RELATIONSHIP.value,
            "Harpreet Sahu is Sukhvinder's eldest daughter.",
        )

        add_memory(
            session,
            user,
            MemoryType.RELATIONSHIP.value,
            "Manpreet Sahu is Sukhvinder's son.",
        )

        add_memory(
            session,
            user,
            MemoryType.RELATIONSHIP.value,
            "Simran Sahu is Sukhvinder's younger daughter.",
        )

        add_memory(
            session,
            user,
            MemoryType.RELATIONSHIP.value,
            "Aarav Sahu is Sukhvinder's grandson.",
        )

        add_memory(
            session,
            user,
            MemoryType.RELATIONSHIP.value,
            "Meher Sahu is Sukhvinder's granddaughter.",
        )

        add_memory(
            session,
            user,
            MemoryType.PREFERENCE.value,
            "Sukhvinder prefers family members to explain important information calmly and one point at a time.",
        )

        add_memory(
            session,
            user,
            MemoryType.PREFERENCE.value,
            "Sukhvinder likes being addressed by his first name, Sukhvinder.",
        )

        # ============================================================
        # 5. RAILWAY CAREER
        # ============================================================

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder worked for Indian Railways.",
            verification_status=VerificationStatus.VERIFIED.value,
            confidence=1.0,
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder worked as a Senior Technician in the Electrical Department of Indian Railways.",
            verification_status=VerificationStatus.CAREGIVER_CONFIRMED.value,
            confidence=0.95,
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder began his railway career in 1982.",
            verification_status=VerificationStatus.CAREGIVER_CONFIRMED.value,
            confidence=0.95,
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder retired from Indian Railways in 2016.",
            verification_status=VerificationStatus.VERIFIED.value,
            confidence=1.0,
        )

        add_memory(
            session,
            user,
            MemoryType.EPISODE.value,
            "Sukhvinder often talks proudly about railway maintenance work and the responsibility of keeping electrical systems safe.",
        )

        add_memory(
            session,
            user,
            MemoryType.PREFERENCE.value,
            "Sukhvinder enjoys talking about Indian Railways, railway stations, old train journeys, and stories from his working years.",
        )

        # ============================================================
        # 6. IMPORTANT LIFE EVENTS
        # ============================================================

        add_memory(
            session,
            user,
            MemoryType.EVENT.value,
            "Sukhvinder married Harjit Kaur in 1982.",
            observed_at=datetime(1982, 1, 1),
        )

        add_memory(
            session,
            user,
            MemoryType.EVENT.value,
            "Sukhvinder retired from railway service in 2016 after a long career.",
            observed_at=datetime(2016, 1, 1),
        )

        add_memory(
            session,
            user,
            MemoryType.EVENT.value,
            "Sukhvinder celebrated a family housewarming after moving into his current Lucknow home.",
            observed_at=datetime(2004, 6, 1),
        )

        add_memory(
            session,
            user,
            MemoryType.EPISODE.value,
            "Sukhvinder remembers a family trip to Amritsar and particularly enjoyed visiting the Golden Temple.",
            observed_at=datetime(2019, 11, 1),
        )

        add_memory(
            session,
            user,
            MemoryType.EPISODE.value,
            "Sukhvinder enjoys remembering his early railway training and the first time he was trusted with an important technical assignment.",
            confidence=0.90,
        )

        # ============================================================
        # 7. DAILY ROUTINE
        # ============================================================

        routine_memories = [
            "Sukhvinder usually wakes around 6:30 AM.",
            "He normally drinks tea shortly after waking.",
            "He usually reads the newspaper after morning tea.",
            "He generally goes for a morning walk around 8:00 AM.",
            "He usually eats breakfast around 9:00 AM.",
            "He generally eats lunch around 1:00 PM.",
            "He prefers a short afternoon rest after lunch.",
            "He usually takes an evening walk around 5:30 PM.",
            "He usually has dinner around 8:00 PM.",
            "He normally starts preparing for bed around 9:30 PM.",
            "He usually goes to sleep around 10:00 PM.",
        ]

        for content in routine_memories:
            add_memory(
                session,
                user,
                MemoryType.PREFERENCE.value,
                content,
            )

        # ============================================================
        # 8. FOOD / PREFERENCES
        # ============================================================

        preferences = [
            "Sukhvinder prefers tea over coffee.",
            "He likes lightly spiced home-cooked meals.",
            "He enjoys dal, roti, rice, seasonal vegetables, and curd.",
            "He likes simple breakfasts rather than heavy breakfasts.",
            "He enjoys oranges, bananas, guava, and grapes.",
            "He likes listening to old Hindi film songs.",
            "He enjoys watching railway documentaries and old family videos.",
            "He prefers familiar places and becomes uncomfortable with sudden changes to his routine.",
        ]

        for content in preferences:
            add_memory(
                session,
                user,
                MemoryType.PREFERENCE.value,
                content,
            )

        # ============================================================
        # 9. COGNITIVE-SUPPORT OBSERVATIONS
        # ============================================================

        cognitive_memories = [
            (
                "Sukhvinder sometimes repeats a question when the same information "
                "has not been written down or clearly explained."
            ),
            (
                "Sukhvinder can remember many older life events clearly but may "
                "have difficulty recalling a recent appointment or conversation."
            ),
            (
                "Sukhvinder sometimes forgets the exact day or date and benefits "
                "from having the current date shown explicitly."
            ),
            (
                "Sukhvinder occasionally misplaces everyday items such as keys, "
                "his glasses, or his phone."
            ),
            (
                "Sukhvinder usually recognizes close family members even when he "
                "is unsure about a recent event."
            ),
            (
                "Sukhvinder responds better to short, concrete instructions than "
                "to several instructions delivered at once."
            ),
            (
                "When confused, Sukhvinder benefits from reassurance and a simple "
                "next step rather than a long explanation."
            ),
            (
                "Sukhvinder should not be expected to remember important appointments "
                "without a reminder or written support."
            ),
        ]

        for content in cognitive_memories:
            add_memory(
                session,
                user,
                MemoryType.FACT.value,
                content,
                source=SourceType.CAREGIVER_STATEMENT.value,
                verification_status=VerificationStatus.CAREGIVER_CONFIRMED.value,
                confidence=0.92,
                sensitivity="health",
            )

        # ============================================================
        # 10. SAFETY / SUPPORT
        # ============================================================

        safety_memories = [
            "Sukhvinder no longer drives.",
            "Harpreet helps Sukhvinder keep track of medical and other appointments.",
            "Manpreet helps with banking, bills, and important administrative tasks.",
            "Simran regularly checks in by phone and visits when possible.",
            "The family prefers reminders before important appointments rather than last-minute notifications.",
            "For an unfamiliar or urgent situation, the system should encourage Sukhvinder to contact a trusted family member rather than making an independent decision.",
            "Exact medication names and doses are not currently stored in the demo profile.",
            "Known allergy information has not been verified in the demo profile.",
        ]

        for content in safety_memories:
            verification = (
                VerificationStatus.UNKNOWN.value
                if "not currently stored" in content
                or "has not been verified" in content
                else VerificationStatus.CAREGIVER_CONFIRMED.value
            )

            add_memory(
                session,
                user,
                MemoryType.FACT.value,
                content,
                verification_status=verification,
                confidence=0.95 if verification != "unknown" else 0.0,
                sensitivity="health" if (
                    "medication" in content.lower()
                    or "allergy" in content.lower()
                ) else "safety",
            )

        # ============================================================
        # 11. FAMILY SUPPORT RESPONSIBILITIES
        # ============================================================

        support_memories = [
            "Harpreet is the primary family contact for appointments and general care coordination.",
            "Manpreet helps Sukhvinder with financial and administrative matters.",
            "Simran provides emotional support and frequent phone contact.",
            "Harpreet prefers to receive important caregiver updates when Sukhvinder has repeated confusion about the same issue.",
            "The family wants Sukhvinder to remain as independent as safely possible.",
        ]

        for content in support_memories:
            add_memory(
                session,
                user,
                MemoryType.FACT.value,
                content,
                sensitivity="caregiver",
            )

        # ============================================================
        # 12. PLACES AND FAMILIAR CONTEXT
        # ============================================================

        place_memories = [
            "Sukhvinder is most comfortable at his home in Lucknow.",
            "The local neighborhood market is a familiar place for Sukhvinder.",
            "Sukhvinder enjoys visiting a nearby park for his evening walk.",
            "Sukhvinder associates railway stations with important memories from his working life.",
        ]

        for content in place_memories:
            add_memory(
                session,
                user,
                MemoryType.FACT.value,
                content,
            )

        # ============================================================
        # 13. UNCERTAINTY / DEMO RED-TEAM DATA
        # ============================================================

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "Sukhvinder may have previously said that he worked at a specific railway division office, but the exact office location has not been independently confirmed.",
            source=SourceType.USER_STATEMENT.value,
            verification_status=VerificationStatus.UNKNOWN.value,
            confidence=0.0,
            sensitivity="personal",
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "An older family note lists Sukhvinder as preferring very early morning walks at 6:00 AM, but the current routine is around 8:00 AM.",
            source=SourceType.IMPORTED_RECORD.value,
            verification_status=VerificationStatus.STALE.value,
            confidence=0.60,
            sensitivity="personal",
        )

        add_memory(
            session,
            user,
            MemoryType.FACT.value,
            "The exact date of Sukhvinder and Harjit's wedding anniversary has not been confirmed beyond the year 1982.",
            verification_status=VerificationStatus.UNKNOWN.value,
            confidence=0.0,
            sensitivity="personal",
        )

        session.commit()

        print("Sukhvinder Sahu seed completed successfully.")
        print(f"User ID: {user.id}")
        print("Created family relationships, life history, routines, preferences,")
        print("cognitive-support observations, safety information, and uncertainty cases.")

    except Exception:
        session.rollback()
        raise

    finally:
        session.close()


if __name__ == "__main__":
    main()