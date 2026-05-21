package kr.flowmeet.domain.ai.service;

import java.util.UUID;
import kr.flowmeet.domain.ai.entity.AiTask;
import kr.flowmeet.domain.ai.entity.AiTaskType;
import kr.flowmeet.domain.ai.exception.AiTaskErrorCode;
import kr.flowmeet.domain.ai.repository.AiTaskRepository;
import kr.flowmeet.domain.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiTaskService {

    private final AiTaskRepository aiTaskRepository;

    public AiTask findById(final String id) {
        return aiTaskRepository.findById(id)
                .orElseThrow(() -> new BusinessException(AiTaskErrorCode.AI_TASK_NOT_FOUND));
    }

    @Transactional
    public AiTask create(final Long userId, final Long projectId, final Long referenceId, final AiTaskType taskType) {
        return aiTaskRepository.save(
                AiTask.builder()
                        .id(UUID.randomUUID().toString())
                        .userId(userId)
                        .projectId(projectId)
                        .referenceId(referenceId)
                        .taskType(taskType)
                        .build()
        );
    }

    @Transactional
    public AiTask complete(final String jobId) {
        AiTask task = findById(jobId);
        task.complete();
        return task;
    }

    @Transactional
    public AiTask fail(final String jobId, final String errorMessage) {
        AiTask task = findById(jobId);
        task.fail(errorMessage);
        return task;
    }
}