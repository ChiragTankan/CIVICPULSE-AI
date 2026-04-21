from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
from services.vertex_service import GeminiService
from services.civic_service import CivicService
from services.calendar_service import CalendarService
from fastapi.responses import Response

app = FastAPI(title="CivicPulse AI API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for simplicity (should be handled securely in prod)
API_KEYS = {
    "VERTEX_AI_KEY": os.getenv("VERTEX_AI_KEY"),
    "CIVIC_API_KEY": os.getenv("CIVIC_API_KEY"),
    "GOOGLE_CLOUD_PROJECT": os.getenv("GOOGLE_CLOUD_PROJECT")
}

class KeysUpdate(BaseModel):
    vertex_ai_key: Optional[str] = None
    civic_api_key: Optional[str] = None
    google_cloud_project: Optional[str] = None

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/config-status")
def get_config_status():
    return {
        "vertex_ai_configured": bool(API_KEYS["VERTEX_AI_KEY"]),
        "civic_api_configured": bool(API_KEYS["CIVIC_API_KEY"]),
        "project_configured": bool(API_KEYS["GOOGLE_CLOUD_PROJECT"])
    }

@app.post("/api/setup-keys")
async def setup_keys(keys: KeysUpdate):
    if keys.vertex_ai_key:
        API_KEYS["VERTEX_AI_KEY"] = keys.vertex_ai_key
        os.environ["VERTEX_AI_KEY"] = keys.vertex_ai_key
    if keys.civic_api_key:
        API_KEYS["CIVIC_API_KEY"] = keys.civic_api_key
        os.environ["CIVIC_API_KEY"] = keys.civic_api_key
    if keys.google_cloud_project:
        API_KEYS["GOOGLE_CLOUD_PROJECT"] = keys.google_cloud_project
        os.environ["GOOGLE_CLOUD_PROJECT"] = keys.google_cloud_project
    
    return {"message": "Keys updated successfully"}

class ChatMessage(BaseModel):
    role: str
    parts: List[str]

@app.post("/api/chat")
async def chat_with_agent(messages: List[ChatMessage]):
    if not API_KEYS["VERTEX_AI_KEY"]:
        raise HTTPException(status_code=400, detail="Gemini API not configured")
    
    gemini_service = GeminiService(api_key=API_KEYS["VERTEX_AI_KEY"])
    try:
        chat_history = [m.dict() for m in messages]
        response = gemini_service.get_chat_response(chat_history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ballot-decoder")
async def decode_ballot(file: UploadFile = File(...)):
    if not API_KEYS["VERTEX_AI_KEY"]:
        raise HTTPException(status_code=400, detail="Gemini API not configured")
    
    contents = await file.read()
    gemini_service = GeminiService(api_key=API_KEYS["VERTEX_AI_KEY"])
    try:
        analysis = await gemini_service.analyze_ballot(contents, file.content_type)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/representative-info")
async def get_reps(address: str = Form(...)):
    civic_service = CivicService(api_key=API_KEYS["CIVIC_API_KEY"])
    reps = civic_service.get_representatives(address)
    voter_info = civic_service.get_voter_info(address)
    return {"representatives": reps, "voter_info": voter_info}

class CalendarEvent(BaseModel):
    summary: str
    description: str
    date: str

@app.post("/api/generate-calendar")
async def generate_calendar(events: List[CalendarEvent]):
    calendar_service = CalendarService()
    ics_content = calendar_service.generate_ics([e.dict() for e in events])
    return Response(
        content=ics_content,
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=civic_deadlines.ics"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
