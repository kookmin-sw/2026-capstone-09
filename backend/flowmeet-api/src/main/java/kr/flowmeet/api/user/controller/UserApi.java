package kr.flowmeet.api.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.common.swagger.ApiSuccessCode;
import kr.flowmeet.api.user.dto.request.SendEmailVerificationRequest;
import kr.flowmeet.api.user.dto.request.UpdateUserRequest;
import kr.flowmeet.api.user.dto.request.VerifyEmailRequest;
import kr.flowmeet.api.user.dto.response.GetUserResponse;
import kr.flowmeet.api.user.dto.response.UpdateUserResponse;
import kr.flowmeet.api.user.success.UserSuccessCode;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.emailverification.exception.EmailVerificationErrorCode;
import kr.flowmeet.domain.file.exception.FileErrorCode;
import kr.flowmeet.domain.user.exception.UserErrorCode;

@Tag(name = "User", description = "사용자")
public interface UserApi {

    @Operation(summary = "내 정보 조회")
    @ApiSuccessCode(code = UserSuccessCode.class, name = "GET_ME")
    CommonResponse<GetUserResponse> getMe(@UserId Long userId);

    @Operation(summary = "내 정보 수정", description = "이메일을 변경할 때는 인증 코드 검증이 끝난 이메일만 사용할 수 있습니다.")
    @ApiSuccessCode(code = UserSuccessCode.class, name = "UPDATE_ME")
    @ApiErrorCode(code = UserErrorCode.class, names = {"USER_NICKNAME_DUPLICATED", "USER_EMAIL_DUPLICATED", "USER_EMAIL_SAME_AS_CURRENT"})
    @ApiErrorCode(code = EmailVerificationErrorCode.class, names = {"EMAIL_VERIFICATION_REQUIRED", "EMAIL_VERIFICATION_CODE_EXPIRED"})
    CommonResponse<UpdateUserResponse> updateMe(@UserId Long userId, @Valid @RequestBody UpdateUserRequest request);

    @Operation(summary = "프로필 이미지 변경", description = "png, jpeg, webp만 허용 (최대 5MB)")
    @ApiSuccessCode(code = UserSuccessCode.class, name = "UPDATE_PROFILE_IMAGE")
    @ApiErrorCode(code = FileErrorCode.class, names = {"FILE_SIZE_EXCEEDED", "FILE_INVALID_TYPE"})
    CommonResponse<?> updateProfileImage(@UserId Long userId, MultipartFile profileImage);

    @Operation(summary = "회원 탈퇴", description = "소유 중인 프로젝트가 있으면 탈퇴할 수 없습니다.")
    @ApiSuccessCode(code = UserSuccessCode.class, name = "DELETE_ME")
    @ApiErrorCode(code = UserErrorCode.class, names = {"USER_IS_PROJECT_OWNER"})
    CommonResponse<?> deleteMe(@UserId Long userId);

    @Operation(summary = "이메일 인증 코드 발송", description = "변경할 이메일 주소로 6자리 인증 코드를 발송합니다. 코드 유효시간은 5분입니다.")
    @ApiSuccessCode(code = UserSuccessCode.class, name = "SEND_EMAIL_VERIFICATION")
    @ApiErrorCode(code = UserErrorCode.class, names = {"USER_EMAIL_DUPLICATED", "USER_EMAIL_SAME_AS_CURRENT"})
    CommonResponse<?> sendEmailVerification(@UserId Long userId, @Valid @RequestBody SendEmailVerificationRequest request);

    @Operation(summary = "이메일 인증 코드 검증", description = "발송된 인증 코드로 이메일 소유를 확인합니다.")
    @ApiSuccessCode(code = UserSuccessCode.class, name = "VERIFY_EMAIL")
    @ApiErrorCode(code = EmailVerificationErrorCode.class, names = {"EMAIL_VERIFICATION_NOT_FOUND", "EMAIL_VERIFICATION_CODE_INVALID", "EMAIL_VERIFICATION_CODE_EXPIRED"})
    CommonResponse<?> verifyEmail(@UserId Long userId, @Valid @RequestBody VerifyEmailRequest request);
}
