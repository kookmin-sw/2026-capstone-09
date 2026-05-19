package kr.flowmeet.api.node.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EdgeSuccessCode implements SuccessCode {
    GET_EDGES("연결선 목록을 조회했어요."),
    CREATE_EDGE("연결선을 생성했어요."),
    DELETE_EDGE("연결선을 삭제했어요.");

    private final String message;
}
