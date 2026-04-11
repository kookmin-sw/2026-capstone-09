package kr.flowmeet.domain.notification.service;

import java.util.List;
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

    public List<NotificationSetting> findAllByProjectId(final Long projectId) {
        return notificationSettingRepository.findAllByProjectId(projectId);
    }

    @Transactional
    public NotificationSetting create(final NotificationSetting notificationSetting) {
        return notificationSettingRepository.save(notificationSetting);
    }

    @Transactional
    public void delete(final NotificationSetting notificationSetting) {
        notificationSettingRepository.delete(notificationSetting);
    }
}