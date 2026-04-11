package kr.flowmeet.domain.notification.event;

import kr.flowmeet.domain.notification.entity.Notification;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class NotificationCreatedEvent {

    private final Notification notification;
}