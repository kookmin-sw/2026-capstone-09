package kr.flowmeet.api.user.facade;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import kr.flowmeet.api.file.facade.ImageUploader;
import kr.flowmeet.api.user.dto.request.SendEmailVerificationRequest;
import kr.flowmeet.api.user.dto.request.UpdateUserRequest;
import kr.flowmeet.api.user.dto.request.VerifyEmailRequest;
import kr.flowmeet.api.user.dto.response.GetUserResponse;
import kr.flowmeet.api.user.dto.response.UpdateUserResponse;
import kr.flowmeet.domain.emailverification.service.EmailVerificationService;
import kr.flowmeet.domain.file.entity.FileDomainType;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserFacade {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
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
            user.updateNickname(request.nickname());
        }

        String newEmail = request.email();

        if (newEmail != null && !newEmail.equals(user.getEmail())) {
            userService.validateEmailChangeable(newEmail, user.getEmail());
            emailVerificationService.consumeVerified(userId, newEmail);
            user.updateEmail(newEmail);
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

    @Transactional
    public void sendEmailVerification(final Long userId, final SendEmailVerificationRequest request) {
        User user = userService.findById(userId);
        userService.validateEmailChangeable(request.email(), user.getEmail());

        emailVerificationService.issueCode(userId, request.email());
    }

    @Transactional
    public void verifyEmail(final Long userId, final VerifyEmailRequest request) {
        emailVerificationService.verify(userId, request.email(), request.code());
    }
}
