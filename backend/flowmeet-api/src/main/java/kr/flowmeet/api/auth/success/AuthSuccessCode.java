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
    LOGOUT("로그아웃되었어요."),
    SEND_EMAIL_VERIFICATION("인증 코드를 보냈어요. 메일함을 확인해 주세요."),
    VERIFY_EMAIL("이메일 인증에 성공했어요.");

    private final String message;
}
