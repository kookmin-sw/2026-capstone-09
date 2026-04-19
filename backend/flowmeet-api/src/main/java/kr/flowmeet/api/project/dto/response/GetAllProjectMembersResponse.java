
package kr.flowmeet.api.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.user.entity.User;

@Schema(description = "프로젝트 멤버 전체 조회 응답")
public record GetAllProjectMembersResponse(
        @Schema(description = "프로젝트 멤버 목록")
        List<ProjectMemberInfo> members
) {
    public static GetAllProjectMembersResponse of(final List<ProjectMember> members) {
        List<ProjectMemberInfo> memberInfos = members.stream()
                .map(member -> ProjectMemberInfo.of(member, member.getUser()))
                .toList();
        return new GetAllProjectMembersResponse(memberInfos);
    }

    @Schema(description = "프로젝트 멤버 정보")
    public record ProjectMemberInfo(
            @Schema(description = "프로젝트 멤버 ID", example = "42")
            Long memberId,
            @Schema(description = "사용자 ID", example = "91")
            Long userId,
            @Schema(description = "닉네임", example = "플로우민")
            String nickname,
            @Schema(description = "이메일", example = "flowmin@flowmeet.kr")
            String email,
            @Schema(description = "프로필 이미지 URL", example = "https://cdn.flowmeet.kr/profile/91.png")
            String profileImageUrl,
            @Schema(description = "프로젝트 내 권한", example = "MEMBER", allowableValues = {"VIEWER", "MEMBER", "OWNER"})
            ProjectMemberRole role
    ) {
        public static ProjectMemberInfo of(final ProjectMember member, final User user) {
            return new ProjectMemberInfo(
                    member.getId(),
                    user.getId(),
                    user.getNickname(),
                    user.getEmail(),
                    user.getProfileImageUrl(),
                    member.getRole()
            );
        }
    }
}
