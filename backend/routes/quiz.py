from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.ai_service import ai_service
from backend.session_tracker import tracker

router = APIRouter(prefix="/quiz", tags=["quiz"])


class QuizRequest(BaseModel):
    topic: str


class QuizQuestion(BaseModel):
    prompt: str
    choices: list[str] | None = None
    answer: str | None = None


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(payload: QuizRequest) -> QuizResponse:
    """AI-powered quiz generation using Gemini API with African context"""
    topic = payload.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    # Track quiz generation for analytics
    tracker.track_quiz(topic)
    
    # Use AI service to generate intelligent quiz
    questions = await ai_service.generate_quiz(topic, num_questions=3)
    
    return QuizResponse(questions=questions)

