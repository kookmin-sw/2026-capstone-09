package kr.flowmeet.external.ai;

import java.util.Map;
import kr.flowmeet.external.ai.dto.AiChatResponse;
import kr.flowmeet.external.exception.ExternalException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiAgentClient {

    private final RestClient aiAgentRestClient;

    public AiChatResponse chat(final String message, final String sessionId, final Long projectId, final String authorization) {
        Map<String, String> requestBody = Map.of(
                "message", message,
                "session_id", sessionId,
                "project_id", String.valueOf(projectId)
        );

        log.info("AI Agent 호출 - sessionId: {}", sessionId);

        try {
            return aiAgentRestClient.post()
                    .uri("/chat")
                    .header("Authorization", authorization)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(AiChatResponse.class);
        } catch (Exception e) {
            log.error("AI Agent 호출 실패 - sessionId: {}", sessionId, e);
            throw new ExternalException(AiAgentErrorCode.AI_AGENT_UNAVAILABLE);
        }
    }
}