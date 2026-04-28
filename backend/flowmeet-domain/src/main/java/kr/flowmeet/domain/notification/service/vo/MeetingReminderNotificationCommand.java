package kr.flowmeet.domain.notification.service.vo;

import kr.flowmeet.domain.notification.entity.NotificationType;

public class MeetingReminderNotificationCommand extends NotificationCommand {

    private final Long nodeId;

    public static MeetingReminderNotificationCommand of(Long userId, Long projectId, Long nodeId, String nodeName) {
        return new MeetingReminderNotificationCommand(userId, projectId, nodeId, nodeName);
    }

    private MeetingReminderNotificationCommand(Long userId, Long projectId, Long nodeId, String nodeName) {
        super(userId, projectId, NotificationType.MEETING_REMINDER);
        this.nodeId = nodeId;
        addArguments(nodeName);
    }

    @Override
    public Long getTargetId() {
        return nodeId;
    }
}