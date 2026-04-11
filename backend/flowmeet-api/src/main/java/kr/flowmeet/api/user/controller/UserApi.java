package kr.flowmeet.api.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.user.dto.request.UpdateProfileImageRequest;
import kr.flowmeet.api.user.dto.response.GetUserResponse;
import kr.flowmeet.api.user.dto.request.UpdateUserRequest;
import kr.flowmeet.api.user.dto.response.UpdateUserResponse;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.user.exception.UserErrorCode;

@Tag(name = "User")
public interface UserApi {

    @Operation(summary = "내 정보 조회")
    CommonResponse<GetUserResponse> getMe(@UserId Long userId);

    @Operation(summary = "내 정보 수정")
    @ApiErrorCode(code = UserErrorCode.class, names = {"USER_NICKNAME_DUPLICATED"})
    CommonResponse<UpdateUserResponse> updateMe(@UserId Long userId, @Valid @RequestBody UpdateUserRequest request);

    @Operation(summary = "프로필 이미지 변경")
    @ApiErrorCode(code = UserErrorCode.class, names = {"USER_NOT_FOUND"})
    CommonResponse<?> updateProfileImageUrl(@UserId Long userId, @Valid @RequestBody UpdateProfileImageRequest request);

    @Operation(summary = "회원 탈퇴", description = "소유 중인 프로젝트가 있으면 탈퇴할 수 없습니다.")
    @ApiErrorCode(code = UserErrorCode.class, names = {"USER_IS_PROJECT_OWNER"})
    CommonResponse<?> deleteMe(@UserId Long userId);
}
