package kr.flowmeet.api.ai.facade;

import kr.flowmeet.api.ai.dto.response.GetAiTaskResponse;
import kr.flowmeet.domain.ai.entity.AiTask;
import kr.flowmeet.domain.ai.service.AiTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiTaskFacade {

    private final AiTaskService aiTaskService;

    public GetAiTaskResponse getAiTask(final Long userId, final String jobId) {
        AiTask aiTask = aiTaskService.findByIdAndUserId(jobId, userId);
        return GetAiTaskResponse.from(aiTask);
    }
}