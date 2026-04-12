package kr.flowmeet.api.notification.dto.request;

public record UpdateNotificationSettingRequest(
        boolean meetingEnabled,
        boolean nodeEnabled,
        boolean desktopEnabled,
        boolean emailEnabled
) {
}