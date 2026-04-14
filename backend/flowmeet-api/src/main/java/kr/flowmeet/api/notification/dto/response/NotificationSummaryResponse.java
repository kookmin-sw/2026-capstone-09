package kr.flowmeet.api.notification.dto.response;

import java.time.LocalDateTime;
import kr.flowmeet.domain.notification.entity.Notification;
import kr.flowmeet.domain.notification.entity.NotificationType;

public record NotificationSummaryResponse(
        Long notificationId,
        NotificationType type,
        String title,
        String content,
        Long projectId,
        String projectName,
        Long nodeId,
        boolean isRead,
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