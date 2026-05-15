# flowmeet-auth

인증/인가 모듈. Spring Security, JWT 토큰 발급/검증, OAuth2 소셜 로그인, CORS 설정을 담당한다.

## 의존 모듈

- flowmeet-common
- flowmeet-domain

## 주요 의존성

- Spring Security + OAuth2 Client
- jjwt 0.12.6 (JWT 토큰)

## 패키지 구조

```
kr.flowmeet.auth/
├── annotation/
│   └── UserId.java                  # 컨트롤러 파라미터에서 인증된 사용자 ID 추출
├── config/
│   ├── SecurityConfig.java          # SecurityFilterChain, CORS 설정
│   └── WebMvcConfig.java            # UserIdArgumentResolver 등록
├── exception/
│   ├── AuthErrorCode.java           # 인증 에러 코드 enum
│   └── AuthException.java           # 인증 예외 (CustomException 상속)
├── jwt/
│   ├── JwtAuthenticationFilter.java # Authorization 헤더에서 JWT 추출 및 인증 처리
│   └── JwtProvider.java             # JWT 생성, 검증, 클레임 추출 (HS256)
├── properties/
│   ├── CorsProperties.java          # CORS allowed-origins 설정 바인딩 (record)
│   └── JwtProperties.java           # JWT secret, issuer, expiry 설정 바인딩 (record)
├── resolver/
│   └── UserIdArgumentResolver.java  # @UserId → SecurityContext에서 사용자 ID resolve
└── security/
    ├── SecurityWhiteList.java       # 인증 제외 경로 상수 (공개 API, Swagger)
    └── UserAuthentication.java      # 커스텀 Authentication 토큰 (userId + ROLE_USER)
```

## 인증 흐름

1. 클라이언트가 `Authorization: Bearer {token}` 헤더로 요청
2. `JwtAuthenticationFilter`가 토큰 추출
3. `JwtProvider`가 토큰 검증 및 userId 클레임 추출
4. `UserAuthentication` 생성 → `SecurityContext`에 저장
5. 컨트롤러에서 `@UserId Long userId`로 사용자 ID 접근

## 에러 코드

| 코드 | HTTP 상태 | 메시지 |
|------|-----------|--------|
| `INVALID_ACCESS_TOKEN` | 401 | 유효하지 않은 AccessToken입니다. |
| `EXPIRED_ACCESS_TOKEN` | 401 | 로그인 유효기간이 만료되었습니다. |
