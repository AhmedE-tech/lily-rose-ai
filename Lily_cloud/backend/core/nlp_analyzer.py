# core/nlp_analyzer.py
import requests
from textblob import TextBlob

class NLPAnalyzer:
    def __init__(self):
        self.hf_token = "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"  # Your token
    
    def detect_emotion(self, text):
        """Your working emotion detection function"""
        API_URL = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base"
        headers = {"Authorization": f"Bearer {self.hf_token}"}
        
        payload = {"inputs": text}
        
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=5)
            response.raise_for_status()
            
            data = response.json()
            
            if isinstance(data, list):
                emotions = data[0]
                top_emotion = max(emotions, key=lambda x: x['score'])
                return top_emotion['label']
            else:
                return "neutral"
                
        except:
            # Fallback to TextBlob
            analysis = TextBlob(text)
            polarity = analysis.sentiment.polarity
            
            if polarity > 0.3:
                return "joy"
            elif polarity < -0.3:
                return "sadness"
            else:
                return "neutral"

    def detect_intent(self, text):
        """Your intent detection function"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["hi", "hello", "hey", "greetings"]):
            return "greeting"
        elif any(word in text_lower for word in ["how are you", "how do you feel"]):
            return "ask_about_ai"
        elif "?" in text:
            return "question"
        elif any(word in text_lower for word in ["sad", "happy", "angry", "excited", "feel"]):
            return "express_emotion"
        elif any(word in text_lower for word in ["set", "remind", "timer", "alarm"]):
            return "command"
        else:
            return "chat"

    def analyze(self, text):
        """Combine emotion and intent analysis"""
        return {
            "emotion": self.detect_emotion(text),
            "intent": self.detect_intent(text)
        }