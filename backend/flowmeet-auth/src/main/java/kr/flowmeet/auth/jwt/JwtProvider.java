package kr.flowmeet.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Optional;
import kr.flowmeet.auth.exception.AuthErrorCode;
import kr.flowmeet.auth.exception.AuthException;
import kr.flowmeet.auth.properties.JwtProperties;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.project.exception.ProjectErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtProvider {

    private final JwtProperties jwtProperties;

    private SecretKey createSecretKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtProperties.secretKey());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private static final String INVITATION_TOKEN_TYPE = "INVITATION";

    public String generateToken(final Long userId, final String email, final String name) {
        Date now = new Date();
        return makeToken(
                new Date(now.getTime() + jwtProperties.accessTokenExpiry()),
                String.valueOf(userId),
                Map.of(
                        "email", email,
                        "name", name
                )
        );
    }

    public String generateInvitationToken(final Long projectId, final String inviteeEmail) {
        Date now = new Date();
        return makeToken(
                new Date(now.getTime() + jwtProperties.invitationTokenExpiry()),
                inviteeEmail,
                Map.of(
                        "type", INVITATION_TOKEN_TYPE,
                        "projectId", projectId
                )
        );
    }

    public InvitationTokenPayload parseInvitationToken(final String token) {
        final Claims claims;
        try {
            claims = Jwts.parser()
                    .verifyWith(createSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new BusinessException(ProjectErrorCode.INVITATION_TOKEN_EXPIRED);
        } catch (Exception e) {
            log.error("[parseInvitationToken] Error: ", e);
            throw new BusinessException(ProjectErrorCode.INVITATION_TOKEN_INVALID);
        }

        if (!INVITATION_TOKEN_TYPE.equals(claims.get("type", String.class))) {
            throw new BusinessException(ProjectErrorCode.INVITATION_TOKEN_INVALID);
        }

        Long projectId = claims.get("projectId", Number.class).longValue();
        String inviteeEmail = claims.getSubject();
        return InvitationTokenPayload.of(projectId, inviteeEmail);
    }

    private String makeToken(final Date expiry, final String subject, final Map<String, ?> claims) {
        Date now = new Date();

        var builder = Jwts.builder()
                .header().type("JWT").and()
                .issuer(jwtProperties.issuer())
                .issuedAt(now)
                .expiration(expiry)
                .subject(subject);

        claims.forEach(builder::claim);

        return builder
                .signWith(createSecretKey())
                .compact();
    }

    public boolean validToken(final String token) {
        try {
            if (token == null) return false;

            Jwts.parser()
                    .verifyWith(createSecretKey())
                    .build()
                    .parseSignedClaims(token);

            return true;
        } catch (ExpiredJwtException e) {
            throw new AuthException(AuthErrorCode.EXPIRED_ACCESS_TOKEN);
        } catch (Exception e) {
            log.error("[validToken] Error: ", e);
            throw new AuthException(AuthErrorCode.INVALID_ACCESS_TOKEN);
        }
    }

    public Optional<Long> extractUserIdFromToken(final String token) {
        if (token == null) return Optional.empty();

        try {
            return Optional.of(Long.parseLong(getClaims(token).getSubject()));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Claims getClaims(final String token) {
        return Jwts.parser()
                .verifyWith(createSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}