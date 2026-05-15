package kr.flowmeet.api.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.api.project.dto.request.ProjectUrlRequest;
import kr.flowmeet.api.project.dto.response.ProjectUrlResponse;
import kr.flowmeet.api.project.success.ProjectSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;

@Tag(name = "ProjectUrl", description = "프로젝트 URL")
public interface ProjectUrlApi {

    @Operation(summary = "URL 추가")
    @ApiSuccessCode(code = ProjectSuccessCode.class, name = "ADD_URL")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED"})
    CommonResponse<ProjectUrlResponse> addUrl(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectUrlRequest request
    );

    @Operation(summary = "URL 수정")
    @ApiSuccessCode(code = ProjectSuccessCode.class, name = "UPDATE_URL")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED", "PROJECT_URL_NOT_FOUND"})
    CommonResponse<ProjectUrlResponse> updateUrl(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long urlId,
            @Valid @RequestBody ProjectUrlRequest request
    );

    @Operation(summary = "URL 삭제")
    @ApiSuccessCode(code = ProjectSuccessCode.class, name = "DELETE_URL")
    @ApiErrorCode(code = ProjectErrorCode.class, names = {"PROJECT_ACCESS_DENIED", "PROJECT_URL_NOT_FOUND"})
    CommonResponse<?> deleteUrl(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long urlId
    );
}
