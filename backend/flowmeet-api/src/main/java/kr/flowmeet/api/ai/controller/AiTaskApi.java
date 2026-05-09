package kr.flowmeet.api.ai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.flowmeet.api.ai.dto.response.GetAiTaskResponse;
import kr.flowmeet.api.ai.success.AiTaskSuccessCode;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.ai.exception.AiTaskErrorCode;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "AI Task", description = "AI 작업")
public interface AiTaskApi {

    @Operation(summary = "AI 작업 결과 조회", description = "jobId로 AI 작업의 상태와 결과를 조회합니다.")
    @ApiSuccessCode(code = AiTaskSuccessCode.class, name = "GET_AI_TASK")
    @ApiErrorCode(code = AiTaskErrorCode.class, names = {"AI_TASK_NOT_FOUND"})
    CommonResponse<GetAiTaskResponse> getAiTask(
            @UserId Long userId,
            @PathVariable String jobId
    );
}