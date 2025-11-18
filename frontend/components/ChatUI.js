export default class ChatUI {
  constructor(rootElement, onAskQuestion) {
    this.root = rootElement;
    this.onAskQuestion = onAskQuestion;
    this.outputArea = null;
    this.questionInput = null;
    this.chatHistory = [];  // Store chat history
    this.currentQuestion = '';  // Store current question being asked
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <h2>AI Tutor</h2>
      <p>Ask any STEM question and receive a localized explanation.</p>
      <textarea id="chat-question" placeholder="Explain Newton's Third Law with an African example..."></textarea>
      <button id="chat-submit">Ask Tutor</button>
      <button id="clear-history" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); margin-left: 0.5rem;">Clear History</button>
      <div class="output-area" id="chat-output"></div>
    `;

    this.outputArea = this.root.querySelector('#chat-output');
    this.questionInput = this.root.querySelector('#chat-question');

    this.root.querySelector('#chat-submit').addEventListener('click', () => {
      const question = this.questionInput.value.trim();
      if (!question) {
        this.renderError('Please enter a question.');
        return;
      }
      // Store the question before clearing the input
      this.currentQuestion = question;
      this.onAskQuestion(question);
    });
    
    this.root.querySelector('#clear-history').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all chat history?')) {
        this.clearHistory();
      }
    });
    
    // Render existing history if any
    this.renderHistory();
  }

  showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = '<em>🤔 Thinking...</em>';
    this.outputArea.appendChild(loadingDiv);
    this.outputArea.scrollTop = this.outputArea.scrollHeight;
  }

  renderAnswer(answer, suggestions) {
    // Remove loading message
    const loading = this.outputArea.querySelector('.loading-message');
    if (loading) loading.remove();
    
    // Add to history using the stored question
    this.chatHistory.push({
      question: this.currentQuestion,
      answer,
      suggestions,
      timestamp: new Date(),
      expanded: true  // Start expanded
    });
    
    // Clear input and current question
    this.questionInput.value = '';
    this.currentQuestion = '';
    
    // Render full history
    this.renderHistory();
  }
  
  renderHistory() {
    if (this.chatHistory.length === 0) {
      this.outputArea.innerHTML = '<p style="color: #718096; font-style: italic; text-align: center; padding: 2rem;">No questions asked yet. Start learning! 🚀</p>';
      return;
    }
    
    this.outputArea.innerHTML = this.chatHistory.map((item, index) => {
      const itemId = `chat-item-${index}`;
      const suggestionMarkup = item.suggestions && item.suggestions.length
        ? `<div class="suggestions"><strong>💡 Follow-up questions:</strong><ul>${item.suggestions
            .map((s) => `<li>${s}</li>`)
            .join('')}</ul></div>`
        : '';

      return `
        <div class="chat-message" id="${itemId}" style="margin-bottom: 1.5rem; animation: messageSlide 0.4s ease-out;">
          <div class="chat-question-header" style="background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #3b82f6;" data-index="${index}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="flex: 1;">
                <strong style="color: #1e40af;">❓ Question #${index + 1}</strong>
                <p style="margin: 0.25rem 0 0 0; color: #1e3a8a; font-weight: 500;">${item.question}</p>
              </div>
              <span style="color: #3b82f6; font-size: 1.5rem; transform: rotate(${item.expanded ? '90' : '0'}deg); transition: transform 0.3s ease;">›</span>
            </div>
          </div>
          <div class="chat-answer-content" style="display: ${item.expanded ? 'block' : 'none'}; animation: ${item.expanded ? 'fadeIn 0.3s ease-out' : 'none'};">
            <div class="chat-response">
              <p><strong>🤖 AI Tutor:</strong><br><br>${item.answer}</p>
              ${suggestionMarkup}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Add click handlers for collapsible items
    this.outputArea.querySelectorAll('.chat-question-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'));
        this.toggleChatItem(index);
      });
    });
    
    // Scroll to bottom to show newest
    this.outputArea.scrollTop = this.outputArea.scrollHeight;
  }
  
  toggleChatItem(index) {
    // Toggle expanded state
    this.chatHistory[index].expanded = !this.chatHistory[index].expanded;
    // Re-render
    this.renderHistory();
  }

  renderError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color:#c1121f; padding: 1rem; display: block; background: #fff5f5; border-radius: 8px; border-left: 4px solid #c1121f; margin-top: 1rem;';
    errorDiv.innerHTML = `⚠️ ${message}`;
    this.outputArea.appendChild(errorDiv);
  }
  
  clearHistory() {
    this.chatHistory = [];
    this.renderHistory();
  }
}
