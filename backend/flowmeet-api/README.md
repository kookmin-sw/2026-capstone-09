# flowmeet-api

API 진입점 모듈. Spring Boot 애플리케이션 실행, REST 컨트롤러, Facade, DTO, Swagger 설정, 전역 예외 처리를 담당한다.

## 의존 모듈

- flowmeet-auth
- flowmeet-domain
- flowmeet-common
- flowmeet-external

## 주요 의존성

- Spring Boot Web, Validation
- Springdoc OpenAPI (Swagger UI)
- Spring Boot Mail, Thymeleaf (추후 활용 예정)
- H2 Console (개발용)

## 패키지 구조

```
kr.flowmeet.api/
├── FlowmeetApiApplication.java        # @SpringBootApplication 진입점
├── common/
│   ├── dto/
│   │   └── CommonResponse.java         # 공통 API 응답 래퍼 (record)
│   ├── exception/
│   │   └── GlobalExceptionHandler.java # 전역 예외 → CommonResponse 변환
│   └── swagger/
│       ├── ApiErrorCode.java           # 에러 코드 문서화 어노테이션 (반복 가능)
│       ├── ApiErrorCodeGroup.java      # @ApiErrorCode 컨테이너 어노테이션
│       ├── ApiErrorCodes.java          # ErrorCode enum 배열 지정 어노테이션
│       ├── ApiErrorCodeOperationCustomizer.java  # OpenAPI 에러 응답 스키마 자동 생성
│       └── SwaggerConfig.java          # Swagger 설정
└── {도메인}/
    ├── {Domain}Controller.java         # REST 컨트롤러
    ├── {Domain}Facade.java             # 유스케이스 조합 서비스
    └── dto/
        ├── {Action}{Domain}Request.java
        └── {Get/GetAll}{Domain}Response.java
```

## 설정 파일

| 파일 | 설명 |
|------|------|
| `application.yaml` | 공통 설정 (포트, 로깅, config import) |
| `application-local.yaml` | 로컬 환경 (H2, Flyway 비활성) |
| `application-dev.yaml` | 개발 환경 (PostgreSQL) |
| `application-prod.yaml` | 운영 환경 (PostgreSQL) |
| `config/auth.yaml` | JWT, OAuth2, CORS 설정 |
| `config/domain.yaml` | JPA, Flyway 설정 |
| `config/external.yaml` | 메일 SMTP 설정 |

## 실행

```bash
# 로컬 (H2)
./gradlew :flowmeet-api:bootRun --args='--spring.profiles.active=local'

# 개발
./gradlew :flowmeet-api:bootRun --args='--spring.profiles.active=dev'
```
