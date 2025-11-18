from fastapi import APIRouter
from backend.session_tracker import tracker

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/summary")
async def progress_summary() -> dict:
    """Return real-time learner analytics based on actual usage."""
    summary = tracker.get_summary()
    
    # Provide helpful messages for empty states
    if not summary["masteredTopics"]:
        summary["masteredTopics"] = []
        summary["emptyMessage"] = "Start asking questions to build your mastery!"
    
    if not summary["reviewTopics"]:
        summary["reviewTopics"] = []
    
    return summary
