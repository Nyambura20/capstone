export default class QuizUI {
  constructor(rootElement, onGenerateQuiz) {
    this.root = rootElement;
    this.onGenerateQuiz = onGenerateQuiz;
    this.outputArea = null;
    this.topicInput = null;
    this.quizHistory = this.loadHistory();  // Load saved quiz history from localStorage
    this.render();
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('edumentor_quiz_history');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading quiz history:', error);
      return [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('edumentor_quiz_history', JSON.stringify(this.quizHistory));
    } catch (error) {
      console.error('Error saving quiz history:', error);
    }
  }

  render() {
    this.root.innerHTML = `
      <h2>Quiz Generator</h2>
      <p>Generate practice questions to reinforce learning.</p>
      <input id="quiz-topic" type="text" placeholder="Photosynthesis" />
      <button id="quiz-submit">Create Quiz</button>
      <div class="output-area" id="quiz-output"></div>
    `;

    this.outputArea = this.root.querySelector('#quiz-output');
    this.topicInput = this.root.querySelector('#quiz-topic');

    this.root.querySelector('#quiz-submit').addEventListener('click', () => {
      const topic = this.topicInput.value.trim();
      if (!topic) {
        this.renderError('Please enter a topic.');
        return;
      }
      this.onGenerateQuiz(topic);
    });
    
    // Render existing history if any
    this.renderHistory();
  }

  showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = '<em>📝 Generating quiz...</em>';
    this.outputArea.appendChild(loadingDiv);
    this.outputArea.scrollTop = this.outputArea.scrollHeight;
  }

  renderQuiz(questions) {
    // Remove loading message
    const loading = this.outputArea.querySelector('.loading-message');
    if (loading) loading.remove();
    
    if (!questions.length) {
      this.renderError('No questions generated. Please try again.');
      return;
    }

    // Get the topic from input
    const topic = this.topicInput.value.trim();
    
    // Add to history
    this.quizHistory.push({
      topic,
      questions,
      timestamp: new Date().toISOString()  // Save as ISO string for localStorage
    });
    
    // Save to localStorage
    this.saveHistory();
    
    // Clear input
    this.topicInput.value = '';
    
    // Render full history
    this.renderHistory();
  }
  
  renderHistory() {
    if (this.quizHistory.length === 0) {
      this.outputArea.innerHTML = '<p style="color: #718096; font-style: italic; text-align: center; padding: 2rem;">No quizzes generated yet. Try creating one! 📝</p>';
      return;
    }
    
    // Reverse to show newest first
    const reversedHistory = [...this.quizHistory].reverse();
    
    this.outputArea.innerHTML = reversedHistory.map((quiz, reversedIndex) => {
      const actualIndex = this.quizHistory.length - 1 - reversedIndex;
      const questionsList = quiz.questions
        .map((q, index) => `
          <li style="margin: 1rem 0; padding: 1rem; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 3px solid #3a7bd5;">
            <strong style="color: #667eea; display: block; margin-bottom: 0.5rem;">Q${index + 1}.</strong> ${q.prompt}
            ${q.choices && q.choices.length ? `<ol type="A" style="margin-top: 0.75rem;">${q.choices.map((choice) => `<li>${choice}</li>`).join('')}</ol>` : ''}
            ${q.answer ? `<p style="margin: 0.5rem 0 0 0; color: #718096; font-size: 0.95rem;"><em>Answer:</em> ${q.answer}</p>` : ''}
          </li>
        `)
        .join('');

      return `
        <div class="quiz-section ${reversedIndex === 0 ? 'latest' : ''}" style="margin-bottom: 2rem; padding: 1rem; background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%); border-radius: 12px; animation: fadeIn 0.5s ease-out;">
          ${reversedIndex === 0 ? '<span class="latest-badge">✨ Latest Quiz</span>' : ''}
          <div style="background: linear-gradient(135deg, ${reversedIndex === 0 ? '#10b981 0%, #059669' : '#667eea 0%, #764ba2'} 100%); color: white; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 1.1rem;">📚 Quiz #${actualIndex + 1}: ${quiz.topic}</strong>
          </div>
          <ol style="margin: 0; padding-left: 0; list-style: none;">${questionsList}</ol>
        </div>
      `;
    }).join('');
    
    // Scroll to top to see newest quiz
    this.outputArea.scrollTop = 0;
  }

  renderError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color:#c1121f; padding: 1rem; display: block; background: #fff5f5; border-radius: 8px; border-left: 4px solid #c1121f; margin-top: 1rem;';
    errorDiv.innerHTML = `⚠️ ${message}`;
    this.outputArea.appendChild(errorDiv);
  }
  
  clearHistory() {
    this.quizHistory = [];
    this.renderHistory();
  }
}
