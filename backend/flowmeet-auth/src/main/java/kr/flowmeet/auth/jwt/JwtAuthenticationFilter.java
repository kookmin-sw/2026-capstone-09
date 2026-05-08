package kr.flowmeet.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import kr.flowmeet.auth.exception.AuthErrorCode;
import kr.flowmeet.auth.exception.AuthException;
import kr.flowmeet.auth.exception.JwtAuthenticationException;
import kr.flowmeet.auth.security.UserAuthentication;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (response.isCommitted()) {
            return;
        }

        try {
            String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);

            if (authorizationHeader != null && authorizationHeader.startsWith(BEARER)) {
                String accessToken = extractAccessToken(request);
                jwtProvider.validToken(accessToken);

                Long userId = jwtProvider.extractUserIdFromToken(accessToken)
                        .orElseThrow(() -> new AuthException(AuthErrorCode.INVALID_ACCESS_TOKEN));

                SecurityContextHolder.getContext().setAuthentication(UserAuthentication.create(userId));
            }
        } catch (AuthException e) {
            throw new JwtAuthenticationException(e);
        }

        filterChain.doFilter(request, response);
    }

    private String extractAccessToken(final HttpServletRequest request) {
        return request.getHeader(AUTHORIZATION_HEADER).substring(BEARER.length());
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String[] excludes = {
                "/v1/auth/login",
                "/v1/auth/signup",
                "/v1/auth/refresh",
                "/swagger-ui/",
                "/v3/api-docs",
                "/api-docs/"
        };
        String path = request.getRequestURI();

        return Arrays.stream(excludes).anyMatch(path::startsWith);
    }
}
