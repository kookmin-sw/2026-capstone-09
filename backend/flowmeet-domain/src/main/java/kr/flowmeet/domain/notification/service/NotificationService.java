package kr.flowmeet.domain.notification.service;

import java.util.List;
import kr.flowmeet.domain.common.vo.CursorSlice;
import kr.flowmeet.domain.notification.entity.NotificationType;
import kr.flowmeet.domain.notification.service.vo.NotificationCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.notification.entity.Notification;
import kr.flowmeet.domain.notification.exception.NotificationErrorCode;
import kr.flowmeet.domain.notification.event.NotificationCreatedEvent;
import kr.flowmeet.domain.notification.repository.NotificationRepository;
import org.springframework.context.ApplicationEventPublisher;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ApplicationEventPublisher eventPublisher;

    public Notification findById(final Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BusinessException(NotificationErrorCode.NOTIFICATION_NOT_FOUND));
    }

    public List<Notification> findAllByUserId(
            final Long userId,
            final Boolean isRead,
            final CursorSlice cursorSlice
    ) {
        return notificationRepository.findAllByUserId(userId, isRead, cursorSlice.cursorId(), cursorSlice.size());
    }

    public long countUnread(final Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    @Transactional
    public void send(final NotificationCommand command) {
        NotificationType type = command.getType();
        Notification notification = notificationRepository.save(
                Notification.builder()
                        .userId(command.getUserId())
                        .type(type)
                        .content(type.formatContent(command.getArguments().toArray(new String[0])))
                        .projectId(command.getProjectId())
                        .build()
        );
        eventPublisher.publishEvent(new NotificationCreatedEvent(notification));
    }

    @Transactional
    public void markAllAsRead(final Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    @Transactional
    public void deleteAllByProjectId(final Long projectId) {
        notificationRepository.deleteAllByProjectId(projectId);
    }
}
