package kr.flowmeet.domain.node.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.node.exception.TagErrorCode;
import kr.flowmeet.domain.node.repository.TagRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;

    public List<Tag> findAllByProjectId(final Long projectId) {
        return tagRepository.findAllByProjectId(projectId);
    }

    public Tag findByIdAndProjectId(final Long tagId, final Long projectId) {
        return tagRepository.findByIdAndProjectId(tagId, projectId)
                .orElseThrow(() -> new BusinessException(TagErrorCode.TAG_NOT_FOUND));
    }

    public void validateNameNotDuplicated(final Long projectId, final String name) {
        if (tagRepository.existsByProjectIdAndName(projectId, name)) {
            throw new BusinessException(TagErrorCode.TAG_NAME_DUPLICATED);
        }
    }

    public void validateTagIsInProject(final Long tagId, final Long projectId) {
        if (!tagRepository.existsByIdAndProjectId(tagId, projectId)) {
            throw new BusinessException(TagErrorCode.TAG_NOT_FOUND);
        }
    }

    @Transactional
    public Tag create(final Tag tag) {
        return tagRepository.save(tag);
    }

    @Transactional
    public void delete(final Tag tag) {
        tagRepository.delete(tag);
    }
}
