package kr.flowmeet.external.ai.dto;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record AiChatRequest(
        String message,
        String sessionId,
        String projectId
) {
}