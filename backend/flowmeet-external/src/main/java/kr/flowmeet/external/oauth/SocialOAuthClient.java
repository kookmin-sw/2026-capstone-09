package kr.flowmeet.external.oauth;

import kr.flowmeet.external.oauth.dto.SocialTokens;
import kr.flowmeet.external.oauth.dto.SocialUserInfo;

public interface SocialOAuthClient {

    /**
     * 제공자 식별자. 도메인의 SocialProvider enum 값과 일치해야 한다 (예: "GOOGLE").
     */
    String getProviderName();

    SocialTokens exchangeCode(String code, String redirectUri);

    SocialUserInfo fetchUserInfo(String accessToken);
}
