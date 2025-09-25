from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Form
from typing import List, Optional
from models import HandwritingSample
from utils import save_uploaded_image, preprocess_handwriting_image
from fastapi import Request
from uuid import uuid4
import os
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = "uploads"
PROCESSED_DIR = "processed"

@router.post("/upload", response_model=HandwritingSample)
async def upload_sample(
    file: UploadFile = File(...),
    person_id: Optional[str] = Form(None),
    case_id: Optional[str] = Form(None),
    request: Request = None
):
    # Ensure upload directories exist
    Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    Path(PROCESSED_DIR).mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid4()}{file_ext}"
    upload_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save uploaded file
    with open(upload_path, "wb") as buffer:
        buffer.write(await file.read())

    # Preprocess image and save to processed directory
    processed_filename = f"processed_{unique_filename}"
    processed_path = os.path.join(PROCESSED_DIR, processed_filename)
    preprocess_handwriting_image(upload_path, processed_path)

    # Create sample record
    sample = HandwritingSample(
        sample_id=str(uuid4()),
        person_id=person_id if person_id else None,
        image_path=processed_path,
        case_id=case_id
    )

    # Save to DB
    db = request.app.mongodb
    await db.samples.insert_one(sample.model_dump())

    return sample

@router.get("/{sample_id}", response_model=HandwritingSample)
async def get_sample(sample_id: str, request: Request):
    db = request.app.mongodb
    sample_data = await db.samples.find_one({"sample_id": sample_id})
    if not sample_data:
        raise HTTPException(status_code=404, detail="Sample not found")
    return HandwritingSample(**sample_data)
