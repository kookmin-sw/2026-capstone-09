package kr.flowmeet.api.notification.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationSuccessCode implements SuccessCode {
    GET_ALL_NOTIFICATIONS("알림 목록을 조회했어요."),
    MARK_AS_READ("알림을 읽음 처리했어요."),
    MARK_ALL_AS_READ("전체 알림을 읽음 처리했어요."),
    GET_UNREAD_COUNT("읽지 않은 알림 개수를 조회했어요."),
    GET_NOTIFICATION_SETTING("알림 설정을 조회했어요."),
    UPDATE_NOTIFICATION_SETTING("알림 설정을 변경했어요.");

    private final String message;
}
