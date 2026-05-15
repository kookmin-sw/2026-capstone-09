package kr.flowmeet.api.auth.facade;

import kr.flowmeet.api.auth.dto.response.SignupRequiredResponse;
import kr.flowmeet.api.auth.dto.response.TokenResponse;

public sealed interface LoginResult {

    record LoggedIn(TokenResponse tokens) implements LoginResult {}

    record SignupRequired(SignupRequiredResponse signupRequired) implements LoginResult {}
}
