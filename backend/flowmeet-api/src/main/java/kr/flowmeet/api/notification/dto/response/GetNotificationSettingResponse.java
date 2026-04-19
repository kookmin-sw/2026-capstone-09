package kr.flowmeet.api.notification.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.flowmeet.domain.notification.entity.NotificationSetting;

@Schema(description = "프로젝트 알림 설정 조회 응답")
public record GetNotificationSettingResponse(
        @Schema(description = "프로젝트 ID", example = "17")
        Long projectId,
        @Schema(description = "회의 관련 알림 수신 여부", example = "true")
        boolean meetingEnabled,
        @Schema(description = "노드 관련 알림 수신 여부", example = "true")
        boolean nodeEnabled,
        @Schema(description = "데스크톱 푸시 알림 수신 여부", example = "false")
        boolean desktopEnabled,
        @Schema(description = "이메일 알림 수신 여부", example = "true")
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
