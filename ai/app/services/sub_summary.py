from app.llm.gemini import generate
from app.prompts.system_prompt_list import SUB_SUMMARY_PROMPT, CREATE_MERMAID_PROMPT

def make_sub_summary(text: str):
    result = generate(
        system_prompt=SUB_SUMMARY_PROMPT,
        user_input=text
    )
    
    return result

def make_mermaid_code(text: str):
    result = generate(
        system_prompt=CREATE_MERMAID_PROMPT,
        user_input=text
    )

    return result