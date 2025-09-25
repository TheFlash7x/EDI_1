from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, UTC
from uuid import uuid4


class Person(BaseModel):
    person_id: str = Field(default_factory=lambda: str(uuid4()))
    gov_id: str
    name: str
    dob: Optional[datetime] = None
    photo: Optional[str] = None  # URL or path
    address: Optional[str] = None
    contact: Optional[str] = None


class HandwritingSample(BaseModel):
    sample_id: str = Field(default_factory=lambda: str(uuid4()))
    person_id: Optional[str] = None
    image_path: str
    date_uploaded: datetime = Field(default_factory=lambda: datetime.now(UTC))
    case_id: Optional[str] = None


class Case(BaseModel):
    case_id: str = Field(default_factory=lambda: str(uuid4()))
    case_name: str
    description: Optional[str] = None
    investigator_name: str
    suspects: List[str] = []  # List of person_ids
    evidence_sample_id: str


# Response models
class MatchResult(BaseModel):
    person_id: str
    similarity_score: float
    person_details: Person


class CaseResponse(BaseModel):
    case: Case
    matches: List[MatchResult]


class TrainingData(BaseModel):
    data_id: str = Field(default_factory=lambda: str(uuid4()))
    person_id: str
    image_path: str
    filename: str
    augmented: bool = False
    date_added: datetime = Field(default_factory=datetime.utcnow)


class ModelVersion(BaseModel):
    version_id: str = Field(default_factory=lambda: str(uuid4()))
    version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    model_path: str
    architecture: str
    training_data_count: int
