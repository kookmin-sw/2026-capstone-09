package kr.flowmeet.domain.notification.service.vo;

import kr.flowmeet.domain.notification.entity.NotificationType;

public class NodeAssignedNotificationCommand extends NotificationCommand {

    private final Long nodeId;

    public static NodeAssignedNotificationCommand of(
            Long userId, Long projectId, Long nodeId, String projectName, String nodeTitle) {
        return new NodeAssignedNotificationCommand(userId, projectId, nodeId, projectName, nodeTitle);
    }

    private NodeAssignedNotificationCommand(
            Long userId, Long projectId, Long nodeId, String projectName, String nodeTitle) {
        super(userId, projectId, NotificationType.NODE_ASSIGNED);
        this.nodeId = nodeId;
        addArguments(projectName, nodeTitle);
    }

    @Override
    public Long getTargetId() {
        return nodeId;
    }
}