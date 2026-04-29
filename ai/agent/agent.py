import json
import os
from google import genai
from google.genai import types
import asyncio
 
from client import MCPClient
 
 
class Agent:
    def __init__(self, mcp_client: MCPClient):
        self.mcp_client = mcp_client
        self.client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        self.model = "gemini-2.0-flash"
        self.conversation_history = []
 
    async def _get_gemini_tools(self) -> list[types.Tool]:
        mcp_tools = await self.mcp_client.list_tools()
 
        function_declarations = []
        for tool in mcp_tools:
            function_declarations.append(
                types.FunctionDeclaration(
                    name=tool["name"],
                    description=tool["description"],
                    parameters=tool["input_schema"],
                )
            )
 
        return [types.Tool(function_declarations=function_declarations)]
 
    async def run(self, user_message: str) -> str:
        # 대화 히스토리에 사용자 메시지 추가
        self.conversation_history.append(
            types.Content(role="user", parts=[types.Part(text=user_message)])
        )
 
        tools = await self._get_gemini_tools()
 
        # Gemini가 툴 호출 없이 응답할 때까지 반복
        while True:
            response = await asyncio.to_thread( 
                self.client.models.generate_content,
                model=self.model,
                contents=self.conversation_history,
                config=types.GenerateContentConfig(tools=tools),
            )
 
            candidate = response.candidates[0].content
            self.conversation_history.append(candidate)
 
            # 툴 호출 여부 확인
            tool_calls = [
                part for part in candidate.parts if part.function_call is not None
            ]
 
            # 툴 호출이 없으면 최종 텍스트 응답 반환
            if not tool_calls:
                return candidate.parts[0].text
 
            # 툴 호출이 있으면 실행 후 결과를 히스토리에 추가
            tool_results = []
            for part in tool_calls:
                fc = part.function_call
                print(f"[Agent] 툴 호출: {fc.name}({dict(fc.args)})")
 
                result = await self.mcp_client.call_tool(
                    tool_name=fc.name,
                    arguments=dict(fc.args),
                )
                print(f"[Agent] 툴 결과: {result}")
 
                tool_results.append(
                    types.Part(
                        function_response=types.FunctionResponse(
                            name=fc.name,
                            response={"result": result},
                        )
                    )
                )
 
            # 툴 결과를 히스토리에 추가 후 다시 Gemini 호출
            self.conversation_history.append(
                types.Content(role="user", parts=tool_results)
            )