"""
Session Tracker - Tracks user learning sessions and progress
This provides real-time analytics based on actual usage
"""
from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict, Counter
import re

class SessionTracker:
    """Track user learning sessions and generate real-time analytics"""
    
    def __init__(self):
        self.sessions = []  # List of session data
        self.questions_asked = []  # All questions asked
        self.topics_covered = Counter()  # Topic frequency counter
        self.quiz_topics = Counter()  # Quiz topics
        self.session_dates = []  # Dates of activity
        
        # Common STEM topics for categorization
        self.topic_keywords = {
            "Photosynthesis": ["photosynthesis", "chlorophyll", "plant", "farming", "crop"],
            "Newton's Laws": ["newton", "force", "motion", "inertia", "momentum"],
            "Gravity": ["gravity", "weight", "mass", "fall"],
            "Electricity": ["electric", "current", "voltage", "solar", "power", "energy"],
            "Cell Biology": ["cell", "nucleus", "mitochondria", "membrane", "biology"],
            "Water Cycle": ["water cycle", "evaporation", "condensation", "rain", "precipitation"],
            "Chemistry": ["atom", "molecule", "element", "chemical", "reaction"],
            "Energy": ["energy", "kinetic", "potential", "thermal"],
            "Evolution": ["evolution", "natural selection", "species", "darwin"],
            "Mathematics": ["equation", "algebra", "geometry", "calculus", "function"],
            "Physics": ["physics", "velocity", "acceleration", "trajectory"],
            "Astronomy": ["planet", "star", "solar system", "space", "universe"],
        }
    
    def track_question(self, question: str, topic: str = None):
        """Track a question asked by the user"""
        self.questions_asked.append({
            "question": question,
            "timestamp": datetime.now(),
            "detected_topic": topic or self._detect_topic(question)
        })
        
        # Update topic counter
        detected_topic = topic or self._detect_topic(question)
        if detected_topic:
            self.topics_covered[detected_topic] += 1
        
        # Track session date
        today = datetime.now().date()
        if today not in self.session_dates:
            self.session_dates.append(today)
    
    def track_quiz(self, topic: str):
        """Track a quiz generation"""
        self.quiz_topics[topic.title()] += 1
        # Quizzes count as mastery practice
        self.topics_covered[topic.title()] += 2  # Weight quizzes higher
        
        today = datetime.now().date()
        if today not in self.session_dates:
            self.session_dates.append(today)
    
    def _detect_topic(self, question: str) -> str:
        """Detect the topic from a question using keyword matching"""
        question_lower = question.lower()
        
        for topic, keywords in self.topic_keywords.items():
            for keyword in keywords:
                if keyword in question_lower:
                    return topic
        
        return "General STEM"
    
    def get_streak_days(self) -> int:
        """Calculate consecutive days of learning"""
        if not self.session_dates:
            return 0
        
        # Sort dates
        sorted_dates = sorted(self.session_dates, reverse=True)
        
        # Count consecutive days from most recent
        streak = 1
        current_date = sorted_dates[0]
        
        for i in range(1, len(sorted_dates)):
            expected_date = current_date - timedelta(days=1)
            if sorted_dates[i] == expected_date:
                streak += 1
                current_date = sorted_dates[i]
            else:
                break
        
        return streak
    
    def get_engagement_score(self) -> int:
        """Calculate engagement score based on activity"""
        if not self.questions_asked and not self.quiz_topics:
            return 0
        
        # Factors for engagement
        questions_count = len(self.questions_asked)
        quiz_count = sum(self.quiz_topics.values())
        topic_diversity = len(self.topics_covered)
        streak = self.get_streak_days()
        
        # Calculate score (0-100)
        score = min(100, (
            min(questions_count * 5, 40) +  # Up to 40 points for questions
            min(quiz_count * 10, 30) +      # Up to 30 points for quizzes
            min(topic_diversity * 5, 20) +   # Up to 20 points for diversity
            min(streak * 2, 10)              # Up to 10 points for streak
        ))
        
        return score
    
    def get_mastered_topics(self) -> List[str]:
        """Get topics the user has engaged with frequently (mastered)"""
        if not self.topics_covered:
            return []
        
        # Topics with 3+ interactions are considered "mastered"
        mastered = [topic for topic, count in self.topics_covered.items() if count >= 3]
        
        return sorted(mastered)[:5]  # Return top 5
    
    def get_review_topics(self) -> List[str]:
        """Get topics that need review (engaged 1-2 times)"""
        if not self.topics_covered:
            return []
        
        # Topics with 1-2 interactions need review
        review = [topic for topic, count in self.topics_covered.items() if 1 <= count < 3]
        
        return sorted(review)[:3]  # Return top 3
    
    def get_summary(self) -> dict:
        """Get complete learning summary"""
        return {
            "streakDays": self.get_streak_days(),
            "engagementScore": self.get_engagement_score(),
            "masteredTopics": self.get_mastered_topics(),
            "reviewTopics": self.get_review_topics(),
            "totalQuestions": len(self.questions_asked),
            "totalQuizzes": sum(self.quiz_topics.values()),
            "topicsExplored": len(self.topics_covered),
        }
    
    def reset(self):
        """Reset all tracking data (for new session/user)"""
        self.sessions = []
        self.questions_asked = []
        self.topics_covered = Counter()
        self.quiz_topics = Counter()
        self.session_dates = []

# Global tracker instance
tracker = SessionTracker()
