"""
Firebase Cloud Functions for EduMentor Backend
"""
from firebase_functions import https_fn
from firebase_admin import initialize_app
import sys
from pathlib import Path

# Initialize Firebase Admin
initialize_app()

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

# Import the FastAPI app
from backend.main import app

# Use FastAPI TestClient for synchronous request handling
from fastapi.testclient import TestClient
client = TestClient(app)

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    """
    Handle all API requests through FastAPI using TestClient
    """
    # Build full URL with query parameters
    url = req.path
    if req.query_string:
        url += f"?{req.query_string.decode()}"
    
    # Forward the request to FastAPI
    response = client.request(
        method=req.method,
        url=url,
        headers=dict(req.headers),
        content=req.get_data()
    )
    
    # Return the response
    return https_fn.Response(
        response=response.content,
        status=response.status_code,
        headers=dict(response.headers)
    )
