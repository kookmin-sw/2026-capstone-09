package kr.flowmeet.api.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.project.dto.response.GetAllProjectMembersResponse;
import kr.flowmeet.api.project.dto.request.UpdateProjectMemberRoleRequest;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;

@Tag(name = "ProjectMember", description = "프로젝트 멤버")
public interface ProjectMemberApi {

    @Operation(summary = "멤버 목록 조회")
    CommonResponse<GetAllProjectMembersResponse> getAllMembers(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "멤버 권한 수정", description = "- OWNER 부여: OWNER 권한 필요\n- OWNER 강등: 본인만 가능\n- VIEWER ↔ MEMBER 변경: MEMBER 이상 가능")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_NOT_FOUND", "PROJECT_ACCESS_DENIED", "MEMBER_CANNOT_CHANGE_OWNER"})
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
