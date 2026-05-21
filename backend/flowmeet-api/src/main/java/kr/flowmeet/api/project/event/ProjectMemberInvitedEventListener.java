package kr.flowmeet.api.project.event;

import java.util.Map;
import kr.flowmeet.domain.project.event.ProjectMemberInvitedEvent;
import kr.flowmeet.external.email.EmailSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectMemberInvitedEventListener {

    private static final String INVITATION_TEMPLATE = "email/invitation";

    private final EmailSender emailSender;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final ProjectMemberInvitedEvent event) {
        try {
            String subject = "[FlowMeet] " + event.projectName() + " 프로젝트 초대";
            Map<String, Object> variables = Map.of(
                    "projectName", event.projectName(),
                    "inviterNickname", event.inviterNickname(),
                    "inviteLink", event.inviteLink()
            );

            emailSender.send(event.inviteeEmail(), subject, INVITATION_TEMPLATE, variables);
        } catch (Exception e) {
            log.error("[ProjectMemberInvitedEventListener] 초대 메일 발송 실패. to={}, projectId={}",
                    event.inviteeEmail(), event.projectId(), e);
        }
    }
}
