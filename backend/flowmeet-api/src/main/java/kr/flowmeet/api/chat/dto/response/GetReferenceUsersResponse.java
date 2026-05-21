package kr.flowmeet.api.chat.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import kr.flowmeet.domain.project.entity.ProjectMember;

@Schema(description = "참조 가능한 사용자 목록 응답")
public record GetReferenceUsersResponse(
        @Schema(description = "사용자 목록")
        List<ReferencedUserResponse> users
) {
    public static GetReferenceUsersResponse from(final List<ProjectMember> members) {
        return new GetReferenceUsersResponse(
                members.stream().map(ReferencedUserResponse::from).toList()
        );
    }
}