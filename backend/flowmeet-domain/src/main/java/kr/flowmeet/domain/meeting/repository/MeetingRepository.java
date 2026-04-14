package kr.flowmeet.domain.meeting.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import kr.flowmeet.domain.meeting.entity.Meeting;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    Optional<Meeting> findByNodeId(Long nodeId);

    List<Meeting> findAllByNodeIdIn(List<Long> nodeIds);

    boolean existsByNodeId(Long nodeId);

    boolean existsByNodeIdAndStatus(Long nodeId, kr.flowmeet.domain.meeting.entity.MeetingStatus status);
}
