package kr.flowmeet.domain.node.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.node.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findAllByProjectId(Long projectId);

    Optional<Tag> findByIdAndProjectId(Long id, Long projectId);

    boolean existsByProjectIdAndName(Long projectId, String name);

    boolean existsByIdAndProjectId(Long id, Long projectId);
}
