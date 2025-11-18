from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_quiz_requires_topic():
    response = client.post("/api/quiz/generate", json={"topic": ""})
    assert response.status_code == 400


def test_quiz_response_shape():
    response = client.post("/api/quiz/generate", json={"topic": "renewable energy"})
    assert response.status_code == 200
    data = response.json()
    assert "questions" in data
    for question in data["questions"]:
        assert "prompt" in question
