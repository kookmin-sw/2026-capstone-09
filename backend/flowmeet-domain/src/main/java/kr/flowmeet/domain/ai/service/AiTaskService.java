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
    public AiTask create(final Long userId, final AiTaskType taskType, final String requestText) {
        return aiTaskRepository.save(
                AiTask.builder()
                        .id(UUID.randomUUID().toString())
                        .userId(userId)
                        .taskType(taskType)
                        .requestText(requestText)
                        .build()
        );
    }

    @Transactional
    public void complete(final String jobId, final String result, final String mermaidCode) {
        AiTask task = findById(jobId);
        task.complete(result, mermaidCode);
    }

    @Transactional
    public void fail(final String jobId, final String errorMessage) {
        AiTask task = findById(jobId);
        task.fail(errorMessage);
    }
}