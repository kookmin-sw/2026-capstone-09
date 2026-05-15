package kr.flowmeet.domain.notification.repository;

import java.util.List;
import kr.flowmeet.domain.notification.entity.Notification;

public interface NotificationRepositoryCustom {

    List<Notification> findAllByUserId(Long userId, Boolean isRead, Long cursorId, int size);
}
