package kr.flowmeet.api.notification.controller;

import java.io.IOException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.dto.CursorSliceResponse;
import kr.flowmeet.api.notification.dto.response.NotificationSummaryResponse;
import kr.flowmeet.api.notification.dto.response.GetUnreadCountResponse;
import kr.flowmeet.api.notification.facade.NotificationFacade;
import kr.flowmeet.api.notification.sse.SseEmitterRepository;
import kr.flowmeet.auth.annotation.UserId;

@Slf4j
@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationController implements NotificationApi {

    private static final long SSE_TIMEOUT = 30L * 60 * 1000;

    private final NotificationFacade notificationFacade;
    private final SseEmitterRepository sseEmitterRepository;

    @Override
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@UserId Long userId, HttpServletResponse response) {
        response.setHeader("X-Accel-Buffering", "no");

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        sseEmitterRepository.save(userId, emitter);

        emitter.onTimeout(() -> sseEmitterRepository.remove(userId));
        emitter.onError(e -> sseEmitterRepository.remove(userId));
        emitter.onCompletion(() -> sseEmitterRepository.remove(userId));

        try {
            emitter.send(SseEmitter.event().name("connect").data("connected"));
        } catch (IOException e) {
            sseEmitterRepository.remove(userId);
        }

        return emitter;
    }

    @Override
    @GetMapping
    public CommonResponse<CursorSliceResponse<NotificationSummaryResponse>> getAllNotifications(
            @UserId Long userId,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "20") int size
    ) {
        return CommonResponse.ok(notificationFacade.getAllNotifications(userId, isRead, cursorId, size));
    }

    @Override
    @PatchMapping("/{notificationId}/read")
    public CommonResponse<?> markAsRead(@UserId Long userId, @PathVariable Long notificationId) {
        notificationFacade.markAsRead(userId, notificationId);
        return CommonResponse.ok();
    }

    @Override
    @PatchMapping("/all")
    public CommonResponse<?> markAllAsRead(@UserId Long userId) {
        notificationFacade.markAllAsRead(userId);
        return CommonResponse.ok();
    }

    @Override
    @GetMapping("/unread-count")
    public CommonResponse<GetUnreadCountResponse> getUnreadCount(@UserId Long userId) {
        return CommonResponse.ok(notificationFacade.getUnreadCount(userId));
    }
}
