package kr.flowmeet.api.notification.sse;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Component
public class SseEmitterRepository {

    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void save(final Long userId, final SseEmitter emitter) {
        SseEmitter existing = emitters.put(userId, emitter);
        if (existing != null) {
            existing.complete();
        }
    }

    public Optional<SseEmitter> findByUserId(final Long userId) {
        return Optional.ofNullable(emitters.get(userId));
    }

    public void remove(final Long userId) {
        emitters.remove(userId);
    }

    @Scheduled(fixedRate = 30_000)
    public void sendHeartbeat() {
        if (emitters.isEmpty()) {
            return;
        }
        emitters.forEach((userId, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name("heartbeat").data(""));
            } catch (IOException e) {
                emitters.remove(userId);
                log.debug("[SSE] heartbeat 실패, 연결 제거: userId={}", userId);
            }
        });
    }
}