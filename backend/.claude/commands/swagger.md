변경된 코드에서 Controller와 DTO를 찾아 Swagger 문서화를 적용합니다.

$ARGUMENTS 가 있으면 해당 파일/도메인을 대상으로, 없으면 `git diff HEAD` 기준 변경된 파일을 대상으로 처리합니다.

---

## Controller → Api 인터페이스 분리

변경된 파일 중 `*Controller.java`가 있으면:

1. 같은 패키지에 `{Domain}Api.java` 인터페이스를 생성한다.
2. Controller 클래스에 `implements {Domain}Api`를 추가한다.
3. Controller의 각 메서드에 `@Override`를 추가하고, HTTP 매핑 어노테이션(`@GetMapping` 등)만 남긴다.

### Api 인터페이스 규칙

```java
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "도메인명(영문)", description = "도메인 한글 설명")
public interface DomainApi {

    @Operation(summary = "짧은 동작 설명", description = "상세 설명. 조건·부작용·제약이 있으면 기재.")
    @ApiSuccessCode(code = DomainSuccessCode.class, name = "SUCCESS_CODE_NAME")
    @ApiErrorCode(code = DomainErrorCode.class, names = {"ERROR_CODE_NAME"})
    CommonResponse<ReturnType> methodName(파라미터...);
}
```

- `@ApiSuccessCode` / `@ApiErrorCode`: 해당 엔드포인트에서 실제로 발생 가능한 코드만 포함
- 파라미터 어노테이션(`@PathVariable`, `@RequestBody`, `@Valid`, `@UserId` 등)은 인터페이스에도 그대로 선언
- 반환 타입, 파라미터 타입은 Controller와 완전히 동일하게 유지

---

## DTO → @Schema 추가

변경된 파일 중 `dto/` 하위 `*.java` record가 있으면:

1. record 선언 위에 `@Schema(description = "이 DTO의 역할 설명")` 추가
2. 각 필드 위에 `@Schema(description = "필드 의미", example = "현실적인 예시값")` 추가

### @Schema 규칙

```java
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "노드 제목 수정 요청")
public record UpdateNodeTitleRequest(
        @Schema(description = "변경할 노드 제목", example = "기획 문서 작성")
        @NotBlank(message = "제목은 필수로 입력해 주세요.")
        String title
) {}
```

- `example`은 실제 서비스에서 쓸 법한 한글/영문 값으로 작성 (ID는 숫자, 날짜는 ISO 형식 등)
- 컬렉션 필드의 example: `"[1, 2, 3]"`
- boolean 필드의 example: `"true"` 또는 `"false"`
- 중첩 record도 동일하게 적용
- 기존 `@NotBlank` 등 Validation 어노테이션은 유지하고 `@Schema`는 그 위에 추가

---

## import 순서 (기존 컨벤션 유지)

Jakarta/Java → 외부 라이브러리(io.swagger, org.springframework) → 프로젝트(kr.flowmeet.*)