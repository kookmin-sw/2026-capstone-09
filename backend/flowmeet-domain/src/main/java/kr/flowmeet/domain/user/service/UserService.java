package kr.flowmeet.domain.user.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.user.entity.SocialProvider;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.exception.UserErrorCode;
import kr.flowmeet.domain.user.repository.UserRepository;
import kr.flowmeet.domain.user.service.vo.CreateUserCommand;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAllByIds(final List<Long> userIds) {
        return userRepository.findAllById(userIds);
    }

    public Map<Long, User> findAllByIdsAsMap(final List<Long> userIds) {
        return findAllByIds(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
    }

    public User findById(final Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(UserErrorCode.USER_NOT_FOUND));
    }

    public Optional<User> findOptionalBySocialProviderAndSocialId(
            final SocialProvider socialProvider, final String socialId) {
        return userRepository.findBySocialProviderAndSocialId(socialProvider, socialId);
    }

    public Optional<User> findOptionalByEmail(final String email) {
        return userRepository.findByEmail(email);
    }

    public void validateNicknameNotDuplicated(final String nickname, final String currentNickname) {
        if (!nickname.equals(currentNickname) && userRepository.existsByNickname(nickname)) {
            throw new BusinessException(UserErrorCode.USER_NICKNAME_DUPLICATED);
        }
    }

    public void validateNicknameNotDuplicated(final String nickname) {
        if (userRepository.existsByNickname(nickname)) {
            throw new BusinessException(UserErrorCode.USER_NICKNAME_DUPLICATED);
        }
    }

    public void validateEmailNotDuplicated(final String email) {
        userRepository.findByEmail(email).ifPresent(existing -> {
            throw new BusinessException(UserErrorCode.USER_EMAIL_DUPLICATED);
        });
    }

    public void validateEmailChangeable(final String newEmail, final String currentEmail) {
        if (newEmail.equals(currentEmail)) {
            throw new BusinessException(UserErrorCode.USER_EMAIL_SAME_AS_CURRENT);
        }

        userRepository.findByEmail(newEmail)
                .ifPresent(existing -> {
                    throw new BusinessException(UserErrorCode.USER_EMAIL_DUPLICATED);
                });
    }

    @Transactional
    public void updateGoogleRefreshToken(final Long userId, final String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }
        User user = findById(userId);
        user.updateGoogleRefreshToken(refreshToken);
    }

    @Transactional
    public User create(final CreateUserCommand command) {
        validateNicknameNotDuplicated(command.nickname());
        validateEmailNotDuplicated(command.email());

        User user = User.builder()
                .socialProvider(command.socialProvider())
                .socialId(command.socialId())
                .socialEmail(command.socialEmail())
                .email(command.email())
                .nickname(command.nickname())
                .profileImageUrl(command.profileImageUrl())
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public void delete(final User user) {
        userRepository.delete(user);
    }
}
