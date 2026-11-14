from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel,Field

from resume_parser import extract_resume_text
from groq_llm import generate_answer_stream

app=FastAPI()

class chatRequest(BaseModel):
  question:str
  history:list[dict]=Field(default_factory=list)

@app.post("/api/chat")
def chat(request:chatRequest):
  resume_text=extract_resume_text()

  response_stream=generate_answer_stream(
    request.question,
    resume_text,
    request.history
  )

  return StreamingResponse(
    response_stream,
    media_type="text/plain"
  )