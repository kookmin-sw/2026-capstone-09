import asyncio
from client import MCPClient
from agent import Agent
import sys
 
 
async def main():
    mcp_client = MCPClient()
 
    try:
        await mcp_client.connect_sse("http://localhost:8082/sse")
 
        agent = Agent(mcp_client=mcp_client)
 
        while True:
            user_input = await asyncio.get_running_loop().run_in_executor(None, sys.stdin.readline)
            user_input = user_input.strip()

            if user_input.lower() in ("exit", "quit"):
                break
            if not user_input:
                continue
 
            response = await agent.run(user_input)
            print(f"Agent: {response}\n")
 
    finally:
        await mcp_client.close()
 
 
if __name__ == "__main__":
    asyncio.run(main())