package kr.flowmeet.api.user.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.file.ImageUploader;
import kr.flowmeet.api.user.dto.response.GetUserResponse;
import kr.flowmeet.api.user.dto.request.UpdateUserRequest;
import kr.flowmeet.api.user.dto.response.UpdateUserResponse;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserFacade {

    private final UserService userService;
    private final ProjectMemberService projectMemberService;
    private final ImageUploader imageUploader;

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
    public void updateProfileImage(final Long userId, final MultipartFile file) {
        User user = userService.findById(userId);
        String imageUrl = imageUploader.upload(file, "profiles", FileDomainType.USER_PROFILE, userId);
        user.updateProfileImageUrl(imageUrl);
    }

    @Transactional
    public void deleteMe(final Long userId) {
        projectMemberService.validateUserIsNotProjectOwner(userId);

        User user = userService.findById(userId);

        projectMemberService.findAllByUserId(user.getId())
                .forEach(projectMemberService::delete);

        userService.delete(user);
    }
}
