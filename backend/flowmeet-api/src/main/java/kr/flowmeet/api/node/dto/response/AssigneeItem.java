package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.user.entity.User;

@Schema(description = "노드 담당자 정보")
public record AssigneeItem(
        @Schema(description = "사용자 ID", example = "91")
        Long userId,
        @Schema(description = "닉네임", example = "플로우민")
        String nickname,
        @Schema(description = "이메일", example = "flowmin@flowmeet.kr")
        String email,
        @Schema(description = "프로필 이미지 URL", example = "https://cdn.flowmeet.kr/profile/91.png")
        String profileImageUrl
) {

    public static AssigneeItem from(final User user) {
        return new AssigneeItem(user.getId(), user.getNickname(), user.getEmail(), user.getProfileImageUrl());
    }
}
