package kr.flowmeet.api.user.event;

import java.util.Map;
import kr.flowmeet.domain.emailverification.event.EmailVerificationIssuedEvent;
import kr.flowmeet.external.email.EmailSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailVerificationIssuedEventListener {

    private static final String EMAIL_VERIFICATION_TEMPLATE = "email/email-verification";
    private static final String EMAIL_VERIFICATION_SUBJECT = "[FlowMeet] 이메일 인증 코드";

    private final EmailSender emailSender;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(final EmailVerificationIssuedEvent event) {
        try {
            Map<String, Object> variables = Map.of("code", event.code());
            emailSender.send(event.email(), EMAIL_VERIFICATION_SUBJECT, EMAIL_VERIFICATION_TEMPLATE, variables);
        } catch (Exception e) {
            log.error("[EmailVerificationIssuedEventListener] 인증 메일 발송 실패. to={}", event.email(), e);
        }
    }
}
