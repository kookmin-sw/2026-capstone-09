package kr.flowmeet.domain.emailverification.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.emailverification.entity.EmailVerification;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findTopByUserIdAndEmailAndVerifiedAtIsNullOrderByCreatedAtDesc(
            Long userId, String email
    );

    Optional<EmailVerification> findTopByUserIdAndEmailAndVerifiedAtIsNotNullOrderByCreatedAtDesc(
            Long userId, String email
    );

    void deleteAllByUserIdAndEmail(Long userId, String email);

    Optional<EmailVerification> findTopByUserIdIsNullAndEmailAndVerifiedAtIsNullOrderByCreatedAtDesc(
            String email
    );

    Optional<EmailVerification> findTopByUserIdIsNullAndEmailAndVerifiedAtIsNotNullOrderByCreatedAtDesc(
            String email
    );

    void deleteAllByUserIdIsNullAndEmail(String email);
}
