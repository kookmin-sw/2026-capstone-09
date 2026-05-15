package kr.flowmeet.api.node.controller;

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
import kr.flowmeet.api.node.dto.request.AddNodeTagRequest;
import kr.flowmeet.api.node.dto.request.CreateTagRequest;
import kr.flowmeet.api.node.dto.request.UpdateTagRequest;
import kr.flowmeet.api.node.dto.response.GetAllTagsResponse;
import kr.flowmeet.api.node.facade.TagFacade;
import kr.flowmeet.api.node.success.TagSuccessCode;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/projects/{projectId}")
@RequiredArgsConstructor
public class TagController implements TagApi {

    private final TagFacade tagFacade;

    @Override
    @GetMapping("/tags")
    public CommonResponse<GetAllTagsResponse> getAllTags(
            @UserId Long userId,
            @PathVariable Long projectId
    ) {
        return CommonResponse.ok(TagSuccessCode.GET_ALL_TAGS, tagFacade.getAllTags(userId, projectId));
    }

    @Override
    @PostMapping("/tags")
    public CommonResponse<?> createTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTagRequest request
    ) {
        tagFacade.createTag(userId, projectId, request);
        return CommonResponse.ok(TagSuccessCode.CREATE_TAG);
    }

    @Override
    @PatchMapping("/tags/{tagId}")
    public CommonResponse<?> updateTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long tagId,
            @Valid @RequestBody UpdateTagRequest request
    ) {
        tagFacade.updateTag(userId, projectId, tagId, request);
        return CommonResponse.ok(TagSuccessCode.UPDATE_TAG);
    }

    @Override
    @DeleteMapping("/tags/{tagId}")
    public CommonResponse<?> deleteTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long tagId
    ) {
        tagFacade.deleteTag(userId, projectId, tagId);
        return CommonResponse.ok(TagSuccessCode.DELETE_TAG);
    }

    @Override
    @PostMapping("/nodes/{nodeId}/tags")
    public CommonResponse<?> addNodeTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @Valid @RequestBody AddNodeTagRequest request
    ) {
        tagFacade.addNodeTag(userId, projectId, nodeId, request);
        return CommonResponse.ok(TagSuccessCode.ADD_NODE_TAG);
    }

    @Override
    @DeleteMapping("/nodes/{nodeId}/tags/{tagId}")
    public CommonResponse<?> removeNodeTag(
            @UserId Long userId,
            @PathVariable Long projectId,
            @PathVariable Long nodeId,
            @PathVariable Long tagId
    ) {
        tagFacade.removeNodeTag(userId, projectId, nodeId, tagId);
        return CommonResponse.ok(TagSuccessCode.REMOVE_NODE_TAG);
    }
}
