from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from routes import cases, samples, matching, persons, training
from contextlib import asynccontextmanager

# Database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.mongodb_client = AsyncIOMotorClient(settings.mongo_uri)
    app.mongodb = app.mongodb_client[settings.database_name]
    yield
    # Shutdown
    app.mongodb_client.close()

app = FastAPI(title=settings.app_name, lifespan=lifespan)

# Include routers
app.include_router(cases.router, prefix="/cases", tags=["cases"])
app.include_router(samples.router, prefix="/samples", tags=["samples"])
app.include_router(matching.router, prefix="/matching", tags=["matching"])
app.include_router(persons.router, prefix="/persons", tags=["persons"])
app.include_router(training.router, prefix="/training", tags=["training"])

@app.get("/")
async def root():
    return {"message": "Handwriting Writer Identification API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
