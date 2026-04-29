package kr.flowmeet.api.notification.sse;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
@RequiredArgsConstructor
public class SseEmitterService {

    private static final long SSE_TIMEOUT = 30L * 60 * 1000;

    private final SseEmitterStore sseEmitterStore;

    public SseEmitter subscribe(final Long userId) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        sseEmitterStore.save(userId, emitter);

        emitter.onTimeout(() -> sseEmitterStore.remove(userId));
        emitter.onError(e -> sseEmitterStore.remove(userId));
        emitter.onCompletion(() -> sseEmitterStore.remove(userId));

        try {
            emitter.send(SseEmitter.event().name("connect").data("connected"));
        } catch (IOException e) {
            sseEmitterStore.remove(userId);
        }

        return emitter;
    }

    @Scheduled(fixedRate = 30_000)
    public void sendHeartbeat() {
        sseEmitterStore.findAll().forEach((userId, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name("heartbeat").data(""));
            } catch (IOException e) {
                sseEmitterStore.remove(userId);
                log.debug("[SSE] heartbeat 실패, 연결 제거: userId={}", userId);
            }
        });
    }
}