from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Case, Person, MatchResult, CaseResponse
from fastapi import Request
from uuid import uuid4

router = APIRouter()

@router.post("/", response_model=Case)
async def create_case(case: Case, request: Request):
    db = request.app.mongodb

    # Assign unique case_id if not provided
    if not case.case_id:
        case.case_id = str(uuid4())

    # Validate suspects exist
    for pid in case.suspects:
        person = await db.persons.find_one({"person_id": pid})
        if not person:
            raise HTTPException(status_code=400, detail=f"Suspect with person_id {pid} not found")

    # Save case to DB
    case_dict = case.dict()
    await db.cases.insert_one(case_dict)
    return case

@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(case_id: str, request: Request):
    db = request.app.mongodb
    case_data = await db.cases.find_one({"case_id": case_id})
    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found")

    suspects_ids = case_data.get("suspects", [])
    persons = []
    for pid in suspects_ids:
        person = await db.persons.find_one({"person_id": pid})
        if person:
            persons.append(Person(**person))

    # Dummy match results (empty)
    matches = []

    return CaseResponse(case=Case(**case_data), matches=matches)
