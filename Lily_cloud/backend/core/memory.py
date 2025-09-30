# Lily-Cloud/backend/core/memory.py
import json
from datetime import datetime
import os
from supabase import create_client, Client

class CrystalMemory:
    def __init__(self):
        # Try Supabase first, fallback to local JSON
        self.use_supabase = False
        self.supabase = None
        
        # Initialize Supabase if credentials available
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if supabase_url and supabase_key:
            try:
                self.supabase: Client = create_client(supabase_url, supabase_key)
                self.use_supabase = True
                print("Using Supabase for storage")
            except Exception as e:
                print(f"Supabase init failed: {e}, falling back to local storage")
        
        # Fallback to local file
        self.filepath = "data/memory.json"
        self.conversations = []
        self.facts = {}
        self._load()

    def _load(self):
        if self.use_supabase:
            try:
                # Load from Supabase
                response = self.supabase.table("conversations").select("*").execute()
                if response.data:
                    self.conversations = response.data
                
                facts_response = self.supabase.table("user_facts").select("*").execute()
                if facts_response.data:
                    self.facts = {item["key"]: item["value"] for item in facts_response.data}
                return
            except Exception as e:
                print(f"Supabase load failed: {e}")
        
        # Fallback to local file
        try:
            with open(self.filepath, 'r') as f:
                data = json.load(f)
                self.conversations = data.get("conversations", [])
                self.facts = data.get("facts", {})
        except (FileNotFoundError, json.JSONDecodeError):
            self._save()

    def _save(self):
        if self.use_supabase:
            try:
                # Save to Supabase would go here
                # For now, we'll use local fallback
                pass
            except Exception as e:
                print(f"Supabase save failed: {e}")
        
        # Local fallback
        with open(self.filepath, 'w') as f:
            json.dump({
                "conversations": self.conversations[-200:],  # Keep last 200 messages
                "facts": self.facts
            }, f, indent=2)

    def store(self, user_input, ai_response):
        # Extract user facts
        if "my name is" in user_input.lower():
            name = user_input.split("my name is")[-1].strip().split()[0]
            self.facts["user_name"] = name.title()
        
        # Detect emotional keywords
        emotional_words = {
            "happy": ["joy", "love", "laugh", "happy", "excited"],
            "sad": ["lonely", "hurt", "cry", "sad", "depressed"]
        }
        
        for mood, keywords in emotional_words.items():
            if any(kw in user_input.lower() for kw in keywords):
                self.facts["last_mood"] = mood
        
        # Store conversation
        conversation_entry = {
            "time": datetime.now().isoformat(),
            "user": user_input,
            "ai": ai_response,
            "mood": self.facts.get("last_mood")
        }
        
        self.conversations.append(conversation_entry)
        self._save()

    def get_name(self):
        return self.facts.get("user_name")

    def get_conversation_history(self):
        return self.conversations