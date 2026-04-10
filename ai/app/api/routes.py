from fastapi import APIRouter, UploadFile, File
from app.services.sub_summary import make_sub_summary, make_mermaid_code
from app.services.main_summary import make_main_summary
from app.services.node_analysis import make_node_analysis, make_anal_mermaid_code
from app.utils.json_parser import text_to_json, json_to_text, remove_key

router = APIRouter()

@router.post("/sub-summary")
async def sub_summary(file: UploadFile = File(...)):
    text = await file.read()
    text = text.decode("utf-8") 

    summary = make_sub_summary(text)
    mermaid_code = make_mermaid_code(text)
    
    mermaid_code = mermaid_code.replace("```mermaid", "").replace("```", "").strip()
    
    return {
        "summary": summary,
        "mermaid_code": mermaid_code
    }

@router.post("/main-summary")
async def main_summary(file: UploadFile = File(...)):
    text = await file.read()
    text = text.decode("utf-8") 

    result = make_main_summary(text)
    result = result.replace("```json", "").replace("```", "").strip()
    
    return result

@router.post("/node-analysis")
async def node_analysis(file: UploadFile = File(...)):
    text = await file.read()
    text = text.decode("utf-8") 

    analysis = make_node_analysis(text)
    mermaid_code = make_anal_mermaid_code(analysis)
    
    analysis = analysis.replace("```json", "").replace("```", "").strip()
    mermaid_code = mermaid_code.replace("```mermaid", "").replace("```", "").strip()

    return {
        "analysis": analysis,
        "mermaid_code": mermaid_code
    }