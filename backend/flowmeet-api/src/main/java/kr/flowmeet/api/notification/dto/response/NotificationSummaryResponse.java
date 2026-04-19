package kr.flowmeet.api.notification.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import kr.flowmeet.domain.notification.entity.Notification;
import kr.flowmeet.domain.notification.entity.NotificationType;

@Schema(description = "알림 요약 응답")
public record NotificationSummaryResponse(
        @Schema(description = "알림 ID", example = "4821")
        Long notificationId,
        @Schema(description = "알림 유형", example = "MEETING_CREATED")
        NotificationType type,
        @Schema(description = "알림 제목", example = "새 회의")
        String title,
        @Schema(description = "알림 본문", example = "FlowMeet 프로젝트에 새 회의가 만들어졌어요")
        String content,
        @Schema(description = "관련 프로젝트 ID", example = "17")
        Long projectId,
        @Schema(description = "관련 프로젝트 이름", example = "FlowMeet")
        String projectName,
        @Schema(description = "관련 노드 ID", example = "128")
        Long nodeId,
        @Schema(description = "읽음 여부", example = "false")
        boolean isRead,
        @Schema(description = "알림 생성 시각", example = "2026-04-19T10:15:30")
        LocalDateTime createdAt
) {
    public static NotificationSummaryResponse from(final Notification notification) {
        return new NotificationSummaryResponse(
                notification.getId(),
                notification.getType(),
                notification.getType().getTitle(),
                notification.getContent(),
                notification.getProjectId(),
                notification.getProject().getName(),
                notification.getNodeId(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
