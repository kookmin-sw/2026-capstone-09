package kr.flowmeet.domain.user.service.vo;

import kr.flowmeet.domain.user.entity.SocialProvider;

public record SocialIdentity(SocialProvider provider, String id) {
}
