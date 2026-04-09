package kr.flowmeet.api.user.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.user.dto.response.GetUserResponse;
import kr.flowmeet.api.user.dto.response.UpdateProfileImageResponse;
import kr.flowmeet.api.user.dto.request.UpdateUserRequest;
import kr.flowmeet.api.user.dto.response.UpdateUserResponse;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.exception.UserErrorCode;
import kr.flowmeet.domain.user.service.UserService;
import kr.flowmeet.external.file.FileStorageService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserFacade {

    private final UserService userService;
    private final ProjectMemberService projectMemberService;
    private final FileStorageService fileStorageService;

    public GetUserResponse getMe(final Long userId) {
        User user = userService.findById(userId);
        return GetUserResponse.from(user);
    }

    @Transactional
    public UpdateUserResponse updateMe(final Long userId, final UpdateUserRequest request) {
        User user = userService.findById(userId);

        if (request.nickname() != null) {
            userService.validateNicknameNotDuplicated(request.nickname(), user.getNickname());
            user.updateNickname(request.nickname());
        }

        if (request.email() != null) {
            user.updateEmail(request.email());
        }

        return UpdateUserResponse.from(user);
    }

    @Transactional
    public UpdateProfileImageResponse updateProfileImage(final Long userId, final MultipartFile file) {
        User user = userService.findById(userId);

        String imageUrl = fileStorageService.uploadProfileImage(user.getId(), file);
        user.updateProfileImageUrl(imageUrl);

        return UpdateProfileImageResponse.from(imageUrl);
    }

    @Transactional
    public void deleteMe(final Long userId) {
        if (projectMemberService.existsOwnerProject(userId)) {
            throw new ApiException(UserErrorCode.USER_IS_PROJECT_OWNER);
        }

        User user = userService.findById(userId);
        userService.delete(user);

        projectMemberService.findAllByUserId(user.getId())
                .forEach(projectMemberService::delete);
    }
}
