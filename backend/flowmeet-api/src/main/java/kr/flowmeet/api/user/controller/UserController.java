package kr.flowmeet.api.user.controller;

import jakarta.validation.Valid;
import kr.flowmeet.api.user.facade.UserFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.user.dto.response.GetUserResponse;
import kr.flowmeet.api.user.dto.response.UpdateProfileImageResponse;
import kr.flowmeet.api.user.dto.request.UpdateUserRequest;
import kr.flowmeet.api.user.dto.response.UpdateUserResponse;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController implements UserApi {

    private final UserFacade userFacade;

    @Override
    @GetMapping("/me")
    public CommonResponse<GetUserResponse> getMe(@UserId Long userId) {
        return CommonResponse.ok(userFacade.getMe(userId));
    }

    @Override
    @PatchMapping("/me")
    public CommonResponse<UpdateUserResponse> updateMe(@UserId Long userId, @Valid @RequestBody UpdateUserRequest request) {
        return CommonResponse.ok(userFacade.updateMe(userId, request));
    }

    @Override
    @PatchMapping("/me/profile-image")
    public CommonResponse<UpdateProfileImageResponse> updateProfileImage(@UserId Long userId,
                                                                        @RequestPart MultipartFile file) {
        return CommonResponse.ok(userFacade.updateProfileImage(userId, file));
    }

    @Override
    @DeleteMapping("/me")
    public CommonResponse<?> deleteMe(@UserId Long userId) {
        userFacade.deleteMe(userId);
        return CommonResponse.ok();
    }
}
