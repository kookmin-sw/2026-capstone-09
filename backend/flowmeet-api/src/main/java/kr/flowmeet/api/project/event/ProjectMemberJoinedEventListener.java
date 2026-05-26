package kr.flowmeet.api.project.event;

import kr.flowmeet.domain.notification.service.NotificationSettingService;
import kr.flowmeet.domain.project.event.ProjectMemberJoinedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ProjectMemberJoinedEventListener {

    private final NotificationSettingService notificationSettingService;

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handle(final ProjectMemberJoinedEvent event) {
        notificationSettingService.create(event.userId(), event.projectId());
    }
}
