package kr.flowmeet.api.common.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "frontend")
public record FrontendProperties(
        String baseUrl,
        String invitationPath
) {
    public String buildInvitationUrl(final String token) {
        return baseUrl + invitationPath + "/" + token;
    }
}
