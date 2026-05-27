package kr.flowmeet.api.meeting.event;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.notification.entity.NotificationSetting;
import kr.flowmeet.domain.notification.service.NotificationService;
import kr.flowmeet.domain.notification.service.NotificationSettingService;
import kr.flowmeet.domain.notification.service.vo.MeetingInviteNotificationCommand;
import kr.flowmeet.domain.user.service.UserService;

@Slf4j
@Component
@RequiredArgsConstructor
public class MeetingInvitedEventListener {

    private final NotificationService notificationService;
    private final NotificationSettingService notificationSettingService;
    private final NodeService nodeService;
    private final UserService userService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final MeetingInvitedEvent event) {
        if (event.participantUserIds() == null || event.participantUserIds().isEmpty()) {
            return;
        }
        try {
            String inviterNickname = userService.findById(event.inviterId()).getNickname();
            String nodeName = nodeService.findByIdAndProjectId(event.nodeId(), event.projectId()).getTitle();
            Map<Long, NotificationSetting> settingByUserId = notificationSettingService.findAllByProjectId(event.projectId())
                    .stream()
                    .collect(Collectors.toMap(NotificationSetting::getUserId, Function.identity()));

            for (Long participantUserId : event.participantUserIds()) {
                if (participantUserId.equals(event.inviterId())) {
                    continue;
                }
                NotificationSetting setting = settingByUserId.get(participantUserId);
                if (setting == null || !setting.isMeetingEnabled()) {
                    continue;
                }
                notificationService.send(MeetingInviteNotificationCommand.of(
                        participantUserId, event.projectId(), event.nodeId(), inviterNickname, nodeName));
            }
        } catch (Exception e) {
            log.error("[MeetingInvite] 알림 발송 실패. inviterId={}, nodeId={}",
                    event.inviterId(), event.nodeId(), e);
        }
    }
}