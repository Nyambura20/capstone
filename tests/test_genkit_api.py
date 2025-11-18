import pytest
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture(scope="module")
def client():
    return TestClient(app)


def test_tutor_query_success(client):
    response = client.post("/api/tutor/query", json={"question": "Explain gravity"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert isinstance(data["follow_up_suggestions"], list)


def test_tutor_query_validation(client):
    response = client.post("/api/tutor/query", json={"question": "   "})
    assert response.status_code == 400


def test_quiz_generation_success(client):
    response = client.post("/api/quiz/generate", json={"topic": "photosynthesis"})
    assert response.status_code == 200
    data = response.json()
    assert "questions" in data
    assert len(data["questions"]) == 3


def test_progress_summary(client):
    response = client.get("/api/progress/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["streakDays"] >= 0
