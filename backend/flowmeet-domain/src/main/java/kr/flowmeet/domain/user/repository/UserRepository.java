package kr.flowmeet.domain.user.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByNickname(String nickname);

    Optional<User> findBySocialEmail(String socialEmail);

    Optional<User> findByEmail(String email);
}
