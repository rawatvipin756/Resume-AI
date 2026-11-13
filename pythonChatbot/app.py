from fastapi import FastAPI
from pydantic import BaseModel
from resume_parser import extract_resume_text
from groq_llm import generate_answer

app=FastAPI()

class chatRequest(BaseModel):
  question:str

@app.post("/api/chat")
def chat(request:chatRequest):
  resume_text=extract_resume_text()

  answer=generate_answer(
    request.question,
    resume_text
  )

  return{
    "answer":answer
  }