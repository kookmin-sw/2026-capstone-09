package kr.flowmeet.api.user.controller;

import jakarta.validation.Valid;
import kr.flowmeet.api.user.facade.UserFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.user.dto.request.SendEmailVerificationRequest;
import kr.flowmeet.api.user.dto.request.UpdateUserRequest;
import kr.flowmeet.api.user.dto.request.VerifyEmailRequest;
import kr.flowmeet.api.user.dto.response.GetUserResponse;
import kr.flowmeet.api.user.dto.response.UpdateUserResponse;
import kr.flowmeet.api.user.success.UserSuccessCode;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController implements UserApi {

    private final UserFacade userFacade;

    @Override
    @GetMapping("/me")
    public CommonResponse<GetUserResponse> getMe(@UserId Long userId) {
        return CommonResponse.ok(UserSuccessCode.GET_ME, userFacade.getMe(userId));
    }

    @Override
    @PatchMapping("/me")
    public CommonResponse<UpdateUserResponse> updateMe(@UserId Long userId, @Valid @RequestBody UpdateUserRequest request) {
        return CommonResponse.ok(UserSuccessCode.UPDATE_ME, userFacade.updateMe(userId, request));
    }

    @Override
    @PatchMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResponse<?> updateProfileImage(
            @UserId Long userId,
            @RequestPart MultipartFile profileImage
    ) {
        userFacade.updateProfileImage(userId, profileImage);
        return CommonResponse.ok(UserSuccessCode.UPDATE_PROFILE_IMAGE);
    }

    @Override
    @DeleteMapping("/me")
    public CommonResponse<?> deleteMe(@UserId Long userId) {
        userFacade.deleteMe(userId);
        return CommonResponse.ok(UserSuccessCode.DELETE_ME);
    }

    @Override
    @PostMapping("/me/email-verifications")
    public CommonResponse<?> sendEmailVerification(
            @UserId Long userId,
            @Valid @RequestBody SendEmailVerificationRequest request
    ) {
        userFacade.sendEmailVerification(userId, request);
        return CommonResponse.ok(UserSuccessCode.SEND_EMAIL_VERIFICATION);
    }

    @Override
    @PostMapping("/me/email-verifications/verify")
    public CommonResponse<?> verifyEmail(
            @UserId Long userId,
            @Valid @RequestBody VerifyEmailRequest request
    ) {
        userFacade.verifyEmail(userId, request);
        return CommonResponse.ok(UserSuccessCode.VERIFY_EMAIL);
    }
}
