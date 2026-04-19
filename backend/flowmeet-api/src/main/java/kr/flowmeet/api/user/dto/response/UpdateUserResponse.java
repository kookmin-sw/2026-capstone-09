package kr.flowmeet.api.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.user.entity.User;

@Schema(description = "내 정보 수정 응답")
public record UpdateUserResponse(
        @Schema(description = "사용자 ID", example = "91")
        Long userId,
        @Schema(description = "이메일", example = "flowmin@flowmeet.kr")
        String email,
        @Schema(description = "닉네임", example = "플로우민")
        String nickname,
        @Schema(description = "프로필 이미지 URL", example = "https://cdn.flowmeet.kr/profile/91.png")
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
