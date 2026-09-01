from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import tasks

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TODO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
