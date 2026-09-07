from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.activities import router as activities_router
from backend.api.routes.caregiver import router as caregiver_router
from backend.api.routes.chat import router as chat_router
from backend.api.routes.patient import router as patient_router
from backend.api.routes.safety import router as safety_router


app = FastAPI(
    title="NeuroCompanion API",
    description="Backend-for-Frontend for NeuroCompanion",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    return {
        "status": "ok",
        "service": "neurocompanion-api",
        "version": "0.1.0",
    }


app.include_router(chat_router)
app.include_router(patient_router)
app.include_router(activities_router)
app.include_router(safety_router)
app.include_router(caregiver_router)