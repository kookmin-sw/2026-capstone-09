package kr.flowmeet.api.node.dto.response;

import kr.flowmeet.domain.user.entity.User;

public record AssigneeItem(
        Long userId,
        String nickname,
        String email,
        String profileImageUrl
) {

    public static AssigneeItem from(final User user) {
        return new AssigneeItem(user.getId(), user.getNickname(), user.getEmail(), user.getProfileImageUrl());
    }
}
