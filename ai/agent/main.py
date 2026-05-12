import os
import uuid
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from client import MCPClient
from agent import Agent

MCP_SERVER_URL = os.environ.get("MCP_SERVER_URL", "")
SESSION_TTL_MINUTES = 30

mcp_client: MCPClient = None
sessions: dict[str, dict] = {}  # {session_id: {"agent", "last_active", "lock"}}


async def get_or_create_session(session_id: str) -> dict:
    now = datetime.utcnow()

    # 만료 세션 정리
    expired = [sid for sid, s in sessions.items()
               if now - s["last_active"] > timedelta(minutes=SESSION_TTL_MINUTES)]
    for sid in expired:
        await sessions[sid]["agent"].close()
        del sessions[sid]

    if session_id not in sessions:
        sessions[session_id] = {
            "agent": Agent(mcp_client=mcp_client),
            "last_active": now,
            "lock": asyncio.Lock(), 
        }
    else:
        sessions[session_id]["last_active"] = now

    return sessions[session_id]


@asynccontextmanager
async def lifespan(app: FastAPI):
    global mcp_client
    mcp_client = MCPClient()
    await mcp_client.connect_sse(MCP_SERVER_URL)  # mcp server url 추가해주세요
    yield
    await mcp_client.close()


app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


@app.get("/health") #서버 상태 확인용
async def health():
    return {"status": "ok", "active_sessions": len(sessions)}


@app.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="message가 비어있습니다.")

    session_id = body.session_id or str(uuid.uuid4())
    session = await get_or_create_session(session_id)

    async with session["lock"]:
        response = await session["agent"].run(body.message)

    return ChatResponse(response=response, session_id=session_id)
