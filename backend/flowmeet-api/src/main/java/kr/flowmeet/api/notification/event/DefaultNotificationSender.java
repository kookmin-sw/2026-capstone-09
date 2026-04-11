package kr.flowmeet.api.notification.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import kr.flowmeet.domain.notification.entity.Notification;
import kr.flowmeet.domain.notification.service.NotificationSender;

@Slf4j
@Component
public class DefaultNotificationSender implements NotificationSender {

    @Override
    public void send(final Notification notification) {
        // TODO: SSE 또는 WebSocket 실시간 전달 구현 시 여기에 추가
        log.debug("알림 전송 대상: userId={}, type={}", notification.getUserId(), notification.getType());
    }
}