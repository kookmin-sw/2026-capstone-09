
package kr.flowmeet.api.project.dto.response;

import java.util.List;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.user.entity.User;

public record GetAllProjectMembersResponse(
        List<ProjectMemberInfo> members
) {
    public static GetAllProjectMembersResponse of(final List<ProjectMember> members) {
        List<ProjectMemberInfo> memberInfos = members.stream()
                .map(member -> ProjectMemberInfo.of(member, member.getUser()))
                .toList();
        return new GetAllProjectMembersResponse(memberInfos);
    }

    public record ProjectMemberInfo(
            Long memberId,
            Long userId,
            String nickname,
            String email,
            String profileImageUrl,
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