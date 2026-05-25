package kr.flowmeet.domain.transcript.service;

import java.util.List;
import java.util.stream.Collectors;
import kr.flowmeet.domain.transcript.entity.MeetingTranscript;
import kr.flowmeet.domain.transcript.repository.MeetingTranscriptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingTranscriptService {

    private final MeetingTranscriptRepository meetingTranscriptRepository;

    @Transactional
    public MeetingTranscript create(final Long meetingId, final String content) {
        return meetingTranscriptRepository.save(
                MeetingTranscript.builder()
                        .meetingId(meetingId)
                        .content(content)
                        .build()
        );
    }

    public String mergeAllByMeetingId(final Long meetingId) {
        List<MeetingTranscript> transcripts =
                meetingTranscriptRepository.findAllByMeetingIdOrderByCreatedAtAsc(meetingId);
        return transcripts.stream()
                .map(MeetingTranscript::getContent)
                .collect(Collectors.joining("\n"));
    }
}