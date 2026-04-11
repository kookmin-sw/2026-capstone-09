package kr.flowmeet.api.user.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.common.exception.ApiException;
import kr.flowmeet.api.user.dto.response.GetUserResponse;
import kr.flowmeet.api.user.dto.request.UpdateUserRequest;
import kr.flowmeet.api.user.dto.response.UpdateUserResponse;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.file.entity.FileInformation;
import kr.flowmeet.domain.file.service.FileInformationService;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.exception.UserErrorCode;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserFacade {

    private final UserService userService;
    private final ProjectMemberService projectMemberService;
    private final FileInformationService fileInformationService;

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
    public void updateProfileImageUrl(final Long userId, final String fileKey) {
        User user = userService.findById(userId);
        FileInformation fileInformation = fileInformationService.findByFileKey(fileKey);
        fileInformation.updateDomain(FileDomainType.USER_PROFILE, userId);
        user.updateProfileImageUrl(fileInformation.getUploadUrl());
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
