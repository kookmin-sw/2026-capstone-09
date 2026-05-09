package kr.flowmeet.api.ai.listener;

import tools.jackson.databind.ObjectMapper;
import io.awspring.cloud.sqs.annotation.SqsListener;
import kr.flowmeet.domain.ai.service.AiTaskService;
import kr.flowmeet.external.sqs.dto.LlmResponseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@ConditionalOnProperty("cloud.aws.sqs.response-queue-url")
@RequiredArgsConstructor
public class LlmResponseListener {

    private final ObjectMapper objectMapper;
    private final AiTaskService aiTaskService;

    @SqsListener("${cloud.aws.sqs.response-queue-url}")
    public void handle(final String payload) {
        try {
            LlmResponseMessage response = objectMapper.readValue(payload, LlmResponseMessage.class);
            log.info("LLM 응답 수신 - jobId: {}, status: {}", response.jobId(), response.status());

            if (!response.isSuccess()) {
                log.error("LLM 처리 실패 - jobId: {}, error: {}", response.jobId(), response.error());
                aiTaskService.fail(response.jobId(), response.error());
                return;
            }

            if (response.isSubSummary()) {
                String summary = response.result().get("summary").asText();
                String mermaidCode = response.result().get("mermaid_code").asText();
                aiTaskService.complete(response.jobId(), summary, mermaidCode);
            } else {
                String result = response.result().asText();
                aiTaskService.complete(response.jobId(), result, null);
            }

            log.info("LLM 처리 완료 - jobId: {}, taskType: {}", response.jobId(), response.taskType());
        } catch (Exception e) {
            log.error("LLM 응답 처리 실패 - payload: {}", payload, e);
            tryMarkFailed(payload, e);
        }
    }

    private void tryMarkFailed(final String payload, final Exception cause) {
        try {
            String jobId = objectMapper.readTree(payload).path("job_id").asText(null);
            if (jobId != null && !jobId.isBlank()) {
                aiTaskService.fail(jobId, cause.getMessage());
            }
        } catch (Exception e) {
            log.error("AiTask FAILED 처리 실패 - payload: {}", payload, e);
        }
    }
}