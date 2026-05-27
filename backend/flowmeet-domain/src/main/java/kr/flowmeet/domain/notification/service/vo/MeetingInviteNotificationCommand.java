package kr.flowmeet.domain.notification.service.vo;

import kr.flowmeet.domain.notification.entity.NotificationType;

public class MeetingInviteNotificationCommand extends NotificationCommand {

    private final Long nodeId;

    public static MeetingInviteNotificationCommand of(
            Long userId, Long projectId, Long nodeId, String inviterNickname, String nodeName) {
        return new MeetingInviteNotificationCommand(userId, projectId, nodeId, inviterNickname, nodeName);
    }

    private MeetingInviteNotificationCommand(
            Long userId, Long projectId, Long nodeId, String inviterNickname, String nodeName) {
        super(userId, projectId, NotificationType.MEETING_INVITE);
        this.nodeId = nodeId;
        addArguments(inviterNickname, nodeName);
    }

    @Override
    public Long getTargetId() {
        return nodeId;
    }
}