package kr.flowmeet.domain.notification.service;

import kr.flowmeet.domain.notification.entity.Notification;

public interface NotificationSender {

    void send(Notification notification);
}