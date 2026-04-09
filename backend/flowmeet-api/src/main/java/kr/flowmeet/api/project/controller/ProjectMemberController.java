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
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.project.dto.response.GetAllProjectMembersResponse;
import kr.flowmeet.api.project.facade.ProjectMemberFacade;
import kr.flowmeet.api.project.dto.request.InviteProjectMemberRequest;
import kr.flowmeet.api.project.dto.request.UpdateProjectMemberRoleRequest;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/projects/{projectId}/members")
@RequiredArgsConstructor
public class ProjectMemberController implements ProjectMemberApi {

    private final ProjectMemberFacade projectMemberFacade;

    @Override
    @GetMapping
    public CommonResponse<GetAllProjectMembersResponse> getAllMembers(@UserId Long userId, @PathVariable Long projectId) {
        return CommonResponse.ok(projectMemberFacade.getAllMembers(userId, projectId));
    }

    @Override
    @PostMapping
    public CommonResponse<?> inviteMember(@UserId Long userId, @PathVariable Long projectId,
                                          @Valid @RequestBody InviteProjectMemberRequest request) {
        projectMemberFacade.inviteMember(userId, projectId, request);
        return CommonResponse.ok();
    }

    @Override
    @PatchMapping("/{memberId}/role")
    public CommonResponse<?> updateMemberRole(@UserId Long userId, @PathVariable Long projectId,
                                              @PathVariable Long memberId,
                                              @Valid @RequestBody UpdateProjectMemberRoleRequest request) {
        projectMemberFacade.updateMemberRole(userId, projectId, memberId, request);
        return CommonResponse.ok();
    }

    @Override
    @DeleteMapping("/{memberId}")
    public CommonResponse<?> deleteMember(@UserId Long userId, @PathVariable Long projectId,
                                          @PathVariable Long memberId) {
        projectMemberFacade.deleteMember(userId, projectId, memberId);
        return CommonResponse.ok();
    }

    @Override
    @DeleteMapping("/me")
    public CommonResponse<?> leaveProject(@UserId Long userId, @PathVariable Long projectId) {
        projectMemberFacade.leaveProject(userId, projectId);
        return CommonResponse.ok();
    }
}
