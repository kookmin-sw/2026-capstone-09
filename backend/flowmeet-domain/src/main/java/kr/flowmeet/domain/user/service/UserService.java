package kr.flowmeet.domain.user.service;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.exception.UserErrorCode;
import kr.flowmeet.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public User findById(final Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(UserErrorCode.USER_NOT_FOUND));
    }

    public User findBySocialEmail(final String socialEmail) {
        return userRepository.findBySocialEmail(socialEmail)
                .orElseThrow(() -> new BusinessException(UserErrorCode.USER_NOT_FOUND));
    }

    public Optional<User> findOptionalByEmail(final String email) {
        return userRepository.findByEmail(email);
    }



    public void validateNicknameNotDuplicated(final String nickname, final String currentNickname) {
        if (!nickname.equals(currentNickname) && userRepository.existsByNickname(nickname)) {
            throw new BusinessException(UserErrorCode.USER_NICKNAME_DUPLICATED);
        }
    }

    @Transactional
    public void delete(final User user) {
        userRepository.delete(user);
    }
}
