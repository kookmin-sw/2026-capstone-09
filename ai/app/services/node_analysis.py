from app.llm.gemini import generate
from app.prompts.system_prompt_list import NODE_ANALYSIS_PROMPT, CREATE_ANAL_MERMAID_PROMPT

def make_node_analysis(text: str):
    result = generate(
        system_prompt=NODE_ANALYSIS_PROMPT,
        user_input=text
    )
    
    return result

def make_anal_mermaid_code(text: str):
    result = generate(
        system_prompt=CREATE_ANAL_MERMAID_PROMPT,
        user_input=text
    )

    return result