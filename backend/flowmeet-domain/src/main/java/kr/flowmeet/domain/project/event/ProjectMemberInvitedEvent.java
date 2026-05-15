package kr.flowmeet.domain.project.event;

public record ProjectMemberInvitedEvent(
        Long projectId,
        String projectName,
        String inviteeEmail,
        String inviterNickname,
        String inviteLink
) {
    public static ProjectMemberInvitedEvent of(
            final Long projectId,
            final String projectName,
            final String inviteeEmail,
            final String inviterNickname,
            final String inviteLink
    ) {
        return new ProjectMemberInvitedEvent(projectId, projectName, inviteeEmail, inviterNickname, inviteLink);
    }
}
