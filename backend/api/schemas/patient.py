from pydantic import BaseModel


class PatientProfileResponse(BaseModel):
    success: bool
    id: int
    name: str
    age: int