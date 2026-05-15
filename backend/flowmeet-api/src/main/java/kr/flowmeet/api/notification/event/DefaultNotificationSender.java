package kr.flowmeet.api.notification.event;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import kr.flowmeet.api.notification.dto.response.NotificationSsePayload;
import kr.flowmeet.api.notification.sse.SseEmitterStore;
import kr.flowmeet.domain.notification.entity.Notification;
import kr.flowmeet.domain.notification.service.NotificationSender;

@Slf4j
@Component
@RequiredArgsConstructor
public class DefaultNotificationSender implements NotificationSender {

    private final SseEmitterStore sseEmitterStore;

    @Override
    public void send(final Notification notification) {
        sseEmitterStore.findByUserId(notification.getUserId())
                .ifPresent(emitter -> {
                    try {
                        emitter.send(SseEmitter.event()
                                .name("notification")
                                .data(NotificationSsePayload.from(notification)));
                    } catch (IOException e) {
                        sseEmitterStore.remove(notification.getUserId());
                        log.debug("[SSE] 전송 실패, 연결 제거: userId={}", notification.getUserId());
                    }
                });
    }
}