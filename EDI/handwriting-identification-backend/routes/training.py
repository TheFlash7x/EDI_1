from fastapi import APIRouter, BackgroundTasks, HTTPException
from ai_model import train_model
from utils import load_training_data_from_db, save_training_data_to_db
from typing import Optional

router = APIRouter()

# Global training status
training_status = {"status": "idle", "progress": 0, "result": None, "error": None}


@router.post("/train")
async def start_training(background_tasks: BackgroundTasks, epochs: int = 50, batch_size: int = 32, tune_hyperparams: bool = False):
    """
    Start background training of the model.
    """
    if training_status["status"] == "running":
        raise HTTPException(status_code=400, detail="Training already running")

    training_status["status"] = "running"
    training_status["progress"] = 0
    training_status["error"] = None

    background_tasks.add_task(run_training, epochs, batch_size, tune_hyperparams)

    return {"message": "Training started in background"}


def run_training(epochs, batch_size, tune_hyperparams):
    """
    Run the training process.
    """
    try:
        training_data = load_training_data_from_db()
        if not training_data:
            raise ValueError("No training data available")

        history, version, timestamp = train_model(training_data, epochs=epochs, batch_size=batch_size, tune_hyperparams=tune_hyperparams)

        training_status["status"] = "completed"
        training_status["progress"] = 100
        training_status["result"] = {"version": version, "timestamp": timestamp}

    except Exception as e:
        training_status["status"] = "failed"
        training_status["error"] = str(e)


@router.get("/train/status")
async def get_training_status():
    """
    Get the current training status.
    """
    return training_status


@router.post("/train/data")
async def add_training_data(person_id: str, image_path: str, filename: str, augmented: bool = False):
    """
    Add training data to the database.
    """
    sample = {
        "person_id": person_id,
        "image_path": image_path,
        "filename": filename,
        "augmented": augmented
    }
    save_training_data_to_db([sample])
    return {"message": "Training data added"}


@router.get("/train/data")
async def get_training_data():
    """
    Get all training data from the database.
    """
    return load_training_data_from_db()
