package kr.flowmeet.api.notification.dto.response;

import kr.flowmeet.domain.notification.entity.NotificationSetting;

public record GetNotificationSettingResponse(
        Long projectId,
        boolean meetingEnabled,
        boolean nodeEnabled,
        boolean desktopEnabled,
        boolean emailEnabled
) {
    public static GetNotificationSettingResponse from(final NotificationSetting setting) {
        return new GetNotificationSettingResponse(
                setting.getProjectId(),
                setting.isMeetingEnabled(),
                setting.isNodeEnabled(),
                setting.isDesktopEnabled(),
                setting.isEmailEnabled()
        );
    }
}