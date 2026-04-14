package kr.flowmeet.domain.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    public Page<Notification> findAllByUserId(final Long userId, final Boolean isRead,
                                               final int page, final int size) {
        return notificationRepository.findAllByUserId(userId, isRead, PageRequest.of(page, size));
    }

    public long countUnread(final Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    @Transactional
    public Notification create(final Notification notification) {
        Notification saved = notificationRepository.save(notification);
        eventPublisher.publishEvent(new NotificationCreatedEvent(saved));
        return saved;
    }

    @Transactional
    public int markAllAsRead(final Long userId) {
        return notificationRepository.markAllAsRead(userId);
    }
}