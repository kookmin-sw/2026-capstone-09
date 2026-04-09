package kr.flowmeet.api.user.dto.response;

import java.time.LocalDateTime;
import kr.flowmeet.domain.user.entity.User;

public record GetUserResponse(
        String email,
        String nickname,
        String profileImageUrl,
        LocalDateTime createdAt
) {
    public static GetUserResponse from(final User user) {
        return new GetUserResponse(
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getCreatedAt()
        );
    }
}