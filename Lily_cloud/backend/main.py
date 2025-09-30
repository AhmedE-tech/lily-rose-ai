# Lily-Cloud/backend/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid
import json
from datetime import datetime
import os
from dotenv import load_dotenv

from core.brain import OrganicBrain
from core.memory import CrystalMemory
import uvicorn

# Load environment variables
load_dotenv()

app = FastAPI(title="Lily Rose AI Assistant", version="1.0.0")

# CORS for all origins (cloud deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session management for cloud
user_sessions = {}

class UserSession:
    def __init__(self, session_id):
        self.session_id = session_id
        self.brain = OrganicBrain()
        self.created_at = datetime.now()

def get_user_session(session_id: str):
    if session_id not in user_sessions:
        user_sessions[session_id] = UserSession(session_id)
    return user_sessions[session_id]

# Health check for cloud deployment
@app.get("/")
async def root():
    return {"message": "Lily Rose AI Assistant API", "status": "healthy", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# WebSocket for real-time voice communication
@app.websocket("/ws/voice/{session_id}")
async def websocket_voice_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    session = get_user_session(session_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data["type"] == "start_listening":
                await websocket.send_json({"type": "status", "status": "listening"})
                
            elif data["type"] == "audio_data":
                # Simulate voice processing for now
                simulated_text = "I heard your voice! Real Azure STT integration coming soon."
                response = session.brain.chat(simulated_text)
                
                await websocket.send_json({
                    "type": "ai_response", 
                    "text": response,
                    "status": "completed"
                })
                
    except WebSocketDisconnect:
        print(f"Voice client disconnected: {session_id}")

# REST API for text chat
@app.post("/api/chat/{session_id}")
async def text_chat(session_id: str, message: dict):
    session = get_user_session(session_id)
    user_input = message.get("text", "")
    
    if not user_input:
        raise HTTPException(status_code=400, detail="No text provided")
    
    response = session.brain.chat(user_input)
    
    return {
        "session_id": session_id,
        "user_input": user_input,
        "ai_response": response,
        "timestamp": datetime.now().isoformat()
    }

# Get conversation history
@app.get("/api/history/{session_id}")
async def get_history(session_id: str):
    session = get_user_session(session_id)
    history = session.brain.memory.get_conversation_history()
    return {"history": history}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
