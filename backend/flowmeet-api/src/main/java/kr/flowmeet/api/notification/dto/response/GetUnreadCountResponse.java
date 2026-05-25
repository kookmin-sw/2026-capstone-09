package kr.flowmeet.api.notification.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "읽지 않은 알림 개수 응답")
public record GetUnreadCountResponse(
        @Schema(description = "읽지 않은 알림 개수", example = "5")
        long unreadCount
) {
    public static GetUnreadCountResponse from(final long unreadCount) {
        return new GetUnreadCountResponse(unreadCount);
    }
}
