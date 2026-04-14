package kr.flowmeet.api.project.event;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import kr.flowmeet.domain.notification.entity.NotificationSetting;
import kr.flowmeet.domain.notification.service.NotificationSettingService;
import kr.flowmeet.domain.project.event.ProjectMemberJoinedEvent;

@Component
@RequiredArgsConstructor
public class ProjectMemberEventListener {

    private final NotificationSettingService notificationSettingService;

    @TransactionalEventListener
    public void handleProjectMemberJoined(final ProjectMemberJoinedEvent event) {
        notificationSettingService.create(
                NotificationSetting.builder()
                        .userId(event.userId())
                        .projectId(event.projectId())
                        .build()
        );
    }
}