package kr.flowmeet.api.user;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.user.dto.GetUserResponse;
import kr.flowmeet.api.user.dto.UpdateProfileImageResponse;
import kr.flowmeet.api.user.dto.UpdateUserRequest;
import kr.flowmeet.api.user.dto.UpdateUserResponse;
import kr.flowmeet.domain.exception.BusinessException;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.exception.UserErrorCode;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserFacade {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of("image/png", "image/jpeg", "image/webp");

    private final UserService userService;
    private final ProjectMemberService projectMemberService;

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

        if (request.secondaryEmail() != null) {
            user.updateSecondEmail(request.secondaryEmail());
        }

        return UpdateUserResponse.from(user);
    }

    @Transactional
    public UpdateProfileImageResponse updateProfileImage(final Long userId, final MultipartFile file) {
        validateImageFile(file);

        User user = userService.findById(userId);

        // TODO: 외부 스토리지에 파일 업로드 후 URL 반환
        String imageUrl = "https://cdn.flowmeet.com/profiles/" + user.getId() + ".png";
        user.updateProfileImageUrl(imageUrl);

        return UpdateProfileImageResponse.from(imageUrl);
    }

    @Transactional
    public void deleteMe(final Long userId) {
        if (projectMemberService.existsOwnerProject(userId)) {
            throw new BusinessException(UserErrorCode.USER_IS_PROJECT_OWNER);
        }

        User user = userService.findById(userId);
        userService.delete(user);

        projectMemberService.findAllByUserId(user.getId())
                .forEach(projectMemberService::delete);
    }

    private void validateImageFile(final MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException(UserErrorCode.FILE_SIZE_EXCEEDED);
        }

        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
            throw new BusinessException(UserErrorCode.FILE_INVALID_TYPE);
        }
    }
}
