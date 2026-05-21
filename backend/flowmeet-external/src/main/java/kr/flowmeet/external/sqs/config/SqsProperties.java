package kr.flowmeet.external.sqs.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@RequiredArgsConstructor
@ConfigurationProperties(prefix = "cloud.aws.sqs")
public class SqsProperties {

    private final String requestQueueUrl;
    private final String responseQueueUrl;
    private final String region;
}