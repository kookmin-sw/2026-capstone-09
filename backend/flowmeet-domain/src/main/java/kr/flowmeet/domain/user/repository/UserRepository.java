package kr.flowmeet.domain.user.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.user.entity.SocialProvider;
import kr.flowmeet.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByNickname(String nickname);

    boolean existsBySocialProviderAndSocialId(SocialProvider socialProvider, String socialId);

    Optional<User> findBySocialProviderAndSocialId(SocialProvider socialProvider, String socialId);

    Optional<User> findByEmail(String email);
}
