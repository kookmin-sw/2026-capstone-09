import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

#client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

def generate(system_prompt: str, user_input: str):
    prompt = f"""
{system_prompt}

[입력]
{user_input}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0)
        )
    )

    return response.text
