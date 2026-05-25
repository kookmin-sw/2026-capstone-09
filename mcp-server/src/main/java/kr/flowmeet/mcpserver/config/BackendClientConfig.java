package kr.flowmeet.mcpserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class BackendClientConfig {

    @Bean
    public RestClient backendRestClient(@Value("${backend.url}") String backendUrl) {
        return RestClient.builder()
                .baseUrl(backendUrl)
                .build();
    }
}