package kr.flowmeet.domain.auth.repository;

import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.auth.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM RefreshToken r "
            + "WHERE r.tokenHash = :tokenHash AND r.userId = :userId AND r.expiresAt > :now")
    int deleteByTokenHashAndUserIdAndExpiresAtAfter(
            @Param("tokenHash") String tokenHash,
            @Param("userId") Long userId,
            @Param("now") LocalDateTime now
    );

    void deleteAllByUserId(Long userId);
}
