package kr.flowmeet.domain.user.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByNickname(String nickname);

    Optional<User> findBySocialEmail(String socialEmail);

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM users WHERE social_email = :socialEmail LIMIT 1", nativeQuery = true)
    Optional<User> findBySocialEmailIncludingDeleted(@Param("socialEmail") String socialEmail);
}
