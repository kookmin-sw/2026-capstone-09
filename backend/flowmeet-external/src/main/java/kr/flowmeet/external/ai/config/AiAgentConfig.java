package kr.flowmeet.external.ai.config;

import java.net.http.HttpClient;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(AiAgentProperties.class)
public class AiAgentConfig {

    @Bean
    public RestClient aiAgentRestClient(final AiAgentProperties properties) {
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();
        return RestClient.builder()
                .baseUrl(properties.getUrl())
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .build();
    }
}