package kr.flowmeet.domain.ai.repository;

import java.util.Optional;
import kr.flowmeet.domain.ai.entity.AiTask;
import kr.flowmeet.domain.ai.entity.AiTaskStatus;
import kr.flowmeet.domain.ai.entity.AiTaskType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiTaskRepository extends JpaRepository<AiTask, String> {

    Optional<AiTask> findByReferenceIdAndTaskTypeAndStatus(
            Long referenceId, AiTaskType taskType, AiTaskStatus status);
}