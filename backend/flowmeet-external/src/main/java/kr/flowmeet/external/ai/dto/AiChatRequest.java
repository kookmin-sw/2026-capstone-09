package kr.flowmeet.external.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AiChatRequest(
        String message,
        @JsonProperty("session_id") String sessionId,
        @JsonProperty("project_id") Long projectId
) {
}