import fitz

def extract_resume_text():
  doc=fitz.open("Vipin_Resume.pdf")
  text=""
  for page in doc:
    text+=page.get_text()+"\n"

  doc.close()
  return text

if __name__ == "__main__":
  resume_text=extract_resume_text()
  print(resume_text)