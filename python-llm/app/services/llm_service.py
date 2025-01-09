import os
from langchain_openai import OpenAI


class LLMService:
    def __init__(self):
        # Aqui assumimos que há uma variável de ambiente HF_TOKEN configurada.
        self.llm = OpenAI(
            temperature=0.5,
            top_p=0.7,
            api_key=os.getenv("HF_TOKEN"),  # type: ignore
            base_url="https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1",
        )

    def summarize_text(self, text: str, lang: str) -> str:
        # Traduz o texto original para o idioma solicitado
        prompt = f"Traduza o texto a seguir para a linguagem {lang}:\n\n{text}"
        response = self.llm.invoke(prompt)

        # Cria o prompt para geração de resumo no idioma solicitado
        prompt = f"Resuma o texto a seguir na linguagem {lang}:\n\n{response}"
        response = self.llm.invoke(prompt)

        return response
