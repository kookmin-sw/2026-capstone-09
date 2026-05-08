package kr.flowmeet.api.meeting.event;

import kr.flowmeet.domain.ai.service.AiTaskService;
import kr.flowmeet.external.sqs.SqsMessageSender;
import kr.flowmeet.external.sqs.dto.LlmRequestMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class MeetingEndedEventListener {

    private final SqsMessageSender sqsMessageSender;
    private final AiTaskService aiTaskService;

    @TransactionalEventListener
    public void handle(final MeetingEndedEvent event) {
        try {
            log.info("회의 종료 이벤트 수신 - jobId: {}", event.jobId());
            sqsMessageSender.send(new LlmRequestMessage(event.jobId(), "sub-summary", event.text()));
        } catch (Exception e) {
            log.error("SQS 발행 실패 - jobId: {}", event.jobId(), e);
            aiTaskService.fail(event.jobId(), e.getMessage());
        }
    }
}