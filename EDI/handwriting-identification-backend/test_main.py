import pytest
from fastapi.testclient import TestClient
from app import app
from unittest.mock import Mock, AsyncMock

@pytest.fixture
def mock_db():
    db = Mock()
    db.samples.insert_one = AsyncMock()
    db.samples.find_one = AsyncMock(return_value={
        "sample_id": "test",
        "person_id": "test",
        "image_path": "test",
        "date_uploaded": "2023-01-01T00:00:00",
        "case_id": None
    })
    db.persons.insert_one = AsyncMock()
    db.persons.find_one = AsyncMock(return_value={
        "person_id": "test",
        "gov_id": "TEST123",
        "name": "Test User",
        "dob": None,
        "photo": None,
        "address": None,
        "contact": None
    })
    return db

@pytest.fixture
def client(mock_db):
    app.mongodb = mock_db
    return TestClient(app)

def test_create_person(client):
    response = client.post("/persons/", json={"gov_id": "TEST123", "name": "Test User"})
    assert response.status_code == 200
    assert response.json()["gov_id"] == "TEST123"

def test_get_person(client):
    # Assuming a person exists
    response = client.get("/persons/test")
    assert response.status_code == 200
    assert response.json()["gov_id"] == "TEST123"

import io
from PIL import Image

def test_upload_sample(client):
    # Create a dummy image
    image = Image.new('RGB', (100, 100), color='red')
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)

    response = client.post("/samples/upload", files={"file": ("test.png", buffer, "image/png")})
    assert response.status_code == 200
    assert "sample_id" in response.json()

def test_extract_features():
    from ai_model import extract_features

    # Create a dummy image
    image = Image.new('L', (128, 128), color=128)
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)

    features = extract_features(buffer.getvalue())
    assert len(features) == 128

# Run with pytest test_main.py
