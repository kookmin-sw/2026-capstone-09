package kr.flowmeet.api.auth.controller;

import jakarta.validation.Valid;
import kr.flowmeet.api.auth.dto.request.RefreshTokenRequest;
import kr.flowmeet.api.auth.dto.request.SignupRequest;
import kr.flowmeet.api.auth.dto.request.SocialLoginRequest;
import kr.flowmeet.api.auth.dto.response.TokenResponse;
import kr.flowmeet.api.auth.facade.AuthFacade;
import kr.flowmeet.api.auth.facade.LoginResult;
import kr.flowmeet.api.auth.success.AuthSuccessCode;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.user.entity.SocialProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController implements AuthApi {

    private final AuthFacade authFacade;

    @Override
    @PostMapping("/login/{provider}")
    public CommonResponse<?> login(
            @PathVariable("provider") SocialProvider provider,
            @Valid @RequestBody SocialLoginRequest request
    ) {
        LoginResult result = authFacade.login(provider, request);
        return switch (result) {
            case LoginResult.LoggedIn loggedIn -> CommonResponse.ok(AuthSuccessCode.LOGIN, loggedIn.tokens());
            case LoginResult.SignupRequired signupRequired ->
                    CommonResponse.ok(AuthSuccessCode.SIGNUP_REQUIRED, signupRequired.signupRequired());
        };
    }

    @Override
    @PostMapping("/signup")
    public CommonResponse<TokenResponse> signup(@Valid @RequestBody SignupRequest request) {
        return CommonResponse.ok(AuthSuccessCode.SIGNUP, authFacade.signup(request));
    }

    @Override
    @PostMapping("/refresh")
    public CommonResponse<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return CommonResponse.ok(AuthSuccessCode.REFRESH, authFacade.refresh(request));
    }

    @Override
    @PostMapping("/logout")
    public CommonResponse<?> logout(@UserId Long userId) {
        authFacade.logout(userId);
        return CommonResponse.ok(AuthSuccessCode.LOGOUT);
    }
}
