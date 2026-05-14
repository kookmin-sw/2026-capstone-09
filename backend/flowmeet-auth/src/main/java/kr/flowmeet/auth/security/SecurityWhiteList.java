package kr.flowmeet.auth.security;

public class SecurityWhiteList {
    public static final String[] PUBLIC_WHITE_LIST = {
            "/v1/auth/login/**",
            "/v1/auth/signup",
            "/v1/auth/refresh",
            "/v1/auth/signup/email-verifications",
            "/v1/auth/signup/email-verifications/verify",
            "/test/**",
            "/actuator/health",
            "/actuator/health/**"
    };
    public static final String[] SWAGGER_WHITE_LIST = { "/swagger-ui/**", "/swagger-resources/**", "/v3/api-docs/**" };
}
