# flowmeet-common

공통 모듈. 전체 모듈에서 공유하는 예외 처리 기반 클래스를 제공한다.

## 의존 모듈

- flowmeet-global-utils

## 패키지 구조

```
kr.flowmeet.common/
└── exception/
    ├── ErrorCode.java        # 에러 코드 인터페이스 (getHttpStatus, getMessage, name)
    └── CustomException.java  # 기본 커스텀 예외 (RuntimeException 상속)
```

## 예외 구조

```
ErrorCode (interface)
├── getHttpStatus() → HttpStatus
├── getMessage() → String
└── name() → String

CustomException (extends RuntimeException)
└── errorCode: ErrorCode
```

## 사용 방법

### 1. 도메인별 ErrorCode enum 정의

```java
@Getter
@RequiredArgsConstructor
public enum UserErrorCode implements ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
```

### 2. 도메인별 Exception 클래스 생성 (선택)

```java
public class BusinessException extends CustomException {
    public BusinessException(ErrorCode errorCode) {
        super(errorCode);
    }
}
```

### 3. 예외 throw

```java
throw new BusinessException(UserErrorCode.USER_NOT_FOUND);
```

`GlobalExceptionHandler`(flowmeet-api)에서 `CustomException`을 잡아 `CommonResponse.error(errorCode)`로 변환한다.
