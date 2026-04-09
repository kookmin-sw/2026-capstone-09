package kr.flowmeet.api.user.dto.response;

import kr.flowmeet.domain.user.entity.User;

public record UpdateUserResponse(
        Long userId,
        String email,
        String nickname,
        String profileImageUrl
) {
    public static UpdateUserResponse from(final User user) {
        return new UpdateUserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl()
        );
    }
}