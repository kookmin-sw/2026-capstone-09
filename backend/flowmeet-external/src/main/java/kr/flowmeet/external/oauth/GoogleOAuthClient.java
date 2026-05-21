package kr.flowmeet.external.oauth;

import java.util.Map;
import kr.flowmeet.external.exception.ExternalException;
import kr.flowmeet.external.oauth.config.OAuthGoogleProperties;
import kr.flowmeet.external.oauth.dto.SocialTokens;
import kr.flowmeet.external.oauth.dto.SocialUserInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Slf4j
public class GoogleOAuthClient implements SocialOAuthClient {

    public static final String PROVIDER_NAME = "GOOGLE";

    private static final String GRANT_TYPE_AUTHORIZATION_CODE = "authorization_code";

    private final OAuthGoogleProperties properties;
    private final RestClient restClient;

    public GoogleOAuthClient(OAuthGoogleProperties properties, RestClient restClient) {
        this.properties = properties;
        this.restClient = restClient;
    }

    @Override
    public String getProviderName() {
        return PROVIDER_NAME;
    }

    @Override
    public SocialTokens exchangeCode(final String code, final String redirectUri) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("code", code);
        form.add("client_id", properties.clientId());
        form.add("client_secret", properties.clientSecret());
        form.add("redirect_uri", redirectUri);
        form.add("grant_type", GRANT_TYPE_AUTHORIZATION_CODE);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> body = restClient.post()
                    .uri(properties.tokenUri())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(Map.class);

            if (body == null || body.get("access_token") == null) {
                log.error("[GoogleOAuthClient] empty token response");
                throw new ExternalException(SocialOAuthErrorCode.SOCIAL_OAUTH_PROVIDER_ERROR);
            }

            String accessToken = String.valueOf(body.get("access_token"));
            String refreshToken = body.get("refresh_token") != null ? String.valueOf(body.get("refresh_token")) : null;
            Long expiresIn = body.get("expires_in") instanceof Number n ? n.longValue() : null;
            return SocialTokens.of(accessToken, refreshToken, expiresIn);
        } catch (HttpClientErrorException e) {
            log.warn("[GoogleOAuthClient] exchangeCode 4xx. status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            if (isInvalidGrant(e.getStatusCode())) {
                throw new ExternalException(SocialOAuthErrorCode.SOCIAL_OAUTH_INVALID_CODE);
            }
            throw new ExternalException(SocialOAuthErrorCode.SOCIAL_OAUTH_PROVIDER_ERROR);
        } catch (ExternalException e) {
            throw e;
        } catch (Exception e) {
            log.error("[GoogleOAuthClient] exchangeCode failed", e);
            throw new ExternalException(SocialOAuthErrorCode.SOCIAL_OAUTH_PROVIDER_ERROR);
        }
    }

    @Override
    public SocialUserInfo fetchUserInfo(final String accessToken) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> body = restClient.get()
                    .uri(properties.userInfoUri())
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(Map.class);

            if (body == null || body.get("sub") == null || body.get("email") == null) {
                log.error("[GoogleOAuthClient] userinfo missing fields. body={}", body);
                throw new ExternalException(SocialOAuthErrorCode.SOCIAL_OAUTH_PROVIDER_ERROR);
            }

            return SocialUserInfo.of(
                    String.valueOf(body.get("sub")),
                    String.valueOf(body.get("email")),
                    body.get("name") != null ? String.valueOf(body.get("name")) : null,
                    body.get("picture") != null ? String.valueOf(body.get("picture")) : null
            );
        } catch (HttpClientErrorException e) {
            log.warn("[GoogleOAuthClient] fetchUserInfo 4xx. status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode().value() == 401) {
                throw new ExternalException(SocialOAuthErrorCode.SOCIAL_OAUTH_INVALID_TOKEN);
            }
            throw new ExternalException(SocialOAuthErrorCode.SOCIAL_OAUTH_PROVIDER_ERROR);
        } catch (ExternalException e) {
            throw e;
        } catch (Exception e) {
            log.error("[GoogleOAuthClient] fetchUserInfo failed", e);
            throw new ExternalException(SocialOAuthErrorCode.SOCIAL_OAUTH_PROVIDER_ERROR);
        }
    }

    private boolean isInvalidGrant(final HttpStatusCode statusCode) {
        return statusCode.value() == 400 || statusCode.value() == 401;
    }
}
