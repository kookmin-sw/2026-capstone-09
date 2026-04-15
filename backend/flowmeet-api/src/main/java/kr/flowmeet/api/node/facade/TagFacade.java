package kr.flowmeet.api.node.facade;

import java.util.List;
import kr.flowmeet.domain.node.exception.TagErrorCode;
import kr.flowmeet.domain.node.service.NodeValidator;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.node.dto.request.AddNodeTagRequest;
import kr.flowmeet.api.node.dto.request.CreateTagRequest;
import kr.flowmeet.api.node.dto.request.UpdateTagRequest;
import kr.flowmeet.api.node.dto.response.GetAllTagsResponse;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.node.service.NodeTagService;
import kr.flowmeet.domain.node.service.TagService;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.service.ProjectMemberService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagFacade {

    private final TagService tagService;
    private final NodeTagService nodeTagService;
    private final NodeService nodeService;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final NodeValidator nodeValidator;

    public GetAllTagsResponse getAllTags(final Long userId, final Long projectId) {
        projectPermissionValidator.validate(projectId, userId);

        List<Tag> tags = tagService.findAllByProjectId(projectId);
        return GetAllTagsResponse.from(tags);
    }

    @Transactional
    public void createTag(
            final Long userId,
            final Long projectId,
            final CreateTagRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        tagService.create(projectId, request.toCommand());
    }

    @Transactional
    public void updateTag(
            final Long userId,
            final Long projectId,
            final Long tagId,
            final UpdateTagRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        tagService.update(projectId, tagId, request.toCommand());
    }

    @Transactional
    public void deleteTag(final Long userId, final Long projectId, final Long tagId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Tag tag = tagService.findByIdAndProjectId(tagId, projectId);

        nodeTagService.deleteAllByTagId(tagId);
        tagService.delete(tag);
    }

    @Transactional
    public void addNodeTag(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final AddNodeTagRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);
        nodeValidator.validateIsIn(nodeId, projectId);

        nodeTagService.create(projectId, nodeId, request.tagId());
    }

    @Transactional
    public void removeNodeTag(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final Long tagId
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);
        nodeValidator.validateIsIn(nodeId, projectId);

        nodeTagService.deleteByNodeIdAndTagId(nodeId, tagId);
    }
}
