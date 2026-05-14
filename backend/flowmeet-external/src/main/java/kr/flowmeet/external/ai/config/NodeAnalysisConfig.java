package kr.flowmeet.external.ai.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;

@Configuration
@EnableConfigurationProperties(NodeAnalysisProperties.class)
public class NodeAnalysisConfig {

    @Bean
    public RestClient nodeAnalysisRestClient(final AwsCredentialsProvider credentialsProvider) {
        return RestClient.builder()
                .requestInterceptor(new Aws4SigningInterceptor(credentialsProvider))
                .build();
    }
}