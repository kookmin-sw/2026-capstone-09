package kr.flowmeet.external.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AiChatResponse(
        String response,
        @JsonProperty("session_id") String sessionId,
        @JsonProperty("session_name") String sessionName
) {
}