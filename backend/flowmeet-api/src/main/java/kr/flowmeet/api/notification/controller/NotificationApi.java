package kr.flowmeet.api.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.api.notification.dto.response.NotificationSummaryResponse;
import kr.flowmeet.api.notification.dto.response.GetUnreadCountResponse;
import kr.flowmeet.api.notification.success.NotificationSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.notification.exception.NotificationErrorCode;

@Tag(name = "Notification", description = "알림")
public interface NotificationApi {

    @Operation(summary = "알림 목록 조회",
            description = "isRead 필터와 커서 기반 슬라이싱을 지원합니다. 첫 요청은 cursorId 생략, 이후 응답의 nextCursorId를 그대로 전달합니다.")
    @ApiSuccessCode(code = NotificationSuccessCode.class, name = "GET_ALL_NOTIFICATIONS")
    CommonResponse<CursorSliceResponse<NotificationSummaryResponse>> getAllNotifications(
            @UserId Long userId,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "20") int size);

    @Operation(summary = "알림 읽음 처리")
    @ApiSuccessCode(code = NotificationSuccessCode.class, name = "MARK_AS_READ")
    @ApiErrorCode(code = NotificationErrorCode.class, names = {"NOTIFICATION_NOT_FOUND", "NOTIFICATION_ACCESS_DENIED"})
    CommonResponse<?> markAsRead(@UserId Long userId, @PathVariable Long notificationId);

    @Operation(summary = "전체 알림 읽음 처리")
    @ApiSuccessCode(code = NotificationSuccessCode.class, name = "MARK_ALL_AS_READ")
    CommonResponse<?> markAllAsRead(@UserId Long userId);

    @Operation(summary = "읽지 않은 알림 개수 조회")
    @ApiSuccessCode(code = NotificationSuccessCode.class, name = "GET_UNREAD_COUNT")
    CommonResponse<GetUnreadCountResponse> getUnreadCount(@UserId Long userId);
}
