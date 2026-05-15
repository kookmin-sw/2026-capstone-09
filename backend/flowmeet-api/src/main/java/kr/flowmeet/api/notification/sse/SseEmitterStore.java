package kr.flowmeet.api.notification.sse;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class SseEmitterStore {

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

    public Map<Long, SseEmitter> findAll() {
        return Collections.unmodifiableMap(emitters);
    }
}