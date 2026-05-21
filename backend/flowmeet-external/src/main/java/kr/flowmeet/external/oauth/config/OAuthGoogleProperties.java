package kr.flowmeet.external.oauth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "oauth.google")
public record OAuthGoogleProperties(
        String clientId,
        String clientSecret,
        String tokenUri,
        String userInfoUri
) {
}
