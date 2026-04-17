package kr.flowmeet.domain.project.event;

public record ProjectMemberInvitedEvent(
        Long projectId,
        String projectName,
        String inviteeEmail,
        String inviterNickname
) {
    public static ProjectMemberInvitedEvent of(Long projectId, String projectName, String inviteeEmail, String inviterNickname) {
        return new ProjectMemberInvitedEvent(projectId, projectName, inviteeEmail, inviterNickname);
    }
}
