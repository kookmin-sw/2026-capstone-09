package kr.flowmeet.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.exception.BusinessException;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.exception.UserErrorCode;
import kr.flowmeet.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public User findById(final Long userId) {
        return userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new BusinessException(UserErrorCode.USER_NOT_FOUND));
    }

    public User findByPrimaryEmail(final String email) {
        return userRepository.findByPrimaryEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new BusinessException(UserErrorCode.USER_NOT_FOUND));
    }

    public void validateNicknameNotDuplicated(final String nickname, final String currentNickname) {
        if (!nickname.equals(currentNickname) && userRepository.existsByNicknameAndDeletedAtIsNull(nickname)) {
            throw new BusinessException(UserErrorCode.USER_NICKNAME_DUPLICATED);
        }
    }

    @Transactional
    public void delete(final User user) {
        user.softDelete();
    }
}