package kr.flowmeet.api.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.project.dto.response.GetAllProjectMembersResponse;
import kr.flowmeet.api.project.dto.request.InviteProjectMemberRequest;
import kr.flowmeet.api.project.dto.request.UpdateProjectMemberRoleRequest;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;

@Tag(name = "Project Member")
public interface ProjectMemberApi {

    @Operation(summary = "멤버 목록 조회")
    CommonResponse<GetAllProjectMembersResponse> getAllMembers(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "멤버 초대")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_ALREADY_EXISTS", "MEMBER_INVITE_FORBIDDEN"})
    CommonResponse<?> inviteMember(@UserId Long userId, @PathVariable Long projectId,
                                   @Valid @RequestBody InviteProjectMemberRequest request);

    @Operation(summary = "멤버 권한 수정", description = "OWNER만 변경할 수 있습니다.")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_NOT_FOUND", "MEMBER_ROLE_CHANGE_FORBIDDEN", "MEMBER_CANNOT_CHANGE_OWNER"})
    CommonResponse<?> updateMemberRole(@UserId Long userId, @PathVariable Long projectId,
                                       @PathVariable Long memberId,
                                       @Valid @RequestBody UpdateProjectMemberRoleRequest request);

    @Operation(summary = "멤버 삭제", description = "OWNER만 삭제할 수 있습니다.")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_NOT_FOUND", "PROJECT_ACCESS_DENIED", "MEMBER_CANNOT_DELETE_OWNER"})
    CommonResponse<?> deleteMember(@UserId Long userId, @PathVariable Long projectId,
                                   @PathVariable Long memberId);

    @Operation(summary = "프로젝트 나가기")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_OWNER_CANNOT_LEAVE"})
    CommonResponse<?> leaveProject(@UserId Long userId, @PathVariable Long projectId);
}
