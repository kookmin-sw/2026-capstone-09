package kr.flowmeet.api.auth.facade;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.auth.dto.request.RefreshTokenRequest;
import kr.flowmeet.api.auth.dto.request.SignupRequest;
import kr.flowmeet.api.auth.dto.request.SocialLoginRequest;
import kr.flowmeet.api.auth.dto.response.SignupRequiredResponse;
import kr.flowmeet.api.auth.dto.response.TokenResponse;
import kr.flowmeet.api.auth.oauth.SocialOAuthGateway;
import kr.flowmeet.auth.exception.AuthErrorCode;
import kr.flowmeet.auth.exception.AuthException;
import kr.flowmeet.auth.jwt.JwtProvider;
import kr.flowmeet.domain.auth.service.RefreshTokenService;
import kr.flowmeet.domain.emailverification.service.EmailVerificationService;
import kr.flowmeet.domain.user.entity.SocialProvider;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;
import kr.flowmeet.domain.user.service.vo.CreateUserCommand;
import kr.flowmeet.domain.user.service.vo.SocialIdentity;
import kr.flowmeet.external.oauth.dto.SocialTokens;
import kr.flowmeet.external.oauth.dto.SocialUserInfo;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthFacade {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
    private final RefreshTokenService refreshTokenService;
    private final JwtProvider jwtProvider;
    private final SocialOAuthGateway oauthGateway;

    @Transactional
    public LoginResult login(final SocialProvider provider, final SocialLoginRequest request) {
        SocialTokens tokens = oauthGateway.exchangeCode(provider, request.code(), request.redirectUri());
        SocialUserInfo userInfo = oauthGateway.fetchUserInfo(provider, tokens.accessToken());

        Optional<User> existing = userService.findBySocialIdentity(new SocialIdentity(provider, userInfo.socialId()));

        return existing
                .map(user -> handleExistingUser(user, tokens))
                .orElseGet(() -> handleNewUser(provider, tokens, userInfo));
    }

    @Transactional
    public TokenResponse signup(final SignupRequest request) {
        SocialUserInfo userInfo = oauthGateway.fetchUserInfo(
                request.socialProvider(), request.socialAccessToken());

        SocialIdentity identity = new SocialIdentity(request.socialProvider(), userInfo.socialId());

        if (userService.existsBySocialIdentity(identity)) {
            throw new AuthException(AuthErrorCode.AUTH_SOCIAL_ID_DUPLICATED);
        }

        emailVerificationService.consumeVerified(request.email());

        CreateUserCommand command = CreateUserCommand.of(
                request.socialProvider(),
                userInfo.socialId(),
                userInfo.email(),
                request.email(),
                request.nickname(),
                userInfo.profileImageUrl()
        );

        User saved = userService.create(command);

        return issueTokens(saved.getId(), saved.getEmail(), saved.getNickname());
    }

    @Transactional
    public TokenResponse refresh(final RefreshTokenRequest request) {
        Long userId = jwtProvider.parseRefreshTokenSubject(request.refreshToken());
        refreshTokenService.consume(request.refreshToken(), userId);

        User user = userService.findById(userId);
        return issueTokens(user.getId(), user.getEmail(), user.getNickname());
    }

    @Transactional
    public void sendEmailVerification(final String email) {
        userService.validateEmailNotDuplicated(email);
        emailVerificationService.issueCode(email);
    }

    @Transactional
    public void verifyEmail(final String email, final String code) {
        emailVerificationService.verify(email, code);
    }

    @Transactional
    public void logout(final Long userId) {
        refreshTokenService.revokeAllByUserId(userId);
    }

    private LoginResult handleExistingUser(final User user, final SocialTokens tokens) {
        userService.updateGoogleRefreshToken(user.getId(), tokens.refreshToken());
        TokenResponse issued = issueTokens(user.getId(), user.getEmail(), user.getNickname());
        return new LoginResult.LoggedIn(issued);
    }

    private LoginResult handleNewUser(
            final SocialProvider provider,
            final SocialTokens tokens,
            final SocialUserInfo userInfo
    ) {
        SignupRequiredResponse data = SignupRequiredResponse.of(
                provider,
                tokens.accessToken(),
                userInfo.name(),
                userInfo.email()
        );
        return new LoginResult.SignupRequired(data);
    }

    private TokenResponse issueTokens(final Long userId, final String email, final String nickname) {
        String accessToken = jwtProvider.generateAccessToken(userId, email, nickname);
        String refreshToken = jwtProvider.generateRefreshToken(userId);
        refreshTokenService.issue(userId, refreshToken, jwtProvider.refreshTokenExpiresAt());
        return TokenResponse.of(accessToken, refreshToken);
    }
}
