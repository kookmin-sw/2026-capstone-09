package kr.flowmeet.api.project.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "프로젝트 초대 수락 응답")
public record AcceptProjectInvitationResponse(
        @Schema(description = "수락한 프로젝트 ID", example = "12")
        Long projectId
) {
    public static AcceptProjectInvitationResponse of(final Long projectId) {
        return new AcceptProjectInvitationResponse(projectId);
    }
}
