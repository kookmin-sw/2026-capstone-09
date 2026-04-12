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
import kr.flowmeet.domain.meeting.repository.MeetingRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingService {

    private final MeetingRepository meetingRepository;

    public Optional<Meeting> findByNodeId(final Long nodeId) {
        return meetingRepository.findByNodeId(nodeId);
    }

    public List<Meeting> findAllByNodeIds(final List<Long> nodeIds) {
        return meetingRepository.findAllByNodeIdIn(nodeIds);
    }

    public boolean existsByNodeId(final Long nodeId) {
        return meetingRepository.existsByNodeId(nodeId);
    }

    public boolean hasActiveMeeting(final Long nodeId) {
        return meetingRepository.existsByNodeIdAndStatus(nodeId, MeetingStatus.IN_PROGRESS);
    }

    public void validateNoActiveMeeting(final Long nodeId) {
        if (meetingRepository.existsByNodeIdAndStatus(nodeId, MeetingStatus.IN_PROGRESS)) {
            throw new BusinessException(MeetingErrorCode.ACTIVE_MEETING_EXISTS);
        }
    }

    public Set<Long> findAllMeetingNodeIds(final List<Long> nodeIds) {
        return findAllByNodeIds(nodeIds)
                .stream()
                .map(Meeting::getNodeId)
                .collect(Collectors.toSet());
    }
}
