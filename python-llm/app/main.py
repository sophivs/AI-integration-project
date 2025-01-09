import sys
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.llm_service import LLMService

app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str
    lang: str

@app.get("/")
def check_health():
    return JSONResponse(content={"message": "API is running"})

@app.post("/summarize")
async def summarize(data: TextData):
    text = data.text
    lang = data.lang

    # Idiomas suportados
    SUPPORTED_LANGUAGES = {"pt": "Portuguese", "en": "English", "es": "Spanish"}

    if lang not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail="Language not supported")

    # Gera o resumo no idioma solicitado
    summary = llm_service.summarize_text(text, SUPPORTED_LANGUAGES[lang])

    return {"summary": summary}
