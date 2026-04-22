package kr.flowmeet.domain.notification.repository;

import java.util.List;
import kr.flowmeet.domain.notification.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.notification.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long>, NotificationRepositoryCustom {

    long countByUserIdAndIsRead(Long userId, boolean isRead);

    boolean existsByNodeIdAndType(Long nodeId, NotificationType type);

    @Query("SELECT n.nodeId FROM Notification n WHERE n.nodeId IN :nodeIds AND n.type = :type")
    List<Long> findNodeIdsByNodeIdInAndType(@Param("nodeIds") List<Long> nodeIds, @Param("type") NotificationType type);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    int markAllAsRead(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Notification n WHERE n.projectId = :projectId")
    int deleteAllByProjectId(@Param("projectId") Long projectId);
}
