package kr.flowmeet.domain.meeting.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.entity.MeetingStatus;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    Optional<Meeting> findByNodeId(Long nodeId);

    List<Meeting> findAllByNodeIdIn(List<Long> nodeIds);

    boolean existsByNodeId(Long nodeId);

    boolean existsByNodeIdAndStatus(Long nodeId, MeetingStatus status);

    @Query("SELECT m FROM Meeting m JOIN FETCH m.node WHERE m.isPushEnabled = true AND m.reminderSent = false AND m.pushNotifyAt BETWEEN :from AND :now AND m.status = :status")
    List<Meeting> findPendingReminders(@Param("from") LocalDateTime from, @Param("now") LocalDateTime now, @Param("status") MeetingStatus status);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Meeting m SET m.reminderSent = true WHERE m.id IN :meetingIds")
    int markRemindersSent(@Param("meetingIds") List<Long> meetingIds);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Meeting m SET m.deletedAt = CURRENT_TIMESTAMP WHERE m.id IN :meetingIds")
    int softDeleteAllByIdIn(@Param("meetingIds") List<Long> meetingIds);
}
