package kr.flowmeet.api.notification.dto.response;

import java.time.LocalDateTime;
import kr.flowmeet.domain.notification.entity.Notification;

public record NotificationSsePayload(
        Long notificationId,
        String type,
        String title,
        String content,
        Long projectId,
        Long targetId,
        LocalDateTime createdAt
) {

    public static NotificationSsePayload from(final Notification notification) {
        return new NotificationSsePayload(
                notification.getId(),
                notification.getType().name(),
                notification.getType().getTitle(),
                notification.getContent(),
                notification.getProjectId(),
                notification.getTargetId(),
                notification.getCreatedAt()
        );
    }
}