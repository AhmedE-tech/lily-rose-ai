# utils/speech_to_text.py (Modified for Web)
import azure.cognitiveservices.speech as speechsdk
import time
import queue
import threading
from azure.cognitiveservices.speech import SpeechConfig, SpeechRecognizer, AudioConfig
import io

class WebSpeechRecognizer:
    def __init__(self):
        self.speech_key = "your_azure_key_here"
        self.service_region = "eastus"
        self.recognizer = None
        self.is_listening = False
        self.recognized_text = ""
        self.setup_recognizer()

    def setup_recognizer(self):
        """Setup Azure speech recognizer"""
        speech_config = SpeechConfig(subscription=self.speech_key, region=self.service_region)
        
        # For web audio input, we'll use push stream
        self.audio_stream = speechsdk.audio.PushAudioInputStream()
        audio_config = AudioConfig(stream=self.audio_stream)
        
        self.recognizer = SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
        
        def recognized_callback(evt):
            text = evt.result.text.strip()
            if text:
                print(f"Recognized: {text}")
                self.recognized_text = text

        self.recognizer.recognized.connect(recognized_callback)

    def start_listening(self):
        """Start speech recognition"""
        if self.recognizer and not self.is_listening:
            self.recognized_text = ""
            self.recognizer.start_continuous_recognition()
            self.is_listening = True
            print("Started listening...")

    def stop_listening(self):
        """Stop speech recognition and return final text"""
        if self.recognizer and self.is_listening:
            self.recognizer.stop_continuous_recognition()
            self.is_listening = False
            print("Stopped listening...")
            return self.recognized_text
        return ""

    def push_audio_chunk(self, audio_chunk):
        """Push audio data from web to Azure recognizer"""
        if self.audio_stream and self.is_listening:
            self.audio_stream.write(audio_chunk)

    def process_audio_data(self, audio_data):
        """Process base64 audio data from web"""
        # Convert web audio data to format Azure expects
        # This will depend on the audio format from frontend
        try:
            import base64
            audio_bytes = base64.b64decode(audio_data.split(",")[1])
            self.push_audio_chunk(audio_bytes)
        except Exception as e:
            print(f"Error processing audio data: {e}")