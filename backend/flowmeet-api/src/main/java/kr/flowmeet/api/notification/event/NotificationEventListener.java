package kr.flowmeet.api.notification.event;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import kr.flowmeet.domain.notification.event.NotificationCreatedEvent;
import kr.flowmeet.domain.notification.service.NotificationSender;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationSender notificationSender;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleNotificationCreated(final NotificationCreatedEvent event) {
        notificationSender.send(event.notification());
    }
}
