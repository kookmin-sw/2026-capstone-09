# FlowMeet Backend 코드 컨벤션

## 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 클래스명 | PascalCase | `User`, `MockController`, `AuthErrorCode` |
| 메서드/변수 | camelCase | `createMock`, `findById`, `userId` |
| 상수 | SCREAMING_SNAKE_CASE | `ALLOWED_METHODS`, `SUCCESS_CODE`, `BEARER` |
| enum 값 | SCREAMING_SNAKE_CASE | `SCHEDULED`, `IN_PROGRESS`, `DONE` |
| DB 테이블명 | snake_case, 복수형 | `users`, `meetings`, `projects` |
| DB 컬럼명 | snake_case | `user_id`, `created_at`, `profile_image_url` |
| PK 컬럼명 | `{테이블단수}_id` | `user_id`, `project_id`, `node_id` |
| boolean 필드 | `is` 접두사 | `isDeleted`, `isRead`, `isPushEnabled` |

## 클래스 어노테이션 순서

### 엔티티

```java
@Entity
@Table(name = "테이블명")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Domain extends BaseTimeEntity { ... }
```

### 컨트롤러

```java
@RestController
@RequestMapping("/v1/{도메인}")
@RequiredArgsConstructor
public class DomainController { ... }
```

### 서비스 / Facade

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DomainFacade { ... }
```

## import 규칙

- 와일드카드(`*`) 미사용, 명시적 import만 사용
- 순서: Jakarta/Java → 외부 라이브러리(org.springframework, io.*) → 프로젝트(kr.flowmeet.*)
- 그룹 내 알파벳순 정렬

## Lombok 사용 패턴

- `@Getter`: 모든 엔티티, DTO에 사용
- `@Setter`: **사용하지 않음** (불변 객체 패턴)
- `@NoArgsConstructor(access = AccessLevel.PROTECTED)`: 모든 엔티티
- `@RequiredArgsConstructor`: Service, Controller, Config 등 의존성 주입 클래스
- `@Builder`: 엔티티 생성자에 선언 (클래스 레벨 아님)
- `@Slf4j`: 로깅이 필요한 클래스 (GlobalExceptionHandler, JwtProvider)

## 엔티티

- `BaseTimeEntity` 상속 (createdAt, updatedAt, deletedAt + soft delete)
- `BaseCreatedTimeEntity` — createdAt만 필요한 엔티티용
- PK 전략: `GenerationType.IDENTITY`
- 필드 접근 제한자: `private` (Lombok @Getter로 읽기 제공)
- 연관관계: `@ManyToOne(fetch = FetchType.LAZY)` 고정
- FK 이중 매핑 패턴 — Long ID 컬럼 + JPA 관계 객체 분리:

```java
@Column(name = "node_id", nullable = false)
private Long nodeId;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "node_id", insertable = false, updatable = false)
private Node node;
```

- Cascade 미사용 (관계는 읽기 전용, 별도 저장)
- 대용량 텍스트: `@Column(columnDefinition = "TEXT")`

## DTO (record)

- 모든 DTO는 `record`로 선언
- `dto` 패키지 하위에 `request` / `response` 패키지를 둔다
- DTO 이름 접미사는 요청/응답에 맞게 `Request` / `Response`를 붙인다
- 정적 팩토리 메서드: `of()` (컬렉션/복합 변환), `from()` (단일 변환)
- 중첩 record 지원:

```java
public record GetAllMocksResponse(List<MockItem> mocks) {

    public static GetAllMocksResponse of(final List<String> mocks) {
        return new GetAllMocksResponse(mocks.stream().map(MockItem::from).toList());
    }

    public record MockItem(String name) {
        public static MockItem from(final String name) {
            return new MockItem(name);
        }
    }
}
```

## API 응답

- 공통 응답 래퍼: `CommonResponse<T>` (record)
  - 성공(데이터 없음): `CommonResponse.ok()`
  - 성공(데이터 있음): `CommonResponse.ok(data)`
  - 실패: `CommonResponse.error(errorCode)`
- API 경로: `/v1/{도메인}`

## Controller

- 반환 타입: `CommonResponse<T>` 또는 `CommonResponse<?>`
- 인증된 사용자 ID: `@UserId Long userId` 커스텀 어노테이션
- 메서드 매핑: `@GetMapping`, `@PostMapping` 등 (클래스에 `@RequestMapping`)

## Facade 패턴

Controller → Facade → Service 호출 구조:

- Facade에 `@Transactional(readOnly = true)` 클래스 레벨 기본
- 쓰기 메서드에 `@Transactional` 오버라이드
- Facade에서 여러 도메인 Service를 조합
- 메서드 파라미터에 `final` 키워드 사용

## Service 입력 파라미터

Presentation 레이어와 Business 레이어의 의존성을 격리하기 위해 Service 메서드 입력은 다음 규칙을 따른다. Create, Update 등 모든 쓰기 작업에 동일하게 적용한다.

- **클라이언트가 요청 Body로 보낸 값**은 `{Action}{Domain}Command` 형태의 VO(record)로 묶어 전달한다.
- **경로 변수와 인증 컨텍스트에서 주입된 값**(인증된 `userId`, URL의 `projectId`·`edgeId` 등)은 Command에 포함하지 않고 별도 파라미터로 전달한다.

```java
public Edge create(final Long projectId, final Long createdById, final CreateEdgeCommand command) { ... }

