package kr.flowmeet.external.sqs.dto;

import tools.jackson.databind.JsonNode;

public record LlmResponseMessage(
        String jobId,
        String taskType,
        String status,
        JsonNode result,
        String error
) {

    public boolean isSuccess() {
        return "success".equals(status);
    }

    public boolean isSubSummary() {
        return "sub-summary".equals(taskType);
    }
}