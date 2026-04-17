package kr.flowmeet.api.notification.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.dto.PageResponse;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.notification.dto.request.UpdateNotificationSettingRequest;
import kr.flowmeet.api.notification.dto.response.NotificationSummaryResponse;
import kr.flowmeet.api.notification.dto.response.GetNotificationSettingResponse;
import kr.flowmeet.api.notification.dto.response.GetUnreadCountResponse;
import kr.flowmeet.domain.notification.entity.Notification;
import kr.flowmeet.domain.notification.entity.NotificationSetting;
import kr.flowmeet.domain.notification.exception.NotificationErrorCode;
import kr.flowmeet.domain.notification.service.NotificationService;
import kr.flowmeet.domain.notification.service.NotificationSettingService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationFacade {

    private final NotificationService notificationService;
    private final NotificationSettingService notificationSettingService;

    public PageResponse<NotificationSummaryResponse> getAllNotifications(final Long userId, final Boolean isRead,
                                                                         final int page, final int size) {
        Page<Notification> notifications = notificationService.findAllByUserId(userId, isRead, page, size);
        return PageResponse.from(notifications).map(NotificationSummaryResponse::from);
    }

    @Transactional
    public void markAsRead(final Long userId, final Long notificationId) {
        Notification notification = notificationService.findById(notificationId);
        validateNotificationOwner(userId, notification);
        notification.markAsRead();
    }

    @Transactional
    public void markAllAsRead(final Long userId) {
        notificationService.markAllAsRead(userId);
    }

    public GetUnreadCountResponse getUnreadCount(final Long userId) {
        long unreadCount = notificationService.countUnread(userId);
        return GetUnreadCountResponse.from(unreadCount);
    }

    public GetNotificationSettingResponse getNotificationSetting(final Long userId, final Long projectId) {
        NotificationSetting setting = notificationSettingService.findByUserIdAndProjectId(userId, projectId);
        return GetNotificationSettingResponse.from(setting);
    }

    @Transactional
    public GetNotificationSettingResponse updateNotificationSetting(final Long userId, final Long projectId,
                                                                     final UpdateNotificationSettingRequest request) {
        NotificationSetting setting = notificationSettingService.findByUserIdAndProjectId(userId, projectId);

        setting.update(request.meetingEnabled(), request.nodeEnabled(),
                request.desktopEnabled(), request.emailEnabled());

        return GetNotificationSettingResponse.from(setting);
    }

    private void validateNotificationOwner(final Long userId, final Notification notification) {
        if (!notification.getUserId().equals(userId)) {
            throw new ApiException(NotificationErrorCode.NOTIFICATION_ACCESS_DENIED);
        }
    }
}