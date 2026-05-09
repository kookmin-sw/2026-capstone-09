package kr.flowmeet.domain.ai.repository;

import java.util.Optional;
import kr.flowmeet.domain.ai.entity.AiTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiTaskRepository extends JpaRepository<AiTask, String> {

    Optional<AiTask> findByIdAndUserId(String id, Long userId);
}