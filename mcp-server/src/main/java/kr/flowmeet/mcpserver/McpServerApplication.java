package kr.flowmeet.mcpserver;

import kr.flowmeet.mcpserver.config.GeminiCompatibleToolCallbackProvider;
import kr.flowmeet.mcpserver.tool.PingTool;
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
    public ToolCallbackProvider toolCallbackProvider(PingTool pingTool) {
        ToolCallbackProvider original = MethodToolCallbackProvider.builder()
                .toolObjects(pingTool)
                .build();
        return new GeminiCompatibleToolCallbackProvider(original);
    }
}