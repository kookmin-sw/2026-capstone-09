package kr.flowmeet.api.user.dto.response;

public record UpdateProfileImageResponse(
        String profileImageUrl
) {
    public static UpdateProfileImageResponse from(final String profileImageUrl) {
        return new UpdateProfileImageResponse(profileImageUrl);
    }
}