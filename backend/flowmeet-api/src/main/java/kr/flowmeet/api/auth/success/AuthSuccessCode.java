package kr.flowmeet.api.auth.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuthSuccessCode implements SuccessCode {
    LOGIN("로그인을 성공했어요."),
    SIGNUP_REQUIRED("회원가입이 필요해요."),
    SIGNUP("회원가입에 성공했어요."),
    REFRESH("토큰을 갱신했어요."),
    LOGOUT("로그아웃되었어요.");

    private final String message;
}
