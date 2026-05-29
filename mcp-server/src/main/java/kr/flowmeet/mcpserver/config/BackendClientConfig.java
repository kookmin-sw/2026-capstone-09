package kr.flowmeet.mcpserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Configuration
public class BackendClientConfig {

    @Bean
    public RestClient backendRestClient(@Value("${backend.url}") String backendUrl) {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(3));
        factory.setConnectionRequestTimeout(Duration.ofSeconds(10));

        return RestClient.builder()
                .baseUrl(backendUrl)
                .requestFactory(factory)
                .build();
    }
}