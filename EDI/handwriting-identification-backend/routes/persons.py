from fastapi import APIRouter, HTTPException, Request, Depends
from models import Person
from typing import List
from .auth import require_auth

router = APIRouter()

@router.post("/", response_model=Person)
async def create_person(person: Person, request: Request, user=Depends(require_auth)):
    db = request.app.mongodb
    await db.persons.insert_one(person.model_dump())
    return person

@router.get("/", response_model=List[Person])
async def get_persons(request: Request, user=Depends(require_auth)):
    db = request.app.mongodb
    cursor = db.persons.find()
    persons = []
    async for person_data in cursor:
        persons.append(Person(**person_data))
    return persons

@router.get("/{person_id}", response_model=Person)
async def get_person(person_id: str, request: Request, user=Depends(require_auth)):
    db = request.app.mongodb
    person_data = await db.persons.find_one({"person_id": person_id})
    if not person_data:
        raise HTTPException(status_code=404, detail="Person not found")
    return Person(**person_data)
