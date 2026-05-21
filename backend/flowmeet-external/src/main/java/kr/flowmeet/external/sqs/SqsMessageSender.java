package kr.flowmeet.external.sqs;

import io.awspring.cloud.sqs.operations.SqsTemplate;
import kr.flowmeet.external.sqs.config.SqsProperties;
import kr.flowmeet.external.sqs.dto.LlmRequestMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SqsMessageSender {

    private final SqsTemplate sqsTemplate;
    private final SqsProperties sqsProperties;

    public void send(final LlmRequestMessage message) {
        log.info("SQS 메시지 전송 - jobId: {}, taskType: {}", message.jobId(), message.taskType());
        sqsTemplate.send(sendOptions -> sendOptions
                .queue(sqsProperties.getRequestQueueUrl())
                .payload(message)
        );
        log.info("SQS 메시지 전송 완료 - jobId: {}", message.jobId());
    }
}