package kr.flowmeet.domain.user.entity;

import kr.flowmeet.domain.auth.exception.AuthDomainErrorCode;
import kr.flowmeet.domain.common.exception.BusinessException;

public enum SocialProvider {
    GOOGLE, KAKAO;

    public static SocialProvider from(String provider) {
        try {
            return SocialProvider.valueOf(provider.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(AuthDomainErrorCode.AUTH_INVALID_PROVIDER);
        }
    }
}
