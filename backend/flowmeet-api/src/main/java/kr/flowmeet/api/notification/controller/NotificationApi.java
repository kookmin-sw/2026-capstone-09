package kr.flowmeet.api.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.PageResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.notification.dto.response.NotificationSummaryResponse;
import kr.flowmeet.api.notification.dto.response.GetUnreadCountResponse;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.notification.exception.NotificationErrorCode;

@Tag(name = "Notification")
public interface NotificationApi {

    @Operation(summary = "알림 목록 조회", description = "isRead 필터와 페이징을 지원합니다.")
    CommonResponse<PageResponse<NotificationSummaryResponse>> getAllNotifications(
            @UserId Long userId,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size);

    @Operation(summary = "알림 읽음 처리")
    @ApiErrorCode(code = NotificationErrorCode.class, names = {"NOTIFICATION_NOT_FOUND", "NOTIFICATION_ACCESS_DENIED"})
    CommonResponse<?> markAsRead(@UserId Long userId, @PathVariable Long notificationId);

    @Operation(summary = "전체 알림 읽음 처리")
    CommonResponse<?> markAllAsRead(@UserId Long userId);

    @Operation(summary = "읽지 않은 알림 개수 조회")
    CommonResponse<GetUnreadCountResponse> getUnreadCount(@UserId Long userId);
}