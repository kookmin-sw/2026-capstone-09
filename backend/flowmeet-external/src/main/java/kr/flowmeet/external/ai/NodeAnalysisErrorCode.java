package kr.flowmeet.external.ai;

import kr.flowmeet.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum NodeAnalysisErrorCode implements ErrorCode {

    NODE_ANALYSIS_FAILED(HttpStatus.BAD_GATEWAY, "노드 분석 API 호출에 실패했어요.");

    private final HttpStatus httpStatus;
    private final String message;
}