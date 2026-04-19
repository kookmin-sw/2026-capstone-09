package kr.flowmeet.api.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.project.dto.request.AcceptProjectInvitationRequest;
import kr.flowmeet.api.project.dto.request.CreateProjectRequest;
import kr.flowmeet.api.project.dto.request.InviteProjectMemberRequest;
import kr.flowmeet.api.project.dto.request.UpdateProjectRequest;
import kr.flowmeet.api.project.dto.response.AcceptProjectInvitationResponse;
import kr.flowmeet.api.project.dto.response.CreateProjectResponse;
import kr.flowmeet.api.project.dto.response.GetProjectResponse;
import kr.flowmeet.api.project.dto.response.ProjectSummaryResponse;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.file.exception.FileErrorCode;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import kr.flowmeet.domain.project.service.ProjectSortType;

@Tag(name = "프로젝트")
public interface ProjectApi {

    @Operation(summary = "프로젝트 생성")
    CommonResponse<CreateProjectResponse> createProject(@UserId Long userId,
                                                        @Valid @RequestBody CreateProjectRequest request);

    @Operation(summary = "프로젝트 목록 조회",
            description = "검색어, 정렬(LATEST/NAME), 커서 기반 슬라이싱을 지원합니다. 첫 요청은 cursorId/cursorValue 생략, 이후 응답의 nextCursorId/nextCursorValue를 그대로 전달합니다.")
    CommonResponse<CursorSliceResponse<ProjectSummaryResponse>> getAllProjects(
            @UserId Long userId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "LATEST") ProjectSortType sort,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) String cursorValue,
            @RequestParam(defaultValue = "20") int size);

    @Operation(summary = "프로젝트 상세 조회")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_NOT_FOUND", "PROJECT_ACCESS_DENIED"})
    CommonResponse<GetProjectResponse> getProject(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "프로젝트 수정")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED"})
    CommonResponse<?> updateProject(@UserId Long userId, @PathVariable Long projectId,
                                    @Valid @RequestBody UpdateProjectRequest request);

    @Operation(summary = "프로젝트 이미지 변경", description = "png, jpeg, webp만 허용 (최대 5MB)")
    @ApiErrorCode(code = FileErrorCode.class, names = {"FILE_SIZE_EXCEEDED", "FILE_INVALID_TYPE"})
    CommonResponse<?> updateProfileImage(@UserId Long userId, @PathVariable Long projectId, MultipartFile profileImage);

    @Operation(summary = "프로젝트 삭제", description = "OWNER만 삭제할 수 있습니다.")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_DELETE_FORBIDDEN"})
    CommonResponse<?> deleteProject(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "프로젝트 멤버 초대", description = "초대받는 이메일로 초대 링크가 포함된 메일을 전송합니다.")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"MEMBER_INVITE_FORBIDDEN", "MEMBER_ALREADY_EXISTS"})
    CommonResponse<?> inviteMember(@UserId Long userId, @PathVariable Long projectId,
                                   @Valid @RequestBody InviteProjectMemberRequest request);

    @Operation(summary = "프로젝트 초대 수락", description = "메일 링크의 JWT 토큰을 제출하면 해당 프로젝트에 VIEWER로 합류합니다.")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {
            "INVITATION_TOKEN_INVALID", "INVITATION_TOKEN_EXPIRED", "INVITATION_EMAIL_MISMATCH", "MEMBER_ALREADY_EXISTS"
    })
    CommonResponse<AcceptProjectInvitationResponse> acceptInvitation(@UserId Long userId,
                                                                     @Valid @RequestBody AcceptProjectInvitationRequest request);
}
