package kr.flowmeet.api.node.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NodeSuccessCode implements SuccessCode {
    GET_FLOWCHART("플로우차트를 조회했어요."),
    GET_NODE("노드를 조회했어요."),
    CREATE_NODE("노드를 추가했어요."),
    UPDATE_NODE_TITLE("노드 제목을 수정했어요."),
    UPDATE_NODE_DESCRIPTION("노드 설명을 수정했어요."),
    UPDATE_NODE_NOTE("노드 노트를 수정했어요."),
    DELETE_NODE("노드를 삭제했어요."),
    GET_NODE_LIST("노드 리스트를 조회했어요."),
    GET_KANBAN("칸반 보드를 조회했어요."),
    UPDATE_NODE_KANBAN("칸반 카드를 옮겼어요."),
    UPDATE_NODE_STATUS("노드 상태를 변경했어요."),
    SEARCH("검색을 완료했어요.");

    private final String message;
}
