package kr.flowmeet.auth.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
    String secretKey,
    String issuer,
    long accessTokenExpiry,
    long invitationTokenExpiry
) {
}
