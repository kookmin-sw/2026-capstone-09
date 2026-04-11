package kr.flowmeet.api.notification.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.PageResponse;
import kr.flowmeet.api.notification.dto.response.NotificationSummaryResponse;
import kr.flowmeet.api.notification.dto.response.GetUnreadCountResponse;
import kr.flowmeet.api.notification.facade.NotificationFacade;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationController implements NotificationApi {

    private final NotificationFacade notificationFacade;

    @Override
    @GetMapping
    public CommonResponse<PageResponse<NotificationSummaryResponse>> getAllNotifications(
            @UserId Long userId,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return CommonResponse.ok(notificationFacade.getAllNotifications(userId, isRead, page, size));
    }

    @Override
    @PatchMapping("/{notificationId}/read")
    public CommonResponse<?> markAsRead(@UserId Long userId, @PathVariable Long notificationId) {
        notificationFacade.markAsRead(userId, notificationId);
        return CommonResponse.ok();
    }

    @Override
    @PatchMapping("/all")
    public CommonResponse<?> markAllAsRead(@UserId Long userId) {
        notificationFacade.markAllAsRead(userId);
        return CommonResponse.ok();
    }

    @Override
    @GetMapping("/unread-count")
    public CommonResponse<GetUnreadCountResponse> getUnreadCount(@UserId Long userId) {
        return CommonResponse.ok(notificationFacade.getUnreadCount(userId));
    }
}