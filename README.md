# EduMentor: AI-Powered STEM Learning Platform for African Students

**Live Application:** https://edumentor-stem.web.app  
**Backend API:** https://api-xayzhqp7ua-uc.a.run.app

EduMentor is a full-stack AI-powered learning platform designed specifically for African STEM students. Using Google's Gemini 2.5 Flash AI model, it provides culturally relevant, context-aware tutoring that uses African examples (boda-bodas, matatus, cassava farming, Lake Victoria, etc.) in every explanation.

## Mission

Bridge the STEM learning gap across Africa by offering culturally relevant, accessible, and personalized tutoring experiences. Every AI response is designed to connect STEM concepts to real-world African contexts that students recognize from their daily lives.

## Core Features

### 🎓 AI Tutor
- Ask any STEM question in natural language
- Receive detailed explanations using African examples and contexts
- Powered by Google Gemini 2.5 Flash AI model
- Every response includes relatable local examples (transportation, agriculture, geography)

### 📝 Quiz Generator  
- Auto-generate practice quizzes on any STEM topic
- Multiple-choice questions with instant feedback
- Culturally contextualized questions using African scenarios
- Tracks your quiz performance

### 📊 Learning Dashboard
- Monitor your progress across topics
- View session history and learning patterns
- Track quiz scores and comprehension levels
- Get personalized study recommendations

## Live Deployment

**Production URLs:**
- **Frontend:** https://edumentor-stem.web.app
- **Backend API:** https://api-xayzhqp7ua-uc.a.run.app/api
- **API Documentation:** https://api-xayzhqp7ua-uc.a.run.app/docs

**Firebase Project:** `edumentor-stem`  
**Google Cloud Region:** `us-central1`

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | Vanilla JavaScript (ES6 modules) | Lightweight, responsive UI with component architecture |
| **Backend** | Python FastAPI | RESTful API with async support |
| **AI Model** | Google Gemini 2.5 Flash | Conversational AI with African context awareness |
| **Hosting** | Firebase Hosting | Frontend static file serving |
| **Functions** | Firebase Cloud Functions (Gen 2) | Serverless backend deployment |
| **Authentication** | Firebase Admin SDK | Secure cloud function execution |
| **API Client** | Fetch API | Frontend-backend communication with CORS support |

### Key Dependencies

**Backend:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server  
- `google-generativeai` - Gemini AI SDK
- `firebase-functions` - Cloud Functions integration
- `firebase-admin` - Firebase Admin SDK
- `pydantic` - Data validation

**Frontend:**
- Pure JavaScript (no build tools required)
- CSS3 with gradients and animations
- Modular component architecture

## Repository Layout

```
capstone/
├── frontend/                 # Frontend application
│   ├── index.html           # Main HTML file
│   ├── app.js               # Application initialization & API client
│   ├── styles.css           # Styling with African-themed gradients
│   └── components/          # UI components
│       ├── ChatUI.js        # AI Tutor interface
│       ├── QuizUI.js        # Quiz generator & display
│       └── Dashboard.js     # Progress tracking dashboard
│
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI app & route registration
│   ├── ai_service.py       # Gemini AI integration (African context)
│   ├── session_tracker.py  # User session & progress tracking
│   └── routes/             # API endpoints
│       ├── tutor.py        # /api/tutor/* endpoints
│       ├── quiz.py         # /api/quiz/* endpoints
│       └── progress.py     # /api/progress/* endpoints
│
├── functions/              # Firebase Cloud Functions
│   ├── main.py            # Cloud Function wrapper (FastAPI via TestClient)
│   ├── requirements.txt   # Cloud Functions dependencies
│   ├── .env              # Environment variables (GEMINI_API_KEY)
│   └── backend/          # Copy of backend/ for deployment
│
├── tests/                 # Test suite
│   ├── test_genkit_api.py
│   └── test_quiz_generation.py
│
├── firebase.json          # Firebase configuration
├── .firebaserc           # Firebase project settings
└── README.md             # This file
```

## Local Development

### Prerequisites
- Python 3.13 (or 3.11+)
- Modern web browser
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Quick Start

1. **Clone and Navigate**
   ```bash
   cd /path/to/capstone
   ```

2. **Backend Setup**
   ```bash
   # Install backend dependencies
   pip install -r backend/requirements.txt
   
   # Create .env file in backend/ directory
   echo "GEMINI_API_KEY=your_api_key_here" > backend/.env
   
   # Start the FastAPI server
   cd backend
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   
   ✅ Backend running at `http://127.0.0.1:8000`  
   📚 API docs at `http://127.0.0.1:8000/docs`

3. **Frontend Setup**
   ```bash
   # In a new terminal, serve the frontend
   cd /path/to/capstone
   python3 -m http.server --directory frontend 3000
   ```
   
   ✅ Frontend running at `http://localhost:3000`

4. **Test the Application**
   - Open `http://localhost:3000` in your browser
   - Try asking "What is photosynthesis?" in the AI Tutor
   - Generate a quiz on any STEM topic
   - View your progress in the Dashboard

### Environment Variables

Create `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running Tests
```bash
# From project root
pytest tests/
```

## Firebase Deployment

The project is deployed on Firebase with:
- **Hosting:** Serves the frontend static files
- **Cloud Functions (Gen 2):** Runs the FastAPI backend

### Deploy to Firebase

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Select/Create Project**
   ```bash
   firebase use edumentor-stem
   # Or create new: firebase projects:create
   ```

4. **Prepare Functions**
   ```bash
   # Copy backend to functions directory
   cp -r backend/* functions/backend/
   
   # Create functions/.env with your API key
   echo "GEMINI_API_KEY=your_key" > functions/.env
   
   # Create virtual environment and install dependencies
   cd functions
   python3.13 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cd ..
   ```

5. **Deploy**
   ```bash
   # Deploy everything
   firebase deploy
   
   # Or deploy individually
   firebase deploy --only hosting
   firebase deploy --only functions
   ```

6. **Enable Public Access**
   ```bash
   # Allow unauthenticated access to the API
   gcloud run services add-iam-policy-binding api \
     --region=us-central1 \
     --member=allUsers \
     --role=roles/run.invoker \
     --project=edumentor-stem
   ```

### Firebase Configuration

**firebase.json:**
- Frontend hosted from `frontend/` directory
- Cloud Function runtime: `python313`
- Function name: `api`
- Region: `us-central1`


## Project Milestones

✅ **Completed:**
- AI Tutor with African context awareness
- Quiz generation and evaluation system
- Progress tracking dashboard
- Firebase Hosting deployment
- Firebase Cloud Functions backend
- Public API access configuration
- Gemini 2.5 Flash integration
- Lazy model initialization (prevents timeouts)
- Full-stack deployment on Firebase

## Testing the Live Application

1. Visit **https://edumentor-stem.web.app**
2. Try the **AI Tutor**: Ask "How does a boda-boda engine work?"
3. Generate a **Quiz**: Topic "Photosynthesis" or "Newton's Laws"
4. Check the **Dashboard**: View your learning progress

## Future Enhancements

- Multi-language support (Swahili, Amharic, Yoruba, Hausa)
- Voice input/output for accessibility
- Offline mode with progressive web app (PWA)
- Teacher dashboard for classroom management
- Integration with African school curricula
- Mobile app versions (iOS/Android)
- Peer learning features and study groups

---

**EduMentor** — Empowering African Students in STEM Education with AI 🌍🎓✨
