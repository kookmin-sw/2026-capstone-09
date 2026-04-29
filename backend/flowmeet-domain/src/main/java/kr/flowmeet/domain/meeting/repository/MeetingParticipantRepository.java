package kr.flowmeet.domain.meeting.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.meeting.entity.MeetingParticipant;

public interface MeetingParticipantRepository extends JpaRepository<MeetingParticipant, Long> {

    List<MeetingParticipant> findAllByMeetingIdIn(List<Long> meetingIds);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE MeetingParticipant mp SET mp.deletedAt = CURRENT_TIMESTAMP WHERE mp.meetingId IN :meetingIds")
    int softDeleteAllByMeetingIdIn(@Param("meetingIds") List<Long> meetingIds);
}
