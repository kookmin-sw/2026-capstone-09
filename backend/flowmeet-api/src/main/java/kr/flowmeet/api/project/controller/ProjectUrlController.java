package kr.flowmeet.api.project.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.project.dto.request.ProjectUrlRequest;
import kr.flowmeet.api.project.facade.ProjectUrlFacade;
import kr.flowmeet.api.project.dto.response.ProjectUrlResponse;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/projects/{projectId}/urls")
@RequiredArgsConstructor
public class ProjectUrlController implements ProjectUrlApi {

    private final ProjectUrlFacade projectUrlFacade;

    @Override
    @PostMapping
    public CommonResponse<ProjectUrlResponse> addUrl(@UserId Long userId, @PathVariable Long projectId,
                                                     @Valid @RequestBody ProjectUrlRequest request) {
        return CommonResponse.ok(projectUrlFacade.addUrl(userId, projectId, request));
    }

    @Override
    @PatchMapping("/{urlId}")
    public CommonResponse<ProjectUrlResponse> updateUrl(@UserId Long userId, @PathVariable Long projectId,
                                                        @PathVariable Long urlId,
                                                        @Valid @RequestBody ProjectUrlRequest request) {
        return CommonResponse.ok(projectUrlFacade.updateUrl(userId, projectId, urlId, request));
    }

    @Override
    @DeleteMapping("/{urlId}")
    public CommonResponse<?> deleteUrl(@UserId Long userId, @PathVariable Long projectId,
                                       @PathVariable Long urlId) {
        projectUrlFacade.deleteUrl(userId, projectId, urlId);
        return CommonResponse.ok();
    }
}
