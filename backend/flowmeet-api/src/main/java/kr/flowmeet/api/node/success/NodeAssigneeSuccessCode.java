package kr.flowmeet.api.node.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NodeAssigneeSuccessCode implements SuccessCode {
    CREATE_ASSIGNEE("담당자를 추가했어요."),
    DELETE_ASSIGNEE("담당자를 제거했어요.");

    private final String message;
}
