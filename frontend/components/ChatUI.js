export default class ChatUI {
  constructor(rootElement, onAskQuestion) {
    this.root = rootElement;
    this.onAskQuestion = onAskQuestion;
    this.outputArea = null;
    this.questionInput = null;
    this.chatHistory = this.loadHistory();  // Load saved chat history from localStorage
    this.currentQuestion = '';  // Store current question being asked
    this.render();
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('edumentor_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('edumentor_chat_history', JSON.stringify(this.chatHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
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
    // Prepend loading at the top
    this.outputArea.insertBefore(loadingDiv, this.outputArea.firstChild);
    this.outputArea.scrollTop = 0;
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
      timestamp: new Date().toISOString(),  // Save as ISO string for localStorage
      expanded: true  // Start expanded
    });
    
    // Save to localStorage
    this.saveHistory();
    
    // Clear input and current question
    this.questionInput.value = '';
    this.currentQuestion = '';
    
    // Render full history
    this.renderHistory();
    
    // Force scroll to top to show the newest answer
    setTimeout(() => {
      this.outputArea.scrollTop = 0;
    }, 50);
  }
  
  renderHistory() {
    if (this.chatHistory.length === 0) {
      this.outputArea.innerHTML = '<p style="color: #718096; font-style: italic; text-align: center; padding: 2rem;">No questions asked yet. Start learning! 🚀</p>';
      return;
    }
    
    // Reverse the array so newest appears first (at top)
    const reversedHistory = [...this.chatHistory].reverse();
    
    this.outputArea.innerHTML = reversedHistory.map((item, reversedIndex) => {
      const actualIndex = this.chatHistory.length - 1 - reversedIndex; // Map back to original index
      const itemId = `chat-item-${actualIndex}`;
      const suggestionMarkup = item.suggestions && item.suggestions.length
        ? `<div class="suggestions"><strong>💡 Follow-up questions:</strong><ul>${item.suggestions
            .map((s) => `<li>${s}</li>`)
            .join('')}</ul></div>`
        : '';

      // Style similar to quiz cards for newest answer
      if (reversedIndex === 0) {
        return `
          <div class="chat-message latest" id="${itemId}" style="margin-bottom: 2rem; animation: messageSlide 0.4s ease-out;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: white; padding: 1.25rem 1.5rem; border-radius: 12px 12px 0 0; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);">
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">🤖</span>
                <div style="flex: 1;">
                  <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin-bottom: 0.25rem;">Latest Answer</div>
                  <strong style="font-size: 1.15rem; display: block;">${item.question}</strong>
                </div>
                <span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">New</span>
              </div>
            </div>
            <div style="background: white; padding: 1.75rem; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); border: 2px solid #e5e7eb; border-top: none;">
              <div class="chat-response">
                <div style="line-height: 1.8; color: #1f2937; font-size: 1.05rem;">${item.answer}</div>
                ${suggestionMarkup}
              </div>
            </div>
          </div>
        `;
      }

      // Older messages - collapsible
      return `
        <div class="chat-message" id="${itemId}" style="margin-bottom: 1.5rem; animation: messageSlide 0.4s ease-out;">
          <div class="chat-question-header" style="background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #3b82f6;" data-index="${actualIndex}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="flex: 1;">
                <strong style="color: #1e40af;">❓ Question #${actualIndex + 1}</strong>
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
    
    // Scroll to top to show the newest message
    this.outputArea.scrollTop = 0;
  }
  
  toggleChatItem(index) {
    // Toggle expanded state
    this.chatHistory[index].expanded = !this.chatHistory[index].expanded;
    // Save state to localStorage
    this.saveHistory();
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
    this.saveHistory();  // Clear localStorage too
    this.renderHistory();
  }
}
