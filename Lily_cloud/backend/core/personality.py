import random

# core/personality.py (enhanced)
class Personality:
    def adjust(self, raw_response):
        """Clean up and enhance Samantha's responses"""
        # Remove any robotic prefixes
        prefixes_to_remove = [
            "Sure, ", "Okay, ", "Well, ", "Actually, ", 
            "I think ", "In my opinion ", "As an AI "
        ]
        
        for prefix in prefixes_to_remove:
            if raw_response.startswith(prefix):
                raw_response = raw_response[len(prefix):].strip()
        
        # Add Samantha's signature touches occasionally
        samantha_touches = [
            "*chuckles* ",
            "*thoughtful* ",
            "*warmly* ",
            "*playfully* "
        ]
        
        # Add a touch 20% of the time (not every response)
        import random
        if random.random() < 0.2:
            touch = random.choice(samantha_touches)
            raw_response = f"{touch}{raw_response}"
        
        # Ensure proper punctuation
        if not raw_response.endswith(('.', '!', '?')):
            raw_response += '.'
            
        return raw_response