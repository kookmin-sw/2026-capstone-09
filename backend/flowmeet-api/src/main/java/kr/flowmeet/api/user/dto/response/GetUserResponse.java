package kr.flowmeet.api.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.user.entity.User;

@Schema(description = "내 정보 조회 응답")
public record GetUserResponse(
        @Schema(description = "이메일", example = "flowmin@flowmeet.kr")
        String email,
        @Schema(description = "닉네임", example = "플로우민")
        String nickname,
        @Schema(description = "프로필 이미지 URL", example = "https://cdn.flowmeet.kr/profile/91.png")
        String profileImageUrl,
        @Schema(description = "가입 시각", example = "2026-03-01T09:00:00")
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
