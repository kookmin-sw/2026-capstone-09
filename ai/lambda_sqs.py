import json
import boto3
import os
from app.services.sub_summary import make_sub_summary, make_mermaid_code
from app.services.main_summary import make_main_summary

sqs = boto3.client("sqs")
RESPONSE_QUEUE_URL = os.environ["RESPONSE_QUEUE_URL"]

def handler(event, context):
    for record in event["Records"]:
        body = json.loads(record["body"])

        job_id    = body["job_id"]
        task_type = body["task_type"] 
        text      = body["text"]

        try:
            if task_type == "sub-summary":
                summary      = make_sub_summary(text)
                mermaid_code = make_mermaid_code(text)
                mermaid_code = mermaid_code.replace("```mermaid", "").replace("```", "").strip()
                result = {
                    "summary": summary,
                    "mermaid_code": mermaid_code
                }

            elif task_type == "main-summary":
                result = make_main_summary(text)

            else:
                raise ValueError(f"Unknown task_type: {task_type}")

            response_body = {
                "job_id": job_id,
                "task_type": task_type,
                "status": "success",
                "result": result
            }

        except Exception as e:
            response_body = {
                "job_id": job_id,
                "task_type": task_type,
                "status": "error",
                "error": str(e)
            }

        sqs.send_message(
            QueueUrl=RESPONSE_QUEUE_URL,
            MessageBody=json.dumps(response_body, ensure_ascii=False)
        )