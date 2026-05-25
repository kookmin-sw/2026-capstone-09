from fastapi import APIRouter, UploadFile, File
from app.services.node_analysis import make_node_analysis, make_anal_mermaid_code
import json

router = APIRouter()

@router.post("/node-analysis")
async def node_analysis(file: UploadFile = File(...)):
    text = await file.read()
    text = text.decode("utf-8") 

    analysis = make_node_analysis(text)
    analysis = analysis.replace("```json", "").replace("```", "").strip()
    analysis_dict = json.loads(analysis)
    
    mermaid_code = make_anal_mermaid_code(analysis)
    mermaid_code = mermaid_code.replace("```mermaid", "").replace("```", "").strip()

    return {
        **analysis_dict,
        "mermaid_code": mermaid_code
    }