public record CreateEdgeCommand(
        Long startNodeId,
        Long endNodeId,
        String comment
) {}
```

이유:
- Command만 보면 **클라이언트가 조작 가능한 값**이 한눈에 드러나 권한/보안 검토에 유리하다.
- 인증된 `userId` 같은 컨텍스트 값이 Command 안에 있으면 "클라이언트가 전달한 값"처럼 보여 혼동을 일으킨다.

필드 수에 따른 적용 기준:
- **Request Body 필드가 1개**인 경우: Command를 만들지 않고 원시 값 그대로 Service에 전달한다.
- **Request Body 필드가 2개 이상**인 경우: Command로 묶어 전달한다.
- 단, 필드가 1개여도 값 자체에 검증/정규화 규칙이 있거나 다른 같은 타입 값과 혼동될 위험이 크면(예: `Email`, `ProjectId` vs `UserId`) VO로 감싸는 것을 고려한다.

Command 위치:
- 패키지: `kr.flowmeet.domain.{도메인}.service.vo`
- 변환 책임: Facade에서 `Request` → `Command`로 변환해 Service에 넘긴다.

## Validation (유효성 검증)

- Request DTO 필드에 Jakarta Validation 어노테이션 사용 (`@NotBlank`, `@NotNull`, `@Size` 등)
- 검증 메시지는 한글로 작성: `@NotBlank(message = "이름은 필수로 입력해 주세요.")`
- Controller 메서드 파라미터에 `@Valid` 선언하여 검증 활성화:

```java
@PostMapping
public CommonResponse<?> createMock(@UserId Long userId, @Valid @RequestBody CreateMockRequest request) { ... }
```

- 검증 실패 시 `MethodArgumentNotValidException` → `GlobalExceptionHandler`에서 400 응답 처리
- 에러 메시지는 첫 번째 `FieldError`의 message를 반환

## 예외 처리

- `ErrorCode` 인터페이스 (getHttpStatus, getMessage, name)
- 도메인별 enum 구현: `UserErrorCode`, `AuthErrorCode`

```java
@Getter
@RequiredArgsConstructor
public enum UserErrorCode implements ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
```

- 예외 클래스 계층: `CustomException` → `AuthException`, `BusinessException`
- `GlobalExceptionHandler`에서 전역 처리

## Swagger 에러 문서화

- 커스텀 어노테이션: `@ApiErrorCode(code = ErrorCode.class, names = "ERROR_NAME")`
- `ApiErrorCodeOperationCustomizer`가 자동으로 OpenAPI 응답 스키마 생성

## 설정 바인딩

- `@ConfigurationProperties` + record 패턴 (`@Value` 미사용):

```java
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(String secretKey, String issuer, long accessTokenExpiry) {}
```

## 의존성 주입

- `@RequiredArgsConstructor` + `private final` 필드 (생성자 주입)

## 인증 / 보안

- JWT 기반 인증 (Bearer 토큰)
- `JwtAuthenticationFilter` → `UsernamePasswordAuthenticationFilter` 앞에 등록
- `UserAuthentication`(커스텀) → SecurityContext에 저장
- `@UserId` + `UserIdArgumentResolver`로 컨트롤러에서 사용자 ID 추출
- `SecurityWhiteList`에서 공개/Swagger 경로 상수 관리

## 코드 포맷팅

- 들여쓰기: 4스페이스
- 중괄호: 같은 줄에 열기 (Java 표준)
- 메서드 사이: 빈 줄 1개
- 줄 길이: 80~120자, 초과 시 파라미터 줄바꿈

## 커밋 메시지

- `{type}: {한글 설명}` 형식
- type: feat, fix, refactor, chore, docs 등
