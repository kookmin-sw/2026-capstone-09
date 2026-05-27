import os
import asyncio
from google import genai
from google.genai import types
 
from client import MCPClient, MCPConnectionError
 
MAX_TOOL_ROUNDS = 10
MAX_HISTORY = 30
 
class Agent:
    def __init__(self, mcp_client: MCPClient, project_id: str):
        self.mcp_client = mcp_client
        self.project_id = project_id
        self.client = genai.Client(
            api_key=os.environ["GEMINI_API_KEY"],
            http_options=types.HttpOptions(
                retry_options=types.HttpRetryOptions(
                    attempts=4,       # 최초 1회 + 재시도 3회
                    initial_delay=2.0,
                    max_delay=30.0,
                )
            ),
        )
        self.model = "gemini-2.5-flash"
        self.conversation_history = []
        self._tools = None

    async def close(self):
        pass

    async def generate_session_name(self, first_message: str) -> str:
        response = await self.client.aio.models.generate_content(
            model=self.model,
            contents=[
                types.Content(role="user", parts=[types.Part(text=(
                    f"다음 메시지를 보고 채팅 세션 이름을 한국어로 10자 이내로 만들어줘. "
                    f"이름만 출력하고 다른 말은 하지 마.\n\n메시지: {first_message}"
                ))])
            ],
        )
        return response.text.strip()

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
 
    async def _execute_tool(self, fc: types.FunctionCall) -> types.Part:
        all_args = {**dict(fc.args), "projectId": int(self.project_id)}
        print(f"[Agent] 툴 호출: {fc.name}({all_args})")
        try:
            result = await self.mcp_client.call_tool(tool_name=fc.name, arguments=all_args)
        except MCPConnectionError:
            raise
        except Exception as e:
            result = f"Tool execution failed: {str(e)}"
        print(f"[Agent] 툴 결과: {result}")
        return types.Part(
            function_response=types.FunctionResponse(name=fc.name, response={"result": result})
        )

    async def run(self, user_message: str) -> str:

        self.conversation_history = self.conversation_history[-MAX_HISTORY:]
        # tool_call/response 쌍 중간에서 잘리면 Gemini 오류 발생 — 텍스트 user 메시지부터 시작
        while self.conversation_history and (
            self.conversation_history[0].role != "user"
            or any(p.function_response is not None for p in self.conversation_history[0].parts)
        ):
            self.conversation_history.pop(0)

        # 대화 히스토리에 사용자 메시지 추가
        self.conversation_history.append(
            types.Content(role="user", parts=[types.Part(text=user_message)])
        )
 
        
        if self._tools is None:
            self._tools = await self._get_gemini_tools()
 
        # Gemini가 툴 호출 없이 응답할 때까지 반복
        for _ in range(MAX_TOOL_ROUNDS):
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=self.conversation_history,
                config=types.GenerateContentConfig(
                    tools=self._tools,
                    system_instruction=(
                        f"당신은 플로우밋 프로젝트 관리 AI 어시스턴트입니다. "
                        f"현재 작업 중인 projectId는 {self.project_id}입니다. "
                        f"모든 도구 호출 시 projectId는 반드시 {self.project_id}를 사용하세요. "
                        f"내부 ID(nodeId, userId, projectId, memberId 등)는 응답에 절대 포함하지 마세요. "
                        f"노드명을 언급할 때 '기획 노드 (ID:128)'처럼 괄호 안에 노드 ID를 함께 표기하지 마세요. "
                        f"숫자 ID는 도구 호출에만 사용하고, 사용자 응답에는 이름이나 제목만 사용하세요. "
                    ),
                    thinking_config=types.ThinkingConfig(
                        thinking_budget=512 # 응답 너무 느리면 0으로 변경 가능
                    ),
                ),
            )
            if not response.candidates:
                raise RuntimeError("Gemini로부터 응답이 없습니다. (candidates 비어있음)")

            candidate = response.candidates[0].content
            self.conversation_history.append(candidate)

            # 툴 호출 여부 확인
            tool_calls = [
                part for part in candidate.parts if part.function_call is not None
            ]

            # 툴 호출이 없으면 최종 텍스트 응답 반환
            if not tool_calls:
                for part in candidate.parts:
                    if part.text:
                        return part.text
                return ""  # 텍스트 부분이 없는 경우 빈 문자열 반환(LLM 오류처리)

            # 툴 호출이 있으면 병렬 실행 후 결과를 히스토리에 추가
            tool_results = await asyncio.gather(*[
                self._execute_tool(part.function_call) for part in tool_calls
            ])

            # 툴 결과를 히스토리에 추가 후 다시 Gemini 호출
            # Gemini는 여러 tool 결과를 반드시 하나의 Content에 묶어서 전달해야 함
            # parts를 분리해서 여러 Content로 나누면 오류 발생하니 주의
            self.conversation_history.append(
                types.Content(role="user", parts=tool_results)
            )

        raise RuntimeError(f"Tool call limit({MAX_TOOL_ROUNDS}회)을 초과했습니다.")