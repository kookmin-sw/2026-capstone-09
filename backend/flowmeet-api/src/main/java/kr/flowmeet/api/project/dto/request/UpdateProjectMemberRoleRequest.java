package kr.flowmeet.api.project.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;

@Schema(description = "프로젝트 멤버 권한 변경 요청")
public record UpdateProjectMemberRoleRequest(
        @Schema(description = "변경할 권한", example = "MEMBER", allowableValues = {"VIEWER", "MEMBER", "OWNER"})
        @NotNull(message = "역할은 필수로 입력해 주세요.")
        ProjectMemberRole role
) {
}
