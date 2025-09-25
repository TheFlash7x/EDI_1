from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from config import settings
from routes import cases, samples, matching, persons, training
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
import os
app = FastAPI(title=settings.app_name)

# Serve the React build folder
app.mount("/", StaticFiles(directory="../handwriting-identification-frontend/build", html=True), name="frontend")

# Database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.mongodb_client = AsyncIOMotorClient(settings.mongo_uri)
    app.mongodb = app.mongodb_client[settings.database_name]
    yield
    app.mongodb_client.close()

app.router.lifespan_context = lifespan

# Include API routers under /api
app.include_router(cases.router, prefix="/api/cases", tags=["cases"])
app.include_router(samples.router, prefix="/api/samples", tags=["samples"])
app.include_router(matching.router, prefix="/api/matching", tags=["matching"])
app.include_router(persons.router, prefix="/api/persons", tags=["persons"])
app.include_router(training.router, prefix="/api/training", tags=["training"])

@app.get("/{full_path:path}")
async def react_router(full_path: str):
    # Ignore API routes
    if full_path.startswith("api/"):
        return {"detail": "Not Found"}
    
    index_path = os.path.join("../handwriting-identification-frontend/build", "index.html")
    return FileResponse(index_path)