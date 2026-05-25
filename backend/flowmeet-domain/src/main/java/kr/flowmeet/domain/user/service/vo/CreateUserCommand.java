package kr.flowmeet.domain.user.service.vo;

import kr.flowmeet.domain.user.entity.SocialProvider;

public record CreateUserCommand(
        SocialProvider socialProvider,
        String socialId,
        String socialEmail,
        String email,
        String nickname,
        String profileImageUrl
) {

    public static CreateUserCommand of(
            SocialProvider socialProvider,
            String socialId,
            String socialEmail,
            String email,
            String nickname,
            String profileImageUrl
    ) {
        return new CreateUserCommand(socialProvider, socialId, socialEmail, email, nickname, profileImageUrl);
    }
}
