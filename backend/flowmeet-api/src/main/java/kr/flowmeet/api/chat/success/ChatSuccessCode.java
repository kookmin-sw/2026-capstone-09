package kr.flowmeet.api.chat.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ChatSuccessCode implements SuccessCode {
    GET_ALL_CHAT_SESSIONS("채팅 목록을 조회했어요."),
    GET_CHAT_SESSION("채팅 상세를 조회했어요."),
    CREATE_CHAT_SESSION("새 채팅을 생성했어요."),
    UPDATE_CHAT_SESSION("채팅 제목을 수정했어요."),
    DELETE_CHAT_SESSION("채팅을 삭제했어요."),
    SEND_MESSAGE("메시지를 전송했어요."),
    GET_REFERENCE_NODES("참조 가능한 노드를 조회했어요."),
    GET_REFERENCE_USERS("참조 가능한 사용자를 조회했어요."),
    ADD_CHAT_NODE("참조 노드를 추가했어요."),
    REMOVE_CHAT_NODE("참조 노드를 제거했어요.");

    private final String message;
}