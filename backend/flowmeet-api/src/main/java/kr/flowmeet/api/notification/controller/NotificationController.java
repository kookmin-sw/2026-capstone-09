package kr.flowmeet.api.notification.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.api.notification.dto.response.NotificationSummaryResponse;
import kr.flowmeet.api.notification.dto.response.GetUnreadCountResponse;
import kr.flowmeet.api.notification.facade.NotificationFacade;
import kr.flowmeet.api.notification.success.NotificationSuccessCode;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationController implements NotificationApi {

    private final NotificationFacade notificationFacade;

    @Override
    @GetMapping
    public CommonResponse<CursorSliceResponse<NotificationSummaryResponse>> getAllNotifications(
            @UserId Long userId,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "20") int size
    ) {
        return CommonResponse.ok(
                NotificationSuccessCode.GET_ALL_NOTIFICATIONS,
                notificationFacade.getAllNotifications(userId, isRead, cursorId, size)
        );
    }

    @Override
    @PatchMapping("/{notificationId}/read")
    public CommonResponse<?> markAsRead(@UserId Long userId, @PathVariable Long notificationId) {
        notificationFacade.markAsRead(userId, notificationId);
        return CommonResponse.ok(NotificationSuccessCode.MARK_AS_READ);
    }

    @Override
    @PatchMapping("/all")
    public CommonResponse<?> markAllAsRead(@UserId Long userId) {
        notificationFacade.markAllAsRead(userId);
        return CommonResponse.ok(NotificationSuccessCode.MARK_ALL_AS_READ);
    }

    @Override
    @GetMapping("/unread-count")
    public CommonResponse<GetUnreadCountResponse> getUnreadCount(@UserId Long userId) {
        return CommonResponse.ok(NotificationSuccessCode.GET_UNREAD_COUNT, notificationFacade.getUnreadCount(userId));
    }
}
