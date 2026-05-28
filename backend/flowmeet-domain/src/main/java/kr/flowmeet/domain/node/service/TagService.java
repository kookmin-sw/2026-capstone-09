package kr.flowmeet.domain.node.service;

import java.util.List;
import java.util.Optional;
import kr.flowmeet.domain.node.service.vo.UpdateTagCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.node.exception.TagErrorCode;
import kr.flowmeet.domain.node.repository.TagRepository;
import kr.flowmeet.domain.node.service.vo.CreateTagCommand;

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

    @Transactional
    public Tag create(final Long projectId, final CreateTagCommand command) {
        Optional<Tag> existing = tagRepository.findByProjectIdAndNameIncludingDeleted(projectId, command.name());

        if (existing.isPresent()) {
            Tag tag = existing.get();
            if (tag.getDeletedAt() != null) {
                tagRepository.hardDeleteById(tag.getId());
            } else {
                throw new BusinessException(TagErrorCode.TAG_NAME_DUPLICATED);
            }
        }

        return tagRepository.save(
                Tag.builder()
                        .projectId(projectId)
                        .name(command.name())
                        .color(command.color())
                        .build()
        );
    }

    @Transactional
    public void delete(final Tag tag) {
        tagRepository.delete(tag);
    }

    @Transactional
    public void update(final Long projectId, final Long tagId, final UpdateTagCommand command) {
        Tag tag = findByIdAndProjectId(tagId, projectId);
        String newName = command.name();

        if (!tag.getName().equals(newName)) {
            tagRepository.findByProjectIdAndNameIncludingDeleted(projectId, newName)
                    .ifPresent(existing -> {
                        if (existing.getDeletedAt() == null) {
                            throw new BusinessException(TagErrorCode.TAG_NAME_DUPLICATED);
                        }
                        tagRepository.hardDeleteById(existing.getId());
                    });
        }

        tag.update(newName, command.color());
    }
}
