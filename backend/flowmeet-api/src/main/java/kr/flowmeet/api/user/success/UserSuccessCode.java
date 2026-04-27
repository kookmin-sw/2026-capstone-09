package kr.flowmeet.api.user.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserSuccessCode implements SuccessCode {
    GET_ME("내 정보를 조회했어요."),
    UPDATE_ME("내 정보를 수정했어요."),
    UPDATE_PROFILE_IMAGE("프로필 이미지를 변경했어요."),
    DELETE_ME("회원 탈퇴가 완료됐어요.");

    private final String message;
}
