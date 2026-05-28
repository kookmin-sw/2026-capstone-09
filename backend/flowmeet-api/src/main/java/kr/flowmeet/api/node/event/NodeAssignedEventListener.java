package kr.flowmeet.api.node.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.notification.entity.NotificationSetting;
import kr.flowmeet.domain.notification.service.NotificationService;
import kr.flowmeet.domain.notification.service.NotificationSettingService;
import kr.flowmeet.domain.notification.service.vo.NodeAssignedNotificationCommand;
import kr.flowmeet.domain.project.service.ProjectService;

@Slf4j
@Component
@RequiredArgsConstructor
public class NodeAssignedEventListener {

    private final NotificationService notificationService;
    private final NotificationSettingService notificationSettingService;
    private final ProjectService projectService;
    private final NodeService nodeService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final NodeAssignedEvent event) {
        try {
            notificationSettingService.findOptionalByUserIdAndProjectId(event.assigneeUserId(), event.projectId())
                    .filter(NotificationSetting::isNodeEnabled)
                    .ifPresent(setting -> {
                        String projectName = projectService.findById(event.projectId()).getName();
                        String nodeTitle = nodeService.findByIdAndProjectId(event.nodeId(), event.projectId()).getTitle();
                        notificationService.send(NodeAssignedNotificationCommand.of(
                                event.assigneeUserId(), event.projectId(), event.nodeId(),
                                projectName, nodeTitle));
                    });
        } catch (Exception e) {
            log.error("[NodeAssigned] 알림 발송 실패. assigneeUserId={}, nodeId={}",
                    event.assigneeUserId(), event.nodeId(), e);
        }
    }
}