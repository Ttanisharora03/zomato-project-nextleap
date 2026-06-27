# pyrefly: ignore [missing-import]
from langchain_groq import ChatGroq
import os

def get_llm():
    return ChatGroq(
        model="llama-3.1-8b-instant",
        api_key=os.environ.get("GROQ_API_KEY", ""),
        temperature=0.3,
    )
