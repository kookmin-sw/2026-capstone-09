package kr.flowmeet.api.node.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TagSuccessCode implements SuccessCode {
    GET_ALL_TAGS("태그 목록을 조회했어요."),
    CREATE_TAG("태그를 생성했어요."),
    UPDATE_TAG("태그를 수정했어요."),
    DELETE_TAG("태그를 삭제했어요."),
    ADD_NODE_TAG("노드에 태그를 추가했어요."),
    REMOVE_NODE_TAG("노드에서 태그를 제거했어요.");

    private final String message;
}
