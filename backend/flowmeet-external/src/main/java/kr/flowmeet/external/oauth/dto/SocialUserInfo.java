package kr.flowmeet.external.oauth.dto;

public record SocialUserInfo(
        String socialId,
        String email,
        String name,
        String profileImageUrl
) {
    public static SocialUserInfo of(String socialId, String email, String name, String profileImageUrl) {
        return new SocialUserInfo(socialId, email, name, profileImageUrl);
    }
}
