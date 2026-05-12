import asyncio
from contextlib import AsyncExitStack
from typing import Any
 
from mcp import ClientSession
from mcp.client.sse import sse_client
 
 
class MCPClient:
    def __init__(self):
        self.session: ClientSession | None = None
        self.exit_stack = AsyncExitStack()
 
    async def connect_sse(self, url: str):
        read, write = await self.exit_stack.enter_async_context(
            sse_client(url)
        )
        self.session = await self.exit_stack.enter_async_context(
            ClientSession(read, write)
        )
        await self.session.initialize()
        print("[MCP] SSE 서버 연결 완료")
 
    async def list_tools(self) -> list[dict]:
        if not self.session:
            raise RuntimeError("서버에 연결되지 않았습니다.")
        
        response = await self.session.list_tools()
        tools = [
            {
                "name": tool.name,
                "description": tool.description,
                "input_schema": dict(tool.inputSchema) if tool.inputSchema else {},
            }
            for tool in response.tools
        ]
        return tools
 
    async def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> str:
        if not self.session:
            raise RuntimeError("서버에 연결되지 않았습니다.")
        
        response = await self.session.call_tool(tool_name, arguments)
        
        # 에러 체크 추가
        if response.isError:
            raise RuntimeError(f"Tool '{tool_name}' 실행 실패: {response.content}")
        
        result = "\n".join(
            block.text for block in response.content if hasattr(block, "text")
        )
        return result
 
    async def close(self):
        await self.exit_stack.aclose()
        print("[MCP] 서버 연결 종료")