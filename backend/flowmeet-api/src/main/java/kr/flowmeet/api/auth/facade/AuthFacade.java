package kr.flowmeet.api.auth.facade;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import kr.flowmeet.api.auth.dto.request.RefreshTokenRequest;
import kr.flowmeet.api.auth.dto.request.SignupRequest;
import kr.flowmeet.api.auth.dto.request.SocialLoginRequest;
import kr.flowmeet.api.auth.dto.response.SignupRequiredResponse;
import kr.flowmeet.api.auth.dto.response.TokenResponse;
import kr.flowmeet.auth.exception.AuthErrorCode;
import kr.flowmeet.auth.exception.AuthException;
import kr.flowmeet.auth.jwt.JwtProvider;
import kr.flowmeet.domain.auth.entity.RefreshToken;
import kr.flowmeet.domain.auth.service.RefreshTokenService;
import kr.flowmeet.domain.user.entity.SocialProvider;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;
import kr.flowmeet.external.exception.ExternalException;
import kr.flowmeet.external.oauth.SocialOAuthClient;
import kr.flowmeet.external.oauth.SocialOAuthErrorCode;
import kr.flowmeet.external.oauth.dto.SocialTokens;
import kr.flowmeet.external.oauth.dto.SocialUserInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
public class AuthFacade {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtProvider jwtProvider;
    private final Map<SocialProvider, SocialOAuthClient> oauthClients;

    public AuthFacade(
            UserService userService,
            RefreshTokenService refreshTokenService,
            JwtProvider jwtProvider,
            List<SocialOAuthClient> oauthClients
    ) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.jwtProvider = jwtProvider;
        this.oauthClients = oauthClients.stream()
                .collect(Collectors.toMap(
                        client -> SocialProvider.valueOf(client.getProviderName()),
                        Function.identity()
                ));
    }

    @Transactional
    public LoginResult login(final SocialProvider provider, final SocialLoginRequest request) {
        SocialOAuthClient client = resolveClient(provider);

        SocialTokens tokens;
        SocialUserInfo userInfo;
        try {
            tokens = client.exchangeCode(request.code(), request.redirectUri());
            userInfo = client.fetchUserInfo(tokens.accessToken());
        } catch (ExternalException e) {
            throw new AuthException(translateOAuthError(e));
        }

        return userService.findOptionalBySocialProviderAndSocialId(provider, userInfo.socialId())
                .map(user -> handleExistingUser(user, tokens))
                .orElseGet(() -> handleNewUser(provider, tokens, userInfo));
    }

    @Transactional
    public TokenResponse signup(final SignupRequest request) {
        SocialOAuthClient client = resolveClient(request.socialProvider());

        SocialUserInfo userInfo;
        try {
            userInfo = client.fetchUserInfo(request.socialAccessToken());
        } catch (ExternalException e) {
            throw new AuthException(translateOAuthError(e));
        }

        userService.findOptionalBySocialProviderAndSocialId(request.socialProvider(), userInfo.socialId())
                .ifPresent(existing -> {
                    throw new AuthException(AuthErrorCode.AUTH_INVALID_SOCIAL_TOKEN);
                });

        userService.validateNicknameNotDuplicated(request.nickname());
        userService.validateEmailNotDuplicated(request.email());

        User user = User.builder()
                .socialProvider(request.socialProvider())
                .socialId(userInfo.socialId())
                .socialEmail(userInfo.email())
                .email(request.email())
                .nickname(request.nickname())
                .profileImageUrl(userInfo.profileImageUrl())
                .build();

        User saved = userService.save(user);

        return issueTokens(saved.getId(), saved.getEmail(), saved.getNickname());
    }

    @Transactional
    public TokenResponse refresh(final RefreshTokenRequest request) {
        Long userId = jwtProvider.parseRefreshTokenSubject(request.refreshToken());
        RefreshToken stored = refreshTokenService.findValid(request.refreshToken());

        if (!stored.getUserId().equals(userId)) {
            throw new AuthException(AuthErrorCode.AUTH_INVALID_TOKEN);
        }

        User user = userService.findById(userId);
        refreshTokenService.revoke(stored);

        return issueTokens(user.getId(), user.getEmail(), user.getNickname());
    }

    @Transactional
    public void logout(final Long userId) {
        refreshTokenService.revokeAllByUserId(userId);
    }

    private LoginResult handleExistingUser(final User user, final SocialTokens tokens) {
        if (tokens.refreshToken() != null && !tokens.refreshToken().isBlank()) {
            user.updateGoogleRefreshToken(tokens.refreshToken());
        }
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

    private SocialOAuthClient resolveClient(final SocialProvider provider) {
        SocialOAuthClient client = oauthClients.get(provider);
        if (client == null) {
            throw new AuthException(AuthErrorCode.AUTH_PROVIDER_UNSUPPORTED);
        }
        return client;
    }

    private AuthErrorCode translateOAuthError(final ExternalException e) {
        if (e.getErrorCode() instanceof SocialOAuthErrorCode code) {
            return switch (code) {
                case SOCIAL_OAUTH_INVALID_CODE -> AuthErrorCode.AUTH_INVALID_CODE;
                case SOCIAL_OAUTH_INVALID_TOKEN -> AuthErrorCode.AUTH_INVALID_SOCIAL_TOKEN;
                case SOCIAL_OAUTH_PROVIDER_UNSUPPORTED -> AuthErrorCode.AUTH_PROVIDER_UNSUPPORTED;
                case SOCIAL_OAUTH_PROVIDER_ERROR -> AuthErrorCode.AUTH_PROVIDER_ERROR;
            };
        }
        return AuthErrorCode.AUTH_PROVIDER_ERROR;
    }
}
