package kr.flowmeet.auth.jwt;

public record InvitationTokenPayload(
        Long projectId,
        String inviteeEmail
) {
    public static InvitationTokenPayload of(final Long projectId, final String inviteeEmail) {
        return new InvitationTokenPayload(projectId, inviteeEmail);
    }
}
