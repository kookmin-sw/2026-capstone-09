package kr.flowmeet.domain.user.entity;

import kr.flowmeet.domain.auth.exception.AuthDomainErrorCode;
import kr.flowmeet.domain.common.exception.BusinessException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SocialProvider {
    GOOGLE("구글"), KAKAO("카카오");

    private final String displayName;

    public static SocialProvider from(String provider) {
        try {
            return SocialProvider.valueOf(provider.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(AuthDomainErrorCode.AUTH_INVALID_PROVIDER);
        }
    }
}
