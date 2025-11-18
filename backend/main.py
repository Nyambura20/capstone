from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import progress, quiz, tutor

app = FastAPI(
    title="EduMentor API",
    description="APIs for conversational tutoring, quiz generation, and progress tracking",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")
app.include_router(progress.router, prefix="/api")


@app.get("/", tags=["health"])
async def health_check():
    """Return API health metadata for uptime monitoring."""
    return {"status": "ok", "service": "edumentor-api"}
