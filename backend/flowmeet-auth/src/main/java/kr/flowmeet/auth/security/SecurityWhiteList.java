package kr.flowmeet.auth.security;

public class SecurityWhiteList {
    public static final String[] PUBLIC_WHITE_LIST = {
            "/v1/auth/login/**",
            "/v1/auth/signup",
            "/v1/auth/refresh",
            "/test/**",
            "/actuator/health",
            "/actuator/health/**"
    };
    public static final String[] SWAGGER_WHITE_LIST = { "/swagger-ui/**", "/swagger-resources/**", "/v3/api-docs/**" };
}
