package kr.flowmeet.api.project;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.project.dto.CreateProjectRequest;
import kr.flowmeet.api.project.dto.CreateProjectResponse;
import kr.flowmeet.api.project.dto.GetAllProjectsResponse;
import kr.flowmeet.api.project.dto.GetProjectResponse;
import kr.flowmeet.api.project.dto.UpdateProjectRequest;
import kr.flowmeet.auth.annotation.UserId;

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
    public CommonResponse<GetAllProjectsResponse> getAllProjects(
            @UserId Long userId,
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return CommonResponse.ok(projectFacade.getAllProjects(userId, search, pageable));
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
    @DeleteMapping("/{projectId}")
    public CommonResponse<?> deleteProject(@UserId Long userId, @PathVariable Long projectId) {
        projectFacade.deleteProject(userId, projectId);
        return CommonResponse.ok();
    }
}
