package kr.flowmeet.api.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.flowmeet.api.auth.dto.request.RefreshTokenRequest;
import kr.flowmeet.api.auth.dto.request.SendAuthEmailVerificationRequest;
import kr.flowmeet.api.auth.dto.request.SignupRequest;
import kr.flowmeet.api.auth.dto.request.SocialLoginRequest;
import kr.flowmeet.api.auth.dto.request.VerifyAuthEmailRequest;
import kr.flowmeet.api.auth.dto.response.TokenResponse;
import kr.flowmeet.api.auth.success.AuthSuccessCode;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.auth.exception.AuthErrorCode;
import kr.flowmeet.domain.emailverification.exception.EmailVerificationErrorCode;
import kr.flowmeet.domain.user.entity.SocialProvider;
import kr.flowmeet.domain.user.exception.UserErrorCode;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Auth", description = "인증")
public interface AuthApi {

    @Operation(
            summary = "소셜 로그인",
            description = """
                    소셜 인증 코드로 로그인한다. 미가입 유저인 경우 회원가입 필요 응답을 반환한다.

                    - 가입된 유저: code=`LOGIN`, data 에 accessToken/refreshToken
                    - 미가입 유저: code=`SIGNUP_REQUIRED`, data 에 socialProvider/socialAccessToken/name/email
                    """
    )
    @ApiSuccessCode(code = AuthSuccessCode.class, name = "LOGIN")
    @ApiErrorCode(code = AuthErrorCode.class, names = {
            "AUTH_INVALID_CODE", "AUTH_PROVIDER_ERROR", "AUTH_PROVIDER_UNSUPPORTED"
    })
    CommonResponse<?> login(@PathVariable String provider, @Valid @RequestBody SocialLoginRequest request);

    @Operation(summary = "회원가입", description = "소셜 로그인 후 미가입 유저의 추가 정보 입력 및 회원가입 완료")
    @ApiSuccessCode(code = AuthSuccessCode.class, name = "SIGNUP")
    @ApiErrorCode(code = AuthErrorCode.class, names = {
            "AUTH_INVALID_SOCIAL_TOKEN", "AUTH_PROVIDER_ERROR", "AUTH_PROVIDER_UNSUPPORTED"
    })
    @ApiErrorCode(code = UserErrorCode.class, names = {
            "USER_EMAIL_DUPLICATED", "USER_NICKNAME_DUPLICATED"
    })
    @ApiErrorCode(code = EmailVerificationErrorCode.class, names = {"EMAIL_VERIFICATION_REQUIRED"})
    CommonResponse<TokenResponse> signup(@Valid @RequestBody SignupRequest request);

    @Operation(
            summary = "회원가입 이메일 인증 코드 발송",
            description = "회원가입할 이메일 주소로 6자리 인증 코드를 발송합니다. 코드 유효시간은 5분입니다."
    )
    @ApiSuccessCode(code = AuthSuccessCode.class, name = "SEND_EMAIL_VERIFICATION")
    @ApiErrorCode(code = UserErrorCode.class, names = {"USER_EMAIL_DUPLICATED"})
    CommonResponse<?> sendEmailVerification(@Valid @RequestBody SendAuthEmailVerificationRequest request);

    @Operation(summary = "회원가입 이메일 인증 코드 검증", description = "발송된 인증 코드로 이메일 소유를 확인합니다.")
    @ApiSuccessCode(code = AuthSuccessCode.class, name = "VERIFY_EMAIL")
    @ApiErrorCode(code = EmailVerificationErrorCode.class, names = {
            "EMAIL_VERIFICATION_NOT_FOUND", "EMAIL_VERIFICATION_CODE_INVALID", "EMAIL_VERIFICATION_CODE_EXPIRED"
    })
    CommonResponse<?> verifyEmail(@Valid @RequestBody VerifyAuthEmailRequest request);

    @Operation(summary = "토큰 갱신", description = "Refresh Token 으로 Access Token 재발급")
    @ApiSuccessCode(code = AuthSuccessCode.class, name = "REFRESH")
    @ApiErrorCode(code = AuthErrorCode.class, names = {"AUTH_INVALID_TOKEN", "AUTH_EXPIRED_TOKEN"})
    CommonResponse<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request);

    @Operation(summary = "로그아웃", description = "현재 유저의 모든 Refresh Token 을 무효화한다.")
    @ApiSuccessCode(code = AuthSuccessCode.class, name = "LOGOUT")
    CommonResponse<?> logout(Long userId);
}
