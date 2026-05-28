package kr.flowmeet.domain.notification.service;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.notification.entity.NotificationSetting;
import kr.flowmeet.domain.notification.exception.NotificationErrorCode;
import kr.flowmeet.domain.notification.repository.NotificationSettingRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationSettingService {

    private final NotificationSettingRepository notificationSettingRepository;

    public NotificationSetting findByUserIdAndProjectId(final Long userId, final Long projectId) {
        return notificationSettingRepository.findByUserIdAndProjectId(userId, projectId)
                .orElseThrow(() -> new BusinessException(NotificationErrorCode.NOTIFICATION_SETTING_NOT_FOUND));
    }

    public Optional<NotificationSetting> findOptionalByUserIdAndProjectId(final Long userId, final Long projectId) {
        return notificationSettingRepository.findByUserIdAndProjectId(userId, projectId);
    }

    public List<NotificationSetting> findAllByProjectId(final Long projectId) {
        return notificationSettingRepository.findAllByProjectId(projectId);
    }

    public List<NotificationSetting> findAllByProjectIds(final List<Long> projectIds) {
        return notificationSettingRepository.findAllByProjectIdIn(projectIds);
    }

    @Transactional
    public NotificationSetting create(final Long userId, final Long projectId) {
        return notificationSettingRepository.save(
                NotificationSetting.builder()
                        .userId(userId)
                        .projectId(projectId)
                        .build()
        );
    }

    @Transactional
    public void delete(final NotificationSetting notificationSetting) {
        notificationSettingRepository.delete(notificationSetting);
    }

    @Transactional
    public void deleteAllByProjectId(final Long projectId) {
        notificationSettingRepository.deleteAllByProjectId(projectId);
    }
}