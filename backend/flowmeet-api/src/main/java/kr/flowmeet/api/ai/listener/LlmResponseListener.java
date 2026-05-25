package kr.flowmeet.api.ai.listener;

import java.io.IOException;
import java.util.Map;
import tools.jackson.databind.ObjectMapper;
import io.awspring.cloud.sqs.annotation.SqsListener;
import kr.flowmeet.api.ai.handler.LlmResponseHandler;
import kr.flowmeet.api.notification.sse.SseEmitterStore;
import kr.flowmeet.domain.ai.entity.AiTask;
import kr.flowmeet.domain.ai.service.AiTaskService;
import kr.flowmeet.external.sqs.dto.LlmResponseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Component
@ConditionalOnProperty("cloud.aws.sqs.response-queue-url")
@RequiredArgsConstructor
public class LlmResponseListener {

    private final ObjectMapper objectMapper;
    private final AiTaskService aiTaskService;
    private final LlmResponseHandler llmResponseHandler;
    private final SseEmitterStore sseEmitterStore;

    @SqsListener("${cloud.aws.sqs.response-queue-url}")
    public void handle(final String payload) {
        try {
            LlmResponseMessage response = objectMapper.readValue(payload, LlmResponseMessage.class);
            log.info("LLM 응답 수신 - jobId: {}, status: {}", response.jobId(), response.status());

            if (!response.isSuccess()) {
                log.error("LLM 처리 실패 - jobId: {}, error: {}", response.jobId(), response.error());
                AiTask failedTask = aiTaskService.fail(response.jobId(), response.error());
                notifyUser(failedTask);
                return;
            }

            AiTask completedTask = llmResponseHandler.completeAndSave(response);

            log.info("LLM 처리 완료 - jobId: {}, taskType: {}", response.jobId(), response.taskType());
            notifyUser(completedTask);
        } catch (Exception e) {
            log.error("LLM 응답 처리 실패 - payload: {}", payload, e);
            tryMarkFailed(payload, e);
        }
    }

    private void notifyUser(final AiTask task) {
        sseEmitterStore.findByUserAndProject(task.getUserId(), task.getProjectId())
                .ifPresent(emitter -> {
                    try {
                        emitter.send(SseEmitter.event()
                                .name("ai-task-done")
                                .data(Map.of("jobId", task.getId())));
                    } catch (IOException e) {
                        sseEmitterStore.remove(task.getUserId(), task.getProjectId());
                        log.debug("[SSE] AI 결과 알림 전송 실패, 연결 제거: userId={}, projectId={}", task.getUserId(), task.getProjectId());
                    }
                });
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
