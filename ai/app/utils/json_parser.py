import json

def text_to_json(analysis: str):
    cleaned = analysis.replace("```json", "").replace("```", "").strip()
    data = json.loads(cleaned)
    return data

def json_to_text(data: list[str]):
    result = []
    for i, item in enumerate(data, 1):
        result.append(f"{item}")
    return "\n\n".join(result)

def remove_key(data, key_name: str):
    for item in data:
        item.pop(key_name, None)
    return data