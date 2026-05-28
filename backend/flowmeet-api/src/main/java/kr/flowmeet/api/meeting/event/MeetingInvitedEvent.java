package kr.flowmeet.api.meeting.event;

import java.util.List;

public record MeetingInvitedEvent(
        Long inviterId,
        Long projectId,
        Long nodeId,
        List<Long> participantUserIds
) {
    public static MeetingInvitedEvent of(
            final Long inviterId, final Long projectId, final Long nodeId, final List<Long> participantUserIds) {
        return new MeetingInvitedEvent(inviterId, projectId, nodeId, participantUserIds);
    }
}