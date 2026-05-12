from app.llm.gemini import generate
from app.prompts.system_prompt_list import MAIN_SUMMARY_PROMPT

def make_main_summary(texts: str):

    result = generate(
        system_prompt=MAIN_SUMMARY_PROMPT,
        user_input=texts
    )

    return result