package kr.flowmeet.api.ai.controller;

import kr.flowmeet.api.ai.dto.response.GetAiTaskResponse;
import kr.flowmeet.api.ai.facade.AiTaskFacade;
import kr.flowmeet.api.ai.success.AiTaskSuccessCode;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.auth.annotation.UserId;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/ai/tasks")
@RequiredArgsConstructor
public class AiTaskController implements AiTaskApi {

    private final AiTaskFacade aiTaskFacade;

    @Override
    @GetMapping("/{jobId}")
    public CommonResponse<GetAiTaskResponse> getAiTask(
            @UserId Long userId,
            @PathVariable String jobId
    ) {
        GetAiTaskResponse response = aiTaskFacade.getAiTask(userId, jobId);
        return CommonResponse.ok(AiTaskSuccessCode.GET_AI_TASK, response);
    }
}