"""
AI Service Module - Handles integration with Google Gemini AI
This provides intelligent, contextual responses for STEM education
"""
import os
from pathlib import Path
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from backend/.env
backend_dir = Path(__file__).parent
env_path = backend_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"🔍 Debug: API Key loaded: {GEMINI_API_KEY[:10]}..." if GEMINI_API_KEY else "⚠️ Debug: No API key found")

class AIService:
    def __init__(self):
        self.model = None
        self.is_configured = False
        self._initialization_attempted = False
        
    def _initialize_model(self):
        """Lazy initialization - only configure model when first needed"""
        if self._initialization_attempted:
            return
            
        self._initialization_attempted = True
        
        if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
            # Try multiple model names - use full paths with models/ prefix
            models_to_try = [
                'models/gemini-2.5-flash',  # Latest fast model
                'models/gemini-2.5-pro',     # Latest powerful model
                'models/gemini-2.0-flash',   # Stable 2.0
                'models/gemini-flash-latest', # Generic latest
                'models/gemini-pro-latest'    # Generic latest pro
            ]
            
            for model_name in models_to_try:
                try:
                    genai.configure(api_key=GEMINI_API_KEY)
                    self.model = genai.GenerativeModel(model_name)
                    # Test if model works with a simple prompt
                    test_response = self.model.generate_content("Say hello")
                    self.is_configured = True
                    print(f"✅ Gemini AI configured successfully with {model_name}")
                    break
                except Exception as e:
                    print(f"⚠️ Model {model_name} failed: {str(e)[:80]}...")
                    continue
            
            if not self.is_configured:
                print("❌ All Gemini models failed. Using fallback responses.")
        else:
            print("⚠️ Gemini API key not found. Using fallback responses.")
    
    async def generate_tutor_response(self, question: str) -> dict:
        """
        Generate an AI tutoring response with African context
        """
        # Lazy initialization
        self._initialize_model()
        
        if not self.is_configured:
            return self._fallback_response(question)
        
        try:
            # Create a detailed prompt for African-contextualized STEM education
            prompt = f"""You are EduMentor, an AI tutor specialized in STEM education for African students.

CRITICAL INSTRUCTION: You MUST use African examples and context in EVERY explanation.

African Examples to Use:
- Transportation: boda-bodas (motorcycle taxis), matatus (minibuses), tuk-tuks, bicycles
- Geography: Sahara Desert, Great Rift Valley, Lake Victoria, Mount Kilimanjaro, Niger River
- Agriculture: cassava, maize, sorghum, millet, yams, coffee, cocoa farming
- Energy: solar panels in villages, biogas from agricultural waste, hydroelectric dams
- Wildlife: elephants, lions, giraffes, zebras, migratory patterns
- Infrastructure: clay brick houses, thatched roofs, water wells, irrigation systems
- Technology: mobile money (M-Pesa), solar-powered devices, SMS-based systems
- Daily life: marketplaces, community gatherings, traditional crafts

Student Question: {question}

Your Response Must Include:
1. Start with a relatable African scenario or example
2. Explain the concept clearly (3-4 paragraphs)
3. Use at least 2-3 specific African examples from the list above
4. Connect to practical applications in African communities
5. Use simple language suitable for high school students

Then provide three follow-up questions the student might ask.

Format your response as:
ANSWER: [Start with African example, then detailed explanation with more African context]
FOLLOW_UP_1: [first follow-up question]
FOLLOW_UP_2: [second follow-up question]
FOLLOW_UP_3: [third follow-up question]"""

            response = self.model.generate_content(prompt)
            return self._parse_response(response.text, question)
            
        except Exception as e:
            print(f"AI generation error: {e}")
            return self._fallback_response(question)
    
    def _parse_response(self, text: str, question: str) -> dict:
        """Parse the AI response into structured format"""
        try:
            lines = text.strip().split('\n')
            answer_lines = []
            follow_ups = []
            
            current_section = None
            for line in lines:
                line = line.strip()
                if line.startswith('ANSWER:'):
                    current_section = 'answer'
                    answer_lines.append(line.replace('ANSWER:', '').strip())
                elif line.startswith('FOLLOW_UP_'):
                    follow_ups.append(line.split(':', 1)[1].strip())
                elif current_section == 'answer' and line:
                    answer_lines.append(line)
            
            answer = ' '.join(answer_lines).strip()
            if not answer:
                answer = text  # Use full response if parsing fails
            
            # Ensure we have follow-ups
            if not follow_ups:
                follow_ups = [
                    f"Can you explain more about {question.split()[-2] if len(question.split()) > 1 else 'this topic'}?",
                    "How is this applied in real life?",
                    "What are common misconceptions about this?"
                ]
            
            return {
                "answer": answer,
                "follow_up_suggestions": follow_ups[:3]
            }
        except Exception as e:
            print(f"Parse error: {e}")
            return {
                "answer": text,
                "follow_up_suggestions": []
            }
    
    def _fallback_response(self, question: str) -> dict:
        """Fallback when AI is not available"""
        return {
            "answer": (
                f"I received your question about '{question}'. "
                "To provide intelligent AI-powered responses, please configure the Gemini API key. "
                "Visit https://makersuite.google.com/app/apikey to get a free API key, "
                "then add it to your .env file as GEMINI_API_KEY=your_key_here. "
                "Once configured, I'll provide detailed, contextual explanations with African examples!"
            ),
            "follow_up_suggestions": [
                "How do I set up the Gemini API?",
                "What makes EduMentor different from other tutors?",
                "Can you explain STEM topics with African context?"
            ]
        }
    
    async def generate_quiz(self, topic: str, num_questions: int = 3) -> list:
        """
        Generate quiz questions on a given topic
        """
        # Lazy initialization
        self._initialize_model()
        
        if not self.is_configured:
            return self._fallback_quiz(topic, num_questions)
        
        try:
            prompt = f"""You are creating a STEM quiz for African high school students on: {topic}

CRITICAL: Every question MUST use African context and examples.

African Context Examples:
- Real-world scenarios: farming, transportation, energy access, water systems
- Local examples: boda-bodas, matatus, solar panels, cassava farms, Lake Victoria
- Practical applications: mobile money, irrigation, renewable energy, local industries

Create {num_questions} quiz questions that:
- Test conceptual understanding, not just memorization
- Use specific African examples in EVERY question
- Are relevant to students' daily lives in Africa
- Include practical application scenarios
- Are appropriate for high school level

Format each question as:
Q[number]: [Question text with African context]
A[number]: [Correct answer with brief explanation using African examples]

Example:
Q1: A boda-boda rider in Kampala accelerates from rest to 15 m/s in 5 seconds. What is the acceleration?
A1: Using a = (v-u)/t, the acceleration is (15-0)/5 = 3 m/s². This means the boda-boda's speed increases by 3 meters per second every second during acceleration.
"""

            response = self.model.generate_content(prompt)
            return self._parse_quiz(response.text)
            
        except Exception as e:
            print(f"Quiz generation error: {e}")
            return self._fallback_quiz(topic, num_questions)
    
    def _parse_quiz(self, text: str) -> list:
        """Parse quiz response into structured format"""
        questions = []
        lines = text.strip().split('\n')
        
        current_q = None
        current_a = None
        
        for line in lines:
            line = line.strip()
            if line.startswith('Q'):
                if current_q and current_a:
                    questions.append({
                        "prompt": current_q,
                        "answer": current_a,
                        "choices": None
                    })
                current_q = line.split(':', 1)[1].strip() if ':' in line else line
                current_a = None
            elif line.startswith('A'):
                current_a = line.split(':', 1)[1].strip() if ':' in line else line
        
        # Add the last question
        if current_q and current_a:
            questions.append({
                "prompt": current_q,
                "answer": current_a,
                "choices": None
            })
        
        return questions[:3]  # Return up to 3 questions
    
    def _fallback_quiz(self, topic: str, num_questions: int) -> list:
        """Fallback quiz when AI is not available"""
        return [
            {
                "prompt": f"To generate intelligent quizzes on '{topic}', please configure the Gemini API.",
                "answer": "Set up your GEMINI_API_KEY in the .env file to unlock AI-powered quiz generation.",
                "choices": None
            }
        ]

# Global instance
ai_service = AIService()
