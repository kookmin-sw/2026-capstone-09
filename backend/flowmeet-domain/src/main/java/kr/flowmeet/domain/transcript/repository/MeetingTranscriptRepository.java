package kr.flowmeet.domain.transcript.repository;

import java.util.List;
import kr.flowmeet.domain.transcript.entity.MeetingTranscript;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingTranscriptRepository extends JpaRepository<MeetingTranscript, Long> {

    List<MeetingTranscript> findAllByMeetingIdOrderByCreatedAtAsc(Long meetingId);
}