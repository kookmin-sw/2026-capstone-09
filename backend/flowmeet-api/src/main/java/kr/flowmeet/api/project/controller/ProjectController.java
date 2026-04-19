package kr.flowmeet.api.project.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.api.project.dto.request.AcceptProjectInvitationRequest;
import kr.flowmeet.api.project.dto.request.CreateProjectRequest;
import kr.flowmeet.api.project.dto.request.InviteProjectMemberRequest;
import kr.flowmeet.api.project.dto.request.UpdateProjectRequest;
import kr.flowmeet.api.project.dto.response.AcceptProjectInvitationResponse;
import kr.flowmeet.api.project.dto.response.CreateProjectResponse;
import kr.flowmeet.api.project.dto.response.GetProjectResponse;
import kr.flowmeet.api.project.dto.response.ProjectSummaryResponse;
import kr.flowmeet.api.project.facade.ProjectFacade;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.project.service.ProjectSortType;

@RestController
@RequestMapping("/v1/projects")
@RequiredArgsConstructor
public class ProjectController implements ProjectApi {

    private final ProjectFacade projectFacade;

    @Override
    @PostMapping
    public CommonResponse<CreateProjectResponse> createProject(@UserId Long userId,
                                                               @Valid @RequestBody CreateProjectRequest request) {
        return CommonResponse.ok(projectFacade.createProject(userId, request));
    }

    @Override
    @GetMapping
    public CommonResponse<CursorSliceResponse<ProjectSummaryResponse>> getAllProjects(
            @UserId Long userId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "LATEST") ProjectSortType sort,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) String cursorValue,
            @RequestParam(defaultValue = "20") int size
    ) {
        return CommonResponse.ok(projectFacade.getAllProjects(userId, search, sort, cursorId, cursorValue, size));
    }

    @Override
    @GetMapping("/{projectId}")
    public CommonResponse<GetProjectResponse> getProject(@UserId Long userId, @PathVariable Long projectId) {
        return CommonResponse.ok(projectFacade.getProject(userId, projectId));
    }

    @Override
    @PatchMapping("/{projectId}")
    public CommonResponse<?> updateProject(@UserId Long userId, @PathVariable Long projectId,
                                           @Valid @RequestBody UpdateProjectRequest request) {
        projectFacade.updateProject(userId, projectId, request);
        return CommonResponse.ok();
    }

    @Override
    @PatchMapping(value = "/{projectId}/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResponse<?> updateProfileImage(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestPart("profileImage") MultipartFile profileImage) {
        projectFacade.updateProfileImage(userId, projectId, profileImage);
        return CommonResponse.ok();
    }

    @Override
    @DeleteMapping("/{projectId}")
    public CommonResponse<?> deleteProject(@UserId Long userId, @PathVariable Long projectId) {
        projectFacade.deleteProject(userId, projectId);
        return CommonResponse.ok();
    }

    @Override
    @PostMapping("/{projectId}/invite")
    public CommonResponse<?> inviteMember(@UserId Long userId, @PathVariable Long projectId,
                                          @Valid @RequestBody InviteProjectMemberRequest request) {
        projectFacade.inviteMember(userId, projectId, request);
        return CommonResponse.ok();
    }

    @Override
    @PostMapping("/invitations/accept")
    public CommonResponse<AcceptProjectInvitationResponse> acceptInvitation(@UserId Long userId,
                                                                            @Valid @RequestBody AcceptProjectInvitationRequest request) {
        return CommonResponse.ok(projectFacade.acceptInvitation(userId, request));
    }
}
