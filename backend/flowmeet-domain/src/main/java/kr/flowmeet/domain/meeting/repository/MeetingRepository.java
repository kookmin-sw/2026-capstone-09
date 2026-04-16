package kr.flowmeet.domain.meeting.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.meeting.entity.Meeting;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    Optional<Meeting> findByNodeId(Long nodeId);

    List<Meeting> findAllByNodeIdIn(List<Long> nodeIds);

    boolean existsByNodeId(Long nodeId);

    boolean existsByNodeIdAndStatus(Long nodeId, kr.flowmeet.domain.meeting.entity.MeetingStatus status);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Meeting m SET m.deletedAt = CURRENT_TIMESTAMP WHERE m.id IN :meetingIds")
    int softDeleteAllByIdIn(@Param("meetingIds") List<Long> meetingIds);
}
