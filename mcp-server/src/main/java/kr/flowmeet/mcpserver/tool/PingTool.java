package kr.flowmeet.mcpserver.tool;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

@Service
public class PingTool {

    @Tool(description = "MCP 서버 연결 상태를 확인합니다.")
    public String ping() {
        return "pong";
    }
}