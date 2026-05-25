package kr.flowmeet.external.oauth.config;

import kr.flowmeet.external.oauth.GoogleOAuthClient;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(OAuthGoogleProperties.class)
public class OAuthClientConfig {

    @Bean
    public RestClient socialOAuthRestClient() {
        return RestClient.builder().build();
    }

    @Bean
    public GoogleOAuthClient googleOAuthClient(
            final OAuthGoogleProperties properties,
            final RestClient socialOAuthRestClient
    ) {
        return new GoogleOAuthClient(properties, socialOAuthRestClient);
    }
}
