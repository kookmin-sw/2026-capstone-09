package kr.flowmeet.domain.notification.event;

import kr.flowmeet.domain.notification.entity.Notification;
public record NotificationCreatedEvent(Notification notification) {
}