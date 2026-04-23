package kr.flowmeet.domain.project.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum ProjectErrorCode implements ErrorCode {
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 프로젝트예요."),
    PROJECT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "프로젝트에 접근할 권한이 없어요."),
    PROJECT_OWNER_CANNOT_LEAVE(HttpStatus.BAD_REQUEST, "프로젝트의 유일한 OWNER는 나갈 수 없어요. 다른 멤버에게 OWNER 권한을 넘긴 후 나가 주세요."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 멤버예요."),
    MEMBER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 프로젝트에 소속된 멤버예요."),
    MEMBER_CANNOT_CHANGE_OWNER(HttpStatus.BAD_REQUEST, "OWNER 권한은 변경할 수 없어요."),
    MEMBER_CANNOT_DELETE_OWNER(HttpStatus.BAD_REQUEST, "OWNER는 삭제할 수 없어요."),
    INVITATION_TOKEN_INVALID(HttpStatus.BAD_REQUEST, "유효하지 않은 초대 링크예요."),
    INVITATION_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "만료된 초대 링크예요."),
    INVITATION_EMAIL_MISMATCH(HttpStatus.FORBIDDEN, "초대받은 이메일과 로그인 계정이 일치하지 않아요."),
    PROJECT_URL_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 URL이에요.");

    private final HttpStatus httpStatus;
    private final String message;
}