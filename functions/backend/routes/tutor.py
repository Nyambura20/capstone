from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.ai_service import ai_service
from backend.session_tracker import tracker

router = APIRouter(prefix="/tutor", tags=["tutor"])


class TutorRequest(BaseModel):
    question: str


class TutorResponse(BaseModel):
    answer: str
    follow_up_suggestions: list[str] = []


@router.post("/query", response_model=TutorResponse)
async def ask_tutor(payload: TutorRequest) -> TutorResponse:
    """AI-powered STEM tutoring with African context using Gemini API"""
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    # Track the question for analytics
    tracker.track_question(question)
    
    # Use AI service to generate intelligent response
    result = await ai_service.generate_tutor_response(question)
    
    return TutorResponse(
        answer=result["answer"],
        follow_up_suggestions=result["follow_up_suggestions"]
    )
