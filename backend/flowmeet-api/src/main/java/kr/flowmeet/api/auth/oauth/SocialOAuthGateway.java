package kr.flowmeet.api.auth.oauth;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import kr.flowmeet.auth.exception.AuthErrorCode;
import kr.flowmeet.auth.exception.AuthException;
import kr.flowmeet.domain.user.entity.SocialProvider;
import kr.flowmeet.external.exception.ExternalException;
import kr.flowmeet.external.oauth.SocialOAuthClient;
import kr.flowmeet.external.oauth.SocialOAuthErrorCode;
import kr.flowmeet.external.oauth.dto.SocialTokens;
import kr.flowmeet.external.oauth.dto.SocialUserInfo;
import org.springframework.stereotype.Component;

@Component
public class SocialOAuthGateway {

    private final Map<SocialProvider, SocialOAuthClient> clients;

    public SocialOAuthGateway(final List<SocialOAuthClient> clients) {
        this.clients = clients.stream()
                .collect(Collectors.toMap(
                        client -> SocialProvider.valueOf(client.getProviderName()),
                        Function.identity()
                ));
    }

    public SocialTokens exchangeCode(
            final SocialProvider provider,
            final String code,
            final String redirectUri
    ) {
        try {
            return resolve(provider).exchangeCode(code, redirectUri);
        } catch (ExternalException e) {
            throw new AuthException(translate(e));
        }
    }

    public SocialUserInfo fetchUserInfo(final SocialProvider provider, final String accessToken) {
        try {
            return resolve(provider).fetchUserInfo(accessToken);
        } catch (ExternalException e) {
            throw new AuthException(translate(e));
        }
    }

    private SocialOAuthClient resolve(final SocialProvider provider) {
        SocialOAuthClient client = clients.get(provider);
        if (client == null) {
            throw new AuthException(AuthErrorCode.AUTH_PROVIDER_UNSUPPORTED);
        }
        return client;
    }

    private AuthErrorCode translate(final ExternalException e) {
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
