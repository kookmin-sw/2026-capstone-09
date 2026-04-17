package kr.flowmeet.domain.notification.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.notification.entity.NotificationSetting;

public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, Long> {

    Optional<NotificationSetting> findByUserIdAndProjectId(Long userId, Long projectId);

    List<NotificationSetting> findAllByProjectId(Long projectId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM NotificationSetting ns WHERE ns.projectId = :projectId")
    int deleteAllByProjectId(@Param("projectId") Long projectId);
}
