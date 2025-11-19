export default class Dashboard {
  constructor(rootElement) {
    this.root = rootElement;
    this.outputArea = null;
    this.learningStats = this.loadStats();
    this.render();
  }

  loadStats() {
    const stored = localStorage.getItem('edumentor_learning_stats');
    if (!stored) {
      return {
        streakDays: 0,
        lastActiveDate: null,
        totalQuestions: 0,
        totalQuizzes: 0,
        topicsExplored: 0,
        engagementScore: 0,
        masteredTopics: [],
        reviewTopics: []
      };
    }
    return JSON.parse(stored);
  }

  saveStats(stats) {
    localStorage.setItem('edumentor_learning_stats', JSON.stringify(stats));
    this.learningStats = stats;
  }

  updateStreak() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastActive = this.learningStats.lastActiveDate;

    if (lastActive === today) {
      // Already active today, no change
      return this.learningStats.streakDays;
    }

    if (!lastActive) {
      // First time user
      this.learningStats.streakDays = 1;
      this.learningStats.lastActiveDate = today;
      this.saveStats(this.learningStats);
      return 1;
    }

    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffTime = currentDate - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day - increment streak
      this.learningStats.streakDays += 1;
      this.learningStats.lastActiveDate = today;
      this.saveStats(this.learningStats);
    } else if (diffDays > 1) {
      // Streak broken - reset to 1
      this.learningStats.streakDays = 1;
      this.learningStats.lastActiveDate = today;
      this.saveStats(this.learningStats);
    }

    return this.learningStats.streakDays;
  }

  render() {
    this.root.innerHTML = `
      <h2>Learning Dashboard</h2>
      <p>Monitor progress and recommended topics.</p>
      <div class="output-area" id="dashboard-output"></div>
    `;
    this.outputArea = this.root.querySelector('#dashboard-output');
  }

  showLoading() {
    this.outputArea.innerHTML = '<em>📊 Loading dashboard...</em>';
  }

  renderSummary(summary) {
    // Update streak based on today's activity
    const currentStreak = this.updateStreak();

    // Merge backend stats with persisted streak
    const mergedStats = {
      streakDays: currentStreak,
      masteredTopics: summary.masteredTopics || [],
      reviewTopics: summary.reviewTopics || [],
      engagementScore: summary.engagementScore || 0,
      totalQuestions: summary.totalQuestions || 0,
      totalQuizzes: summary.totalQuizzes || 0,
      topicsExplored: summary.topicsExplored || 0,
      lastActiveDate: this.learningStats.lastActiveDate
    };

    // Save merged stats
    this.saveStats(mergedStats);

    const { 
      streakDays, 
      masteredTopics, 
      reviewTopics, 
      engagementScore,
      totalQuestions,
      totalQuizzes,
      topicsExplored
    } = mergedStats;

    // Empty state message
    const emptyState = !totalQuestions && !totalQuizzes ? `
      <div style="text-align: center; padding: 2rem; color: #718096;">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">👋 Welcome to EduMentor!</p>
        <p>Start asking questions or generating quizzes to see your progress here.</p>
        <p style="margin-top: 1rem; font-size: 0.9rem;">Your learning journey begins now! 🚀</p>
      </div>
    ` : '';

    this.outputArea.innerHTML = `
      ${emptyState}
      <div class="stat-grid">
        <div class="stat-card">
          <strong>🔥 Learning Streak</strong>
          <p>${streakDays} day${streakDays !== 1 ? 's' : ''}</p>
        </div>
        <div class="stat-card">
          <strong>📈 Engagement</strong>
          <p>${engagementScore}%</p>
        </div>
        <div class="stat-card">
          <strong>❓ Questions Asked</strong>
          <p>${totalQuestions}</p>
        </div>
        <div class="stat-card">
          <strong>📝 Quizzes Taken</strong>
          <p>${totalQuizzes}</p>
        </div>
      </div>
      <div class="dashboard-lists">
        <h3>✅ Mastered Topics (3+ interactions)</h3>
        <ul>${
          masteredTopics.length 
            ? masteredTopics.map((topic) => `<li>✓ ${topic}</li>`).join('') 
            : '<li style="color: #718096; font-style: italic;">Ask more questions to master topics! Keep learning! �</li>'
        }</ul>
        <h3>🎯 Topics to Review (1-2 interactions)</h3>
        <ul>${
          reviewTopics.length 
            ? reviewTopics.map((topic) => `<li>↻ ${topic}</li>`).join('') 
            : '<li style="color: #718096; font-style: italic;">No topics need review yet. You\'re doing great! 🎉</li>'
        }</ul>
        ${topicsExplored > 0 ? `
          <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%); border-radius: 8px; border-left: 4px solid #3b82f6;">
            <strong style="color: #1e40af;">📊 Your Learning Stats:</strong>
            <p style="margin: 0.5rem 0 0 0; color: #1e3a8a;">
              You've explored <strong>${topicsExplored}</strong> different STEM topic${topicsExplored !== 1 ? 's' : ''} so far!
              ${streakDays > 1 ? ` Keep up your ${streakDays}-day streak! 🔥` : ''}
            </p>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderError(message) {
    this.outputArea.innerHTML = `<span style="color:#c1121f; padding: 1rem; display: block; background: #fff5f5; border-radius: 8px; border-left: 4px solid #c1121f;">⚠️ ${message}</span>`;
  }
}
