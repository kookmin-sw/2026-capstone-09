package kr.flowmeet.mcpserver;

import kr.flowmeet.mcpserver.config.GeminiCompatibleToolCallbackProvider;
import kr.flowmeet.mcpserver.tool.MeetingTools;
import kr.flowmeet.mcpserver.tool.NodeTools;
import kr.flowmeet.mcpserver.tool.PingTool;
import kr.flowmeet.mcpserver.tool.ProjectTools;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class McpServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(McpServerApplication.class, args);
    }

    @Bean
    public ToolCallbackProvider toolCallbackProvider(
            PingTool pingTool,
            NodeTools nodeTools,
            MeetingTools meetingTools,
            ProjectTools projectTools
    ) {
        ToolCallbackProvider original = MethodToolCallbackProvider.builder()
                .toolObjects(pingTool, nodeTools, meetingTools, projectTools)
                .build();
        return new GeminiCompatibleToolCallbackProvider(original);
    }
}