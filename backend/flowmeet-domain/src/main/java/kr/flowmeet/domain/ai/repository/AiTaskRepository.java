package kr.flowmeet.domain.ai.repository;

import kr.flowmeet.domain.ai.entity.AiTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiTaskRepository extends JpaRepository<AiTask, String> {
}