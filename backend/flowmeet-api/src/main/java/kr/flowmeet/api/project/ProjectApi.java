package kr.flowmeet.api.project;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.project.dto.CreateProjectRequest;
import kr.flowmeet.api.project.dto.CreateProjectResponse;
import kr.flowmeet.api.project.dto.GetAllProjectsResponse;
import kr.flowmeet.api.project.dto.GetProjectResponse;
import kr.flowmeet.api.project.dto.UpdateProjectRequest;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;

@Tag(name = "Project")
public interface ProjectApi {

    @Operation(summary = "프로젝트 생성")
    CommonResponse<CreateProjectResponse> createProject(@UserId Long userId,
                                                        @Valid @RequestBody CreateProjectRequest request);

    @Operation(summary = "프로젝트 목록 조회", description = "검색어 및 정렬/페이징을 지원합니다.")
    CommonResponse<GetAllProjectsResponse> getAllProjects(
            @UserId Long userId,
            @RequestParam(required = false) String search,
            @ParameterObject @PageableDefault(sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable);

    @Operation(summary = "프로젝트 상세 조회")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_NOT_FOUND", "PROJECT_ACCESS_DENIED"})
    CommonResponse<GetProjectResponse> getProject(@UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "프로젝트 수정")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED"})
    CommonResponse<?> updateProject(@UserId Long userId, @PathVariable Long projectId,
                                    @Valid @RequestBody UpdateProjectRequest request);

    @Operation(summary = "프로젝트 삭제", description = "OWNER만 삭제할 수 있습니다.")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_DELETE_FORBIDDEN"})
    CommonResponse<?> deleteProject(@UserId Long userId, @PathVariable Long projectId);
}
