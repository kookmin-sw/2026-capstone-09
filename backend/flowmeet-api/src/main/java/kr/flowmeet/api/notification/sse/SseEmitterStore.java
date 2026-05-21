package kr.flowmeet.api.notification.sse;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class SseEmitterStore {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    private String key(Long userId, Long projectId) {
        return userId + ":" + projectId;
    }

    public void save(final Long userId, final Long projectId, final SseEmitter emitter) {
        String key = key(userId, projectId);
        SseEmitter existing = emitters.put(key, emitter);
        if (existing != null) {
            existing.complete();
        }
    }

    public Optional<SseEmitter> findByUserAndProject(final Long userId, final Long projectId) {
        return Optional.ofNullable(emitters.get(key(userId, projectId)));
    }

    public void remove(final Long userId, final Long projectId) {
        emitters.remove(key(userId, projectId));
    }

    public void removeByKey(final String key) {
        emitters.remove(key);
    }

    public Map<String, SseEmitter> findAll() {
        return Collections.unmodifiableMap(emitters);
    }
}