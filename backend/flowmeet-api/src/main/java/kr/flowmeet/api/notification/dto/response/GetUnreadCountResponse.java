package kr.flowmeet.api.notification.dto.response;

public record GetUnreadCountResponse(
        long unreadCount
) {
    public static GetUnreadCountResponse from(final long unreadCount) {
        return new GetUnreadCountResponse(unreadCount);
    }
}