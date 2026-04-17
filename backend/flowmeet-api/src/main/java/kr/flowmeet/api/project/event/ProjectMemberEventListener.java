package kr.flowmeet.api.project.event;

import kr.flowmeet.domain.project.event.ProjectMemberInvitedEvent;
import kr.flowmeet.external.email.EmailSender;
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
    private final EmailSender emailSender;

    @TransactionalEventListener
    public void handleProjectMemberJoined(final ProjectMemberJoinedEvent event) {
        notificationSettingService.create(event.userId(), event.projectId());
    }

    @TransactionalEventListener
    public void handleInvited(final ProjectMemberInvitedEvent event) {
        //TODO: 초대 이메일 템플릿 추가해서 구현
        emailSender.send(event.inviteeEmail(), "초대 이메일", "초대 이메일 내용");
    }
}