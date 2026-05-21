# FlowMeet Backend

## 프로젝트 개요
FlowMeet은 프로젝트 관리 및 회의 지원 서비스의 백엔드 서버다.

- **언어/프레임워크**: Java 21, Spring Boot 4.0.4
- **빌드 도구**: Gradle (Groovy DSL)
- **데이터베이스**: PostgreSQL (운영), H2 (로컬)
- **마이그레이션**: Flyway
- **인증**: Spring Security + OAuth2 + JWT (jjwt)
- **API 문서**: Springdoc OpenAPI (Swagger)

## 멀티모듈 구조

```
flowmeet-server/
├── flowmeet-api          # API 진입점 (Controller, Facade, DTO, Swagger, 예외 핸들링)
├── flowmeet-auth         # 인증/인가 (Security, JWT, OAuth2, CORS)
├── flowmeet-domain       # 도메인 (Entity, Repository, Service)
├── flowmeet-common       # 공통 (ErrorCode, CustomException)
├── flowmeet-external     # 외부 연동
└── flowmeet-global-utils # 유틸리티
```

### 모듈 의존성
- `flowmeet-api` → auth, domain, common, external
- `flowmeet-auth` → common, domain
- `flowmeet-domain` → common
- `flowmeet-external` → common
- `flowmeet-common` → global-utils

## 패키지 컨벤션

기본 패키지: `kr.flowmeet`

### flowmeet-api
```
kr.flowmeet.api.{도메인}/
  ├── {Domain}Controller.java   # @RestController, API 엔드포인트
  ├── {Domain}Facade.java       # @Service, 유스케이스 조합 (트랜잭션 관리)
  └── dto/
      ├── {Action}{Domain}Request.java   # 요청 DTO (record)
      └── {Get/GetAll}{Domain}Response.java  # 응답 DTO (record)
```

### flowmeet-domain
```
kr.flowmeet.domain.{도메인}/
  ├── entity/
  │   └── {Domain}.java         # @Entity, JPA 엔티티
  ├── repository/
  │   └── {Domain}Repository.java
  ├── service/
  │   └── {Domain}Service.java  # @Service, 도메인 비즈니스 로직
  └── exception/
      └── {Domain}ErrorCode.java  # enum implements ErrorCode
```

## 코드 컨벤션

상세 컨벤션은 [docs/convention.md](../docs/convention.md) 참조.

핵심 요약:
- Controller → Facade → Service 호출 구조
- 모든 엔티티는 `BaseTimeEntity` 상속, `@Setter` 미사용, `@Builder`는 생성자에 선언
- DTO는 `record`로 선언, 정적 팩토리 메서드 `of()`/`from()` 사용
- 공통 응답: `CommonResponse.ok(data)` / `CommonResponse.error(errorCode)`
- 예외: `ErrorCode` 인터페이스 → 도메인별 enum → `CustomException` throw
- 의존성 주입: `@RequiredArgsConstructor` + `private final`
- 연관관계: `FetchType.LAZY` 고정, FK 이중 매핑 패턴, Cascade 미사용

## 빌드 & 실행

```bash
# 빌드
./gradlew clean build

# 로컬 실행 (H2, Flyway 비활성)
./gradlew :flowmeet-api:bootRun --args='--spring.profiles.active=local'

# 테스트
./gradlew test
```

## 설정 파일 구조
- `application.yaml` — 공통 설정, 모듈별 config import
- `application-{profile}.yaml` — 환경별 설정 (local, dev, prod)
- `config/domain.yaml` — domain 모듈 설정
- `config/auth.yaml` — auth 모듈 설정
- `config/external.yaml` — external 모듈 설정

## 커밋 메시지
- `{type}: {한글 설명}` 형식
- type: feat, fix, refactor, chore, docs 등

## 주의사항
- `application-local.yaml`은 `.gitignore`에 포함되어 커밋하지 않는다
- `docs/` 디렉토리도 `.gitignore`에 포함
