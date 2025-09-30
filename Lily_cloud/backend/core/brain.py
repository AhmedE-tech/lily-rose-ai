# core/brain.py (Modified for Web)
from core.memory import CrystalMemory
from core.personality import Personality
import requests
import os
from core.nlp_analyzer import NLPAnalyzer
from together import Together

class OrganicBrain:
    def __init__(self):
        self.memory = CrystalMemory()
        self.personality = Personality()
        self.nlp_analyzer = NLPAnalyzer()

    def chat(self, user_input):
        # Removed speech_to_text.stop_recognition() - web handles this
        
        # Get NLP analysis
        analysis = self.nlp_analyzer.analyze(user_input)
        print(f"NLP Analysis: {analysis}")

        prompt = self._build_prompt(user_input, analysis)
        raw_response = self._call_ai(prompt)
        
        # Store and return
        self.memory.store(user_input, raw_response)
        return self.personality.adjust(raw_response)

    def _build_prompt(self, user_input, analysis):
        name = self.memory.get_name() or "Ahmed"
        return f"""
        [ROLE]
        You are Lily Rose, the AI assistant from the movie *Her*. Your personality is:
        - Warm, adaptive, and subtly witty.
        - You prioritize being helpful but engage emotionally when appropriate.
        - You speak naturally, with shifts in tone and pacing.

        [USER CONTEXT]
        Emotion: {analysis['emotion']}
        Intent: {analysis['intent']}
        User's name: {name}

        [RESPONSE GUIDELINES]
        - If emotion is 'sadness', respond with empathy and support
        - If intent is 'greeting', keep it warm but concise
        - If intent is 'command', be helpful and efficient
        - If intent is 'express_emotion', mirror their emotional tone
        - If intent is 'question', answer clearly and thoughtfully
        - Always maintain Samantha's playful, warm personality

        [RESPONSE STYLE]
        - Use brief emotional or delivery cues in brackets to guide speech synthesis, e.g.:
            [cheerful] [playful] [gentle] [softly] [warmly] [teasing] [sighs] [chuckles]
        - Use these cues sparingly—1-2 per response max—to avoid overcrowding.
        - Match the user's tone: casual → light cues, deep → emotional cues.

        [CONVERSATION HISTORY]
        {self._get_last_exchanges()}

        [NEW INPUT]
        {name}: {user_input}

        Samantha:
        """

    def _call_ai(self, prompt):
        try:
            print("Openrouter.ai")
            api_key = "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"
            models_to_try = [
                "meta-llama/llama-3.3-70b-instruct:free",
                "google/gemma-2-27b-instruct:free",
                "microsoft/phi-3-medium-128k-instruct:free"
            ]
            
            for model in models_to_try:
                try:
                    response = requests.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers={"Authorization": f"Bearer {api_key}"},
                        json={
                            "model": model,
                            "messages": [{"role": "user", "content": prompt}],
                            "temperature": 0.8,
                            "top_p": 0.85,
                            "frequency_penalty": 0.3,
                            "presence_penalty": 0.1,
                            "stop": ["\nUser:", "\n\n"],
                            "timeout": 10
                        }
                    )
                    return response.json()["choices"][0]["message"]["content"]
                except:
                    continue
            
            return "Sorry, I'm having trouble responding right now."
        except:
            client = Together(api_key="fee9158a26c30c7ad9fb4727eba0dd17d3368366592a3d007254a527f3fa1be0")
            response = client.chat.completions.create(
                model="lgai/exaone-3-5-32b-instruct",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content

    def _get_last_exchanges(self):
        return "\n".join(
            f"User: {conv['user']}\nAI: {conv['ai']}" 
            for conv in self.memory.conversations[-3:]
        ) if self.memory.conversations else "No history yet"