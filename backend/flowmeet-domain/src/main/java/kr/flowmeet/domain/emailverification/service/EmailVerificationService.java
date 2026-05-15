package kr.flowmeet.domain.emailverification.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.emailverification.entity.EmailVerification;
import kr.flowmeet.domain.emailverification.event.EmailVerificationIssuedEvent;
import kr.flowmeet.domain.emailverification.exception.EmailVerificationErrorCode;
import kr.flowmeet.domain.emailverification.repository.EmailVerificationRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmailVerificationService {

    private static final int CODE_LENGTH = 6;
    private static final int CODE_BOUND = 1_000_000;
    private static final long EXPIRATION_MINUTES = 5;

    private static final SecureRandom RANDOM = new SecureRandom();

    private final EmailVerificationRepository emailVerificationRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public EmailVerification issueCode(final Long userId, final String email) {
        emailVerificationRepository.deleteAllByUserIdAndEmail(userId, email);

        EmailVerification verification = EmailVerification.builder()
                .userId(userId)
                .email(email)
                .code(generateCode())
                .expiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES))
                .build();

        EmailVerification saved = emailVerificationRepository.save(verification);

        eventPublisher.publishEvent(EmailVerificationIssuedEvent.of(saved.getEmail(), saved.getCode()));

        return saved;
    }

    @Transactional
    public void verify(final Long userId, final String email, final String code) {
        EmailVerification verification = emailVerificationRepository
                .findTopByUserIdAndEmailAndVerifiedAtIsNullOrderByCreatedAtDesc(userId, email)
                .orElseThrow(() -> new BusinessException(EmailVerificationErrorCode.EMAIL_VERIFICATION_NOT_FOUND));

        if (verification.isExpired()) {
            throw new BusinessException(EmailVerificationErrorCode.EMAIL_VERIFICATION_CODE_EXPIRED);
        }

        if (!verification.matchesCode(code)) {
            throw new BusinessException(EmailVerificationErrorCode.EMAIL_VERIFICATION_CODE_INVALID);
        }

        verification.markVerified();
    }

    @Transactional
    public void consumeVerified(final Long userId, final String email) {
        EmailVerification verification = emailVerificationRepository
                .findTopByUserIdAndEmailAndVerifiedAtIsNotNullOrderByCreatedAtDesc(userId, email)
                .orElseThrow(() -> new BusinessException(EmailVerificationErrorCode.EMAIL_VERIFICATION_REQUIRED));

        emailVerificationRepository.deleteAllByUserIdAndEmail(userId, email);
    }

    @Transactional
    public EmailVerification issueCode(final String email) {
        emailVerificationRepository.deleteAllByUserIdIsNullAndEmail(email);

        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(generateCode())
                .expiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES))
                .build();

        EmailVerification saved = emailVerificationRepository.save(verification);

        eventPublisher.publishEvent(EmailVerificationIssuedEvent.of(saved.getEmail(), saved.getCode()));

        return saved;
    }

    @Transactional
    public void verify(final String email, final String code) {
        EmailVerification verification = emailVerificationRepository
                .findTopByUserIdIsNullAndEmailAndVerifiedAtIsNullOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BusinessException(EmailVerificationErrorCode.EMAIL_VERIFICATION_NOT_FOUND));

        if (verification.isExpired()) {
            throw new BusinessException(EmailVerificationErrorCode.EMAIL_VERIFICATION_CODE_EXPIRED);
        }

        if (!verification.matchesCode(code)) {
            throw new BusinessException(EmailVerificationErrorCode.EMAIL_VERIFICATION_CODE_INVALID);
        }

        verification.markVerified();
    }

    @Transactional
    public void consumeVerified(final String email) {
        emailVerificationRepository
                .findTopByUserIdIsNullAndEmailAndVerifiedAtIsNotNullOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new BusinessException(EmailVerificationErrorCode.EMAIL_VERIFICATION_REQUIRED));

        emailVerificationRepository.deleteAllByUserIdIsNullAndEmail(email);
    }

    private String generateCode() {
        int value = RANDOM.nextInt(CODE_BOUND);
        return String.format("%0" + CODE_LENGTH + "d", value);
    }
}
