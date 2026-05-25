package kr.flowmeet.api.project.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProjectSuccessCode implements SuccessCode {
    CREATE_PROJECT("프로젝트를 생성했어요."),
    GET_ALL_PROJECTS("프로젝트 목록을 조회했어요."),
    GET_PROJECT("프로젝트를 조회했어요."),
    UPDATE_PROJECT("프로젝트를 수정했어요."),
    UPDATE_PROFILE_IMAGE("프로젝트 이미지를 변경했어요."),
    DELETE_PROJECT("프로젝트를 삭제했어요."),
    INVITE_MEMBER("멤버 초대 메일을 전송했어요."),
    ACCEPT_INVITATION("프로젝트에 합류했어요."),
    GET_ALL_MEMBERS("멤버 목록을 조회했어요."),
    UPDATE_MEMBER_ROLE("멤버 권한을 변경했어요."),
    DELETE_MEMBER("멤버를 삭제했어요."),
    LEAVE_PROJECT("프로젝트에서 나갔어요."),
    ADD_URL("URL을 추가했어요."),
    UPDATE_URL("URL을 수정했어요."),
    DELETE_URL("URL을 삭제했어요.");

    private final String message;
}
