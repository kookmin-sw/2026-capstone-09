package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.project.entity.ProjectMember;

@Schema(description = "참조 사용자 정보")
public record ReferencedUserResponse(
        @Schema(description = "사용자 ID", example = "1")
        Long userId,
        @Schema(description = "닉네임", example = "홍길동")
        String nickname,
        @Schema(description = "프로필 이미지 URL", example = "https://example.com/profile.png")
        String profileImageUrl
) {
    public static ReferencedUserResponse from(final ProjectMember member) {
        return new ReferencedUserResponse(
                member.getUserId(),
                member.getUser().getNickname(),
                member.getUser().getProfileImageUrl()
        );
    }
}