# EduMentor: AI-Powered STEM Learning Companion

EduMentor is an AI-first learning companion tailored to support African students as they master complex STEM concepts. By pairing Google Genkit's generative intelligence with Google ADK's application scaffolding, EduMentor delivers localized explanations, adaptive quizzes, and progress-aware guidance to both learners and educators.

## Mission

Bridge the STEM learning gap across Africa by offering culturally relevant, accessible, and personalized tutoring experiences, powered by modern AI and delivered through lightweight web and mobile surfaces.

## Core Features

- **Conversational Tutor:** Students ask natural-language questions and receive contextual, culturally grounded explanations generated through Genkit pipelines.
- **Quiz Generator:** Auto-build short quizzes for fast self-assessment, with tunable difficulty and instant feedback.
- **Progress Dashboard:** Track comprehension, highlight at-risk concepts, and receive study plan nudges backed by ADK-managed analytics.
- **Teacher Workspace:** Create assignments, review cohort performance, and export insights for offline instruction.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| UI | Google ADK (web) | Auth, routing, component framework |
| Intelligence | Google Genkit | Conversational tutoring, quiz authoring, insights |
| Storage | Firestore | User profiles, progress journals, quiz history |
| Hosting | Firebase Hosting | Continuous delivery for the frontend |

## Repository Layout

```
frontend/       # ADK-based web client
backend/        # FastAPI backend with Genkit integration layer
docs/           # Proposal, slides, and demo references
tests/          # Pytest suite for API contract validation
deployment/     # Firebase and CI/CD configuration
```

## Local Development

### Prerequisites
- Python 3.8+ for backend
- Modern web browser for frontend

### Quick Start

1. **Backend Setup**
   ```bash
   # Navigate to project root
   cd /path/to/capstone
   
   # Create virtual environment (optional but recommended)
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r backend/requirements.txt
   
   # Start the FastAPI server
   uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```
   
   ✅ Backend running at `http://127.0.0.1:8000`  
   📚 API docs available at `http://127.0.0.1:8000/docs`

2. **Frontend Setup**
   ```bash
   # In a new terminal, serve the frontend
   python3 -m http.server --directory frontend 3000
   ```
   
   ✅ Frontend running at `http://localhost:3000`

3. **Access the Application**
   - Open `http://localhost:3000` in your browser
   - Try the AI Tutor, Quiz Generator, and Dashboard features

### Running Tests
```bash
# Ensure backend dependencies are installed
pytest
```

## Deployment

- **Frontend:** Deploy with `firebase deploy --only hosting` using the config under `deployment/`.
- **Backend:** Package as a Cloud Run service or other Genkit-compatible runtime; ensure service account permissions for Firestore and Genkit pipelines.

## Roadmap

- Add multi-language support (Swahili, Amharic, Yoruba).
- Expand STEM coverage with community-authored modules.
- Release educator APIs for LMS integrations.

---
EduMentor — bridging the STEM gap with AI for Africa.
