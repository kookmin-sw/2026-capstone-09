package kr.flowmeet.api.node.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.node.dto.request.AddNodeTagRequest;
import kr.flowmeet.api.node.dto.request.CreateTagRequest;
import kr.flowmeet.api.node.dto.request.UpdateTagRequest;
import kr.flowmeet.api.node.dto.response.GetAllTagsResponse;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.node.exception.TagErrorCode;

@Tag(name = "Tag")
public interface TagApi {

    @Operation(summary = "태그 목록 조회", description = "프로젝트의 전체 태그 목록을 조회합니다.")
    CommonResponse<GetAllTagsResponse> getAllTags(
            @UserId Long userId,
            @PathVariable Long projectId
    );

    @Operation(summary = "태그 생성", description = "새 태그를 생성합니다.")
    @ApiErrorCode(code = TagErrorCode.class, names = {"TAG_NAME_DUPLICATED"})
    CommonResponse<?> createTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTagRequest request
    );

    @Operation(summary = "태그 수정", description = "태그 이름 또는 색상을 수정합니다.")
    @ApiErrorCode(code = TagErrorCode.class, names = {"TAG_NOT_FOUND", "TAG_NAME_DUPLICATED"})
    CommonResponse<?> updateTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long tagId,
            @Valid @RequestBody UpdateTagRequest request
    );

    @Operation(summary = "태그 삭제", description = "태그를 삭제합니다. 연결된 노드 태그도 함께 삭제됩니다.")
    @ApiErrorCode(code = TagErrorCode.class, names = {"TAG_NOT_FOUND"})
    CommonResponse<?> deleteTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long tagId
    );

    @Operation(summary = "노드에 태그 추가", description = "노드에 기존 태그를 연결합니다.")
    @ApiErrorCode(code = TagErrorCode.class, names = {"TAG_NOT_FOUND", "NODE_TAG_ALREADY_EXISTS"})
    CommonResponse<?> addNodeTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody AddNodeTagRequest request
    );

    @Operation(summary = "노드에서 태그 제거", description = "노드에서 태그 연결을 해제합니다.")
    CommonResponse<?> removeNodeTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @PathVariable Long tagId
    );
}
