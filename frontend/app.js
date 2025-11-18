import ChatUI from './components/ChatUI.js';
import QuizUI from './components/QuizUI.js';
import Dashboard from './components/Dashboard.js';

// Auto-detect environment: use local backend in development, deployed Cloud Function in production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000/api'
  : 'https://api-xayzhqp7ua-uc.a.run.app/api';  // Firebase Cloud Function URL

const apiClient = {
  async askTutor(question) {
    const response = await fetch(`${API_BASE_URL}/tutor/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) {
      throw new Error('Tutor service unavailable.');
    }
    return response.json();
  },

  async generateQuiz(topic) {
    const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    if (!response.ok) {
      throw new Error('Quiz service unavailable.');
    }
    return response.json();
  },

  async getProgressSummary() {
    const response = await fetch(`${API_BASE_URL}/progress/summary`);
    if (!response.ok) {
      throw new Error('Dashboard data unavailable.');
    }
    return response.json();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const chatRoot = document.getElementById('chat-section');
  const quizRoot = document.getElementById('quiz-section');
  const dashboardRoot = document.getElementById('dashboard-section');

  // Function to refresh dashboard
  const refreshDashboard = async () => {
    dashboardUI.showLoading();
    try {
      const summary = await apiClient.getProgressSummary();
      dashboardUI.renderSummary(summary);
    } catch (error) {
      dashboardUI.renderError(error.message);
    }
  };

  const chatUI = new ChatUI(chatRoot, async (question) => {
    try {
      chatUI.showLoading();
      const result = await apiClient.askTutor(question);
      chatUI.renderAnswer(result.answer, result.follow_up_suggestions || []);
      // Refresh dashboard after question
      await refreshDashboard();
    } catch (error) {
      chatUI.renderError(error.message);
    }
  });

  const quizUI = new QuizUI(quizRoot, async (topic) => {
    try {
      quizUI.showLoading();
      const result = await apiClient.generateQuiz(topic);
      quizUI.renderQuiz(result.questions || []);
      // Refresh dashboard after quiz generation
      await refreshDashboard();
    } catch (error) {
      quizUI.renderError(error.message);
    }
  });

  const dashboardUI = new Dashboard(dashboardRoot);
  
  // Initial dashboard load
  refreshDashboard();
});
