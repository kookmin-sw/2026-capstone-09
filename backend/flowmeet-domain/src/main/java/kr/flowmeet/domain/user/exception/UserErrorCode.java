package kr.flowmeet.domain.user.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum UserErrorCode implements ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없어요."),
    USER_NICKNAME_DUPLICATED(HttpStatus.CONFLICT, "이미 사용 중인 닉네임이에요."),
    USER_IS_PROJECT_OWNER(HttpStatus.BAD_REQUEST, "소유 중인 프로젝트가 있어서 탈퇴할 수 없어요. 프로젝트 소유권을 넘기거나 프로젝트를 삭제한 후 다시 시도해 주세요.");

    private final HttpStatus httpStatus;
    private final String message;
}
