package kr.flowmeet.external.sqs.config;

import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsAsyncClient;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(SqsProperties.class)
public class SqsConfig {

    private final SqsProperties sqsProperties;

    @Bean
    public SqsAsyncClient sqsAsyncClient() {
        return SqsAsyncClient.builder()
                .region(Region.of(sqsProperties.getRegion()))
                .build();
    }

    @Bean
    public SqsTemplate sqsTemplate(final SqsAsyncClient sqsAsyncClient) {
        return SqsTemplate.builder()
                .sqsAsyncClient(sqsAsyncClient)
                .build();
    }
}