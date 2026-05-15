package kr.flowmeet.domain.auth.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import kr.flowmeet.domain.auth.entity.RefreshToken;
import kr.flowmeet.domain.auth.exception.AuthDomainErrorCode;
import kr.flowmeet.domain.auth.repository.RefreshTokenRepository;
import kr.flowmeet.domain.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken issue(final Long userId, final String token, final LocalDateTime expiresAt) {
        return refreshTokenRepository.save(
                RefreshToken.builder()
                        .userId(userId)
                        .tokenHash(hash(token))
                        .expiresAt(expiresAt)
                        .build()
        );
    }

    @Transactional
    public void consume(final String token, final Long userId) {
        int deleted = refreshTokenRepository.deleteByTokenHashAndUserIdAndExpiresAtAfter(
                hash(token), userId, LocalDateTime.now());
        if (deleted == 0) {
            throw new BusinessException(AuthDomainErrorCode.AUTH_INVALID_TOKEN);
        }
    }

    @Transactional
    public void revokeAllByUserId(final Long userId) {
        refreshTokenRepository.deleteAllByUserId(userId);
    }

    public static String hash(final String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
