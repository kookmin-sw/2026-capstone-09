import os
from google import genai
from google.genai import types
 
from client import MCPClient
 
MAX_TOOL_ROUNDS = 10
MAX_HISTORY = 30
 
class Agent:
    def __init__(self, mcp_client: MCPClient, project_id: str):
        self.mcp_client = mcp_client
        self.project_id = project_id
        self.client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
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
                    system_instruction=f"당신은 프로젝트 {self.project_id}의 AI 어시스턴트입니다.",
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

            # 툴 호출이 있으면 실행 후 결과를 히스토리에 추가
            tool_results = []
            for part in tool_calls:
                fc = part.function_call

                all_args = {
                    **dict(fc.args),
                    "projectId": int(self.project_id),
                }

                print(f"[Agent] 툴 호출: {fc.name}({all_args})")
                
                try:
                    result = await self.mcp_client.call_tool(
                        tool_name=fc.name,
                        arguments=all_args,
                    )
                except Exception as e:
                    result = f"Tool execution failed: {str(e)}"

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
            # Gemini는 여러 tool 결과를 반드시 하나의 Content에 묶어서 전달해야 함
            # parts를 분리해서 여러 Content로 나누면 오류 발생하니 주의
            self.conversation_history.append(
                types.Content(role="user", parts=tool_results)
            )

        raise RuntimeError(f"Tool call limit({MAX_TOOL_ROUNDS}회)을 초과했습니다.")