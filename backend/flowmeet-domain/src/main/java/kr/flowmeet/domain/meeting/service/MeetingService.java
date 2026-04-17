package kr.flowmeet.domain.meeting.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.entity.MeetingStatus;
import kr.flowmeet.domain.meeting.exception.MeetingErrorCode;
import kr.flowmeet.domain.meeting.repository.MeetingParticipantRepository;
import kr.flowmeet.domain.meeting.repository.MeetingRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final MeetingParticipantRepository meetingParticipantRepository;

    public Optional<Meeting> findByNodeId(final Long nodeId) {
        return meetingRepository.findByNodeId(nodeId);
    }

    public List<Meeting> findAllByNodeIds(final List<Long> nodeIds) {
        return meetingRepository.findAllByNodeIdIn(nodeIds);
    }

    public List<Long> findAllIdsByNodeIds(final List<Long> nodeIds) {
        if (nodeIds.isEmpty()) {
            return List.of();
        }
        return findAllByNodeIds(nodeIds).stream()
                .map(Meeting::getId)
                .toList();
    }

    public Set<Long> findAllMeetingNodeIds(final List<Long> nodeIds) {
        return findAllByNodeIds(nodeIds)
                .stream()
                .map(Meeting::getNodeId)
                .collect(Collectors.toSet());
    }

    @Transactional
    public void deleteAllByIds(final List<Long> meetingIds) {
        if (meetingIds.isEmpty()) {
            return;
        }
        meetingParticipantRepository.softDeleteAllByMeetingIdIn(meetingIds);
        meetingRepository.softDeleteAllByIdIn(meetingIds);
    }
}
