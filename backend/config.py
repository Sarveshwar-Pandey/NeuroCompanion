from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATABASE_PATH = PROJECT_ROOT / "data" / "neuro_companion.db"

NEURO_SAN_AGENT = "neuro_companion_phase3"

DEV_USER_ID = 1
DEV_ACTOR_ID = 1
DEV_ROLE = "patient"