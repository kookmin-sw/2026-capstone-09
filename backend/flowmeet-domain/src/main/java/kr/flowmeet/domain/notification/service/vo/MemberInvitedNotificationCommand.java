package kr.flowmeet.domain.notification.service.vo;

import kr.flowmeet.domain.notification.entity.NotificationType;

public class MemberInvitedNotificationCommand extends NotificationCommand {

    public static MemberInvitedNotificationCommand of(Long userId, Long projectId, String inviterNickname, String projectName) {
        return new MemberInvitedNotificationCommand(userId, projectId, inviterNickname, projectName);
    }

    private MemberInvitedNotificationCommand(Long userId, Long projectId, String inviterNickname, String projectName) {
        super(userId, projectId, NotificationType.MEMBER_INVITE);
        addArguments(inviterNickname, projectName);
    }
}
