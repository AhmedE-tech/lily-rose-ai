# utils/text_to_speech.py (Modified for Web)
from elevenlabs.client import ElevenLabs
import base64
import io

class WebTTS:
    def __init__(self):
        self.client = ElevenLabs(
            api_key='sk_a21b4dcb70bf5a15fd4e22da874e569687f3a89be60a0ce3',
        )

    def generate_audio(self, text):
        """Generate audio and return as base64 for web streaming"""
        try:
            # Generate audio
            audio = self.client.text_to_speech.convert(
                text=text,
                voice_id="jenKdO4Y1rvPPeYfP8Rp",
                model_id="eleven_v3",
                output_format="mp3_44100_128"
            )
            
            # Convert to base64 for web transmission
            audio_bytes = b"".join(audio)
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            
            return {
                "audio_data": audio_base64,
                "format": "audio/mp3",
                "text": text
            }
            
        except Exception as e:
            print(f"TTS Error: {e}")
            return None

    def stream_audio(self, text):
        """Generator for streaming audio chunks"""
        try:
            audio_stream = self.client.text_to_speech.stream(
                text=text,
                voice_id="jenKdO4Y1rvPPeYfP8Rp",
                model_id="eleven_v3"
            )
            
            for chunk in audio_stream:
                yield chunk
                
        except Exception as e:
            print(f"TTS Streaming Error: {e}")