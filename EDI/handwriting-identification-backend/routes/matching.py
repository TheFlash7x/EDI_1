from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import MatchResult
from ai_model import match_handwriting, extract_features
from utils import get_image_features
from fastapi import Request
from .auth import require_auth

router = APIRouter()

@router.post("/match/{case_id}", response_model=List[MatchResult])
async def match_case(case_id: str, request: Request, user=Depends(require_auth)):
    db = request.app.mongodb

    # Get case
    case_data = await db.cases.find_one({"case_id": case_id})
    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found")

    evidence_sample_id = case_data["evidence_sample_id"]
    suspects_ids = case_data["suspects"]

    # Get evidence features
    evidence_sample = await db.samples.find_one({"sample_id": evidence_sample_id})
    if not evidence_sample:
        raise HTTPException(status_code=404, detail="Evidence sample not found")

    evidence_features = get_image_features(evidence_sample["image_path"])

    # Get suspect features
    suspect_features = []
    for pid in suspects_ids:
        samples = await db.samples.find({"person_id": pid}).to_list(length=None)
        if samples:
            # Use the first sample for simplicity
            features = get_image_features(samples[0]["image_path"])
            suspect_features.append((pid, features))

    # Perform matching
    matches = match_handwriting(evidence_features, suspect_features)

    # Build response
    results = []
    for person_id, score in matches:
        person_data = await db.persons.find_one({"person_id": person_id})
        if person_data:
            from models import Person
            person = Person(**person_data)
            results.append(MatchResult(
                person_id=person_id,
                similarity_score=score,
                person_details=person
            ))

    return results
