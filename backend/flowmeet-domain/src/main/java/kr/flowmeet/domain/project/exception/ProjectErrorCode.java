package kr.flowmeet.domain.project.exception;

import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum ProjectErrorCode implements ErrorCode {
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 프로젝트입니다."),
    PROJECT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "프로젝트의 권한이 없습니다."),
    PROJECT_OWNER_CANNOT_LEAVE(HttpStatus.BAD_REQUEST, "OWNER는 프로젝트를 나갈 수 없습니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 멤버입니다."),
    MEMBER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 프로젝트에 소속된 멤버입니다."),
    MEMBER_CANNOT_CHANGE_OWNER(HttpStatus.BAD_REQUEST, "OWNER 권한은 변경할 수 없습니다."),
    MEMBER_CANNOT_DELETE_OWNER(HttpStatus.BAD_REQUEST, "OWNER는 삭제할 수 없습니다."),
    INVITATION_TOKEN_INVALID(HttpStatus.BAD_REQUEST, "유효하지 않은 초대 링크입니다."),
    INVITATION_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "만료된 초대 링크입니다."),
    INVITATION_EMAIL_MISMATCH(HttpStatus.FORBIDDEN, "초대받은 이메일과 로그인 계정이 일치하지 않습니다."),
    PROJECT_URL_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 URL입니다.");

    private final HttpStatus httpStatus;
    private final String message;
}