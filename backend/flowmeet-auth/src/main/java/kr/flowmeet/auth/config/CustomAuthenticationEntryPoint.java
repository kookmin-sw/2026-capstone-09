package kr.flowmeet.auth.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import kr.flowmeet.auth.exception.AuthErrorCode;
import kr.flowmeet.auth.exception.JwtAuthenticationException;
import kr.flowmeet.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(
            final HttpServletRequest request,
            final HttpServletResponse response,
            final AuthenticationException authException
    ) throws IOException {

        ErrorCode errorCode = (authException instanceof JwtAuthenticationException jae)
                ? jae.getErrorCode()
                : AuthErrorCode.INVALID_ACCESS_TOKEN;

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", errorCode.getHttpStatus().value());
        body.put("code", errorCode.name());
        body.put("message", errorCode.getMessage());
        body.put("data", null);

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), body);
    }
}
