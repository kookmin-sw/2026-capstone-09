package kr.flowmeet.domain.emailverification.event;

public record EmailVerificationIssuedEvent(
        String email,
        String code
) {
    public static EmailVerificationIssuedEvent of(final String email, final String code) {
        return new EmailVerificationIssuedEvent(email, code);
    }
}
