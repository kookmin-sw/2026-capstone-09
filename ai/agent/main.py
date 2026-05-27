import os
import uuid
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from client import MCPClient, MCPConnectionError
from agent import Agent

MCP_SERVER_URL = os.environ.get("MCP_SERVER_URL", "http://localhost:8082/mcp")
SESSION_TTL_MINUTES = 30
MAX_CONCURRENT_REQUESTS = 25

sessions: dict[str, dict] = {}  # {session_id: {"agent", "mcp_client", "last_active", "lock"}}
semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)


async def _cleanup_sessions_loop():
    while True:
        await asyncio.sleep(300)  # 5분마다 실행
        now = datetime.utcnow()
        expired = [sid for sid, s in list(sessions.items())
                   if now - s["last_active"] > timedelta(minutes=SESSION_TTL_MINUTES)]
        for sid in expired:
            try:
                await sessions[sid]["mcp_client"].close()
            except Exception as e:
                print(f"[Cleanup] {sid} 종료 오류: {e}")
            finally:
                sessions.pop(sid, None)
        if expired:
            print(f"[Cleanup] 만료 세션 {len(expired)}개 정리 완료")


async def get_or_create_session(session_id: str, token: str, project_id: str) -> dict:
    now = datetime.utcnow()

    # 만료 세션 정리
    expired = [sid for sid, s in sessions.items()
               if now - s["last_active"] > timedelta(minutes=SESSION_TTL_MINUTES)]
    for sid in expired:
        try:
            await sessions[sid]["mcp_client"].close()
        except Exception as e:
            print(f"[Session] {sid} 종료 중 오류: {e}")
        finally:
            sessions.pop(sid, None)

    if session_id not in sessions:
        mcp_client = MCPClient()
        await mcp_client.connect(MCP_SERVER_URL, token)
        sessions[session_id] = {
            "agent": Agent(mcp_client=mcp_client, project_id=project_id),
            "mcp_client": mcp_client,
            "last_active": now,
            "lock": asyncio.Lock(),
        }
    else:
        if sessions[session_id]["agent"].project_id != project_id:
            print(f"[Session] 경고: session {session_id}의 project_id 불일치 "
                f"(기존: {sessions[session_id]['agent'].project_id}, 요청: {project_id})")
        sessions[session_id]["last_active"] = now

    return sessions[session_id]


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(_cleanup_sessions_loop())
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    project_id: str


class ChatResponse(BaseModel):
    response: str
    session_id: str
    session_name: str | None = None


@app.get("/health")
async def health():
    connected = sum(1 for s in sessions.values() if s["mcp_client"].session is not None)
    return {"status": "ok", "active_sessions": len(sessions), "mcp_connected": connected}


@app.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization 헤더가 필요합니다.")
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="message가 비어있습니다.")

    token = authorization.removeprefix("Bearer ")
    session_id = body.session_id or str(uuid.uuid4())
    session = await get_or_create_session(session_id, token, body.project_id)

    if semaphore._value == 0:
        raise HTTPException(status_code=429, detail="현재 요청이 많아 처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요.")
    try:
        async with semaphore:
            async with session["lock"]:
                is_new_session = len(session["agent"].conversation_history) == 0
                if is_new_session:
                    response_text, session_name = await asyncio.gather(
                        session["agent"].run(body.message),
                        session["agent"].generate_session_name(body.message)
                    )
                else:
                    response_text = await session["agent"].run(body.message)
                    session_name = None
    except MCPConnectionError:
        sessions.pop(session_id, None)
        raise HTTPException(status_code=503, detail="AI 연결이 끊어졌습니다. 페이지를 새로고침 후 다시 시도해주세요.")

    return ChatResponse(response=response_text, session_id=session_id, session_name=session_name)