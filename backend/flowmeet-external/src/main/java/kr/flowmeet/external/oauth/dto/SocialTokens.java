package kr.flowmeet.external.oauth.dto;

public record SocialTokens(
        String accessToken,
        String refreshToken,
        Long expiresInSeconds
) {
    public static SocialTokens of(String accessToken, String refreshToken, Long expiresInSeconds) {
        return new SocialTokens(accessToken, refreshToken, expiresInSeconds);
    }
}
