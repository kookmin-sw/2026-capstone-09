package kr.flowmeet.domain.meeting.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.flowmeet.domain.meeting.entity.MeetingParticipant;

public interface MeetingParticipantRepository extends JpaRepository<MeetingParticipant, Long> {

    List<MeetingParticipant> findAllByMeetingIdIn(List<Long> meetingIds);

    List<MeetingParticipant> findAllByMeetingId(Long meetingId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM MeetingParticipant mp WHERE mp.meetingId IN :meetingIds")
    int deleteAllByMeetingIdIn(@Param("meetingIds") List<Long> meetingIds);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM MeetingParticipant mp WHERE mp.meetingId = :meetingId")
    int deleteAllByMeetingId(@Param("meetingId") Long meetingId);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM MeetingParticipant mp WHERE mp.meetingId = :meetingId AND mp.userId IN :userIds")
    int deleteAllByMeetingIdAndUserIdIn(
            @Param("meetingId") Long meetingId,
            @Param("userIds") List<Long> userIds
    );
}
