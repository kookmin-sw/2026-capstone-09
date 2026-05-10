package kr.flowmeet.api.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.flowmeet.api.auth.dto.request.RefreshTokenRequest;
import kr.flowmeet.api.auth.dto.request.SignupRequest;
import kr.flowmeet.api.auth.dto.request.SocialLoginRequest;
import kr.flowmeet.api.auth.dto.response.TokenResponse;
import kr.flowmeet.api.auth.success.AuthSuccessCode;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.auth.exception.AuthErrorCode;
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
    CommonResponse<TokenResponse> signup(@Valid @RequestBody SignupRequest request);

    @Operation(summary = "토큰 갱신", description = "Refresh Token 으로 Access Token 재발급")
    @ApiSuccessCode(code = AuthSuccessCode.class, name = "REFRESH")
    @ApiErrorCode(code = AuthErrorCode.class, names = {"AUTH_INVALID_TOKEN", "AUTH_EXPIRED_TOKEN"})
    CommonResponse<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request);

    @Operation(summary = "로그아웃", description = "현재 유저의 모든 Refresh Token 을 무효화한다.")
    @ApiSuccessCode(code = AuthSuccessCode.class, name = "LOGOUT")
    CommonResponse<?> logout(Long userId);
}
