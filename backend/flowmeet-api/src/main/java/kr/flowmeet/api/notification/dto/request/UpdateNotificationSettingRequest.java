package kr.flowmeet.api.notification.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "프로젝트 알림 설정 수정 요청")
public record UpdateNotificationSettingRequest(
        @Schema(description = "회의 관련 알림 수신 여부", example = "true")
        boolean meetingEnabled,
        @Schema(description = "노드 관련 알림 수신 여부", example = "true")
        boolean nodeEnabled,
        @Schema(description = "데스크톱 푸시 알림 수신 여부", example = "false")
        boolean desktopEnabled,
        @Schema(description = "이메일 알림 수신 여부", example = "true")
        boolean emailEnabled
) {
}
