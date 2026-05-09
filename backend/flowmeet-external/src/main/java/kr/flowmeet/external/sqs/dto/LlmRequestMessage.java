package kr.flowmeet.external.sqs.dto;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record LlmRequestMessage(
        String jobId,
        String taskType,
        String text
) {
}