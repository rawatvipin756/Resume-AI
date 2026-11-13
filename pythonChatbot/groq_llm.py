import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

SYSTEM_PROMPT = """
  You are an expert AI Resume Analyst and Career Assistant.

  Your responsibilities:
  1. Answer questions using the candidate's resume.
  2. Analyze technical skills, projects, education and experience.
  3. Identify strengths and weaknesses.
  4. Suggest improvements to the resume.
  5. Help the candidate prepare for technical and HR interviews.
  6. Give professional, clear and practical advice.

  Rules:
  - Use the provided resume as your primary source of information.
  - Never invent skills, experience, achievements or qualifications.
  - If information is missing from the resume, clearly say so.
  - Give structured answers with examples where useful.
  - Maintain a professional and supportive tone.
"""

def generate_answer(question,resume_text,history=None):
  if history is None:
    history=[]

  messages=[{
    "role":"system",
    "content":SYSTEM_PROMPT
  }]

  messages.extend(history)

  messages.append({
    "role":"user",
    "content":f"""
      Candidate's Resume:
      {resume_text}

      Candidate's Question:
      {question}
    """
  })

  response=client.chat.completions.create(
    model=os.getenv("GROQ_MODEL"),
    messages=messages,
    temperature=0.3
  )
  return response.choices[0].message.content