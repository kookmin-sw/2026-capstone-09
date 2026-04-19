package kr.flowmeet.auth.security;

public class SecurityWhiteList {
    public static final String[] PUBLIC_WHITE_LIST = { "/auth/", "/test/**", "/actuator/health", "/actuator/health/**" };
    public static final String[] SWAGGER_WHITE_LIST = { "/swagger-ui/**", "/swagger-resources/**", "/v3/api-docs/**" };
}
