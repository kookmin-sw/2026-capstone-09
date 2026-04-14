package kr.flowmeet.domain.notification.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.notification.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n " +
            "WHERE n.userId = :userId " +
            "AND (:isRead IS NULL OR n.isRead = :isRead) " +
            "ORDER BY n.id DESC")
    Page<Notification> findAllByUserId(@Param("userId") Long userId,
                                       @Param("isRead") Boolean isRead,
                                       Pageable pageable);

    long countByUserIdAndIsRead(Long userId, boolean isRead);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    int markAllAsRead(@Param("userId") Long userId);
}