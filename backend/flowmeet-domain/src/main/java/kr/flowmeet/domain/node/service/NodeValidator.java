package kr.flowmeet.domain.node.service;

import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.meeting.entity.MeetingStatus;
import kr.flowmeet.domain.meeting.repository.MeetingRepository;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.exception.NodeErrorCode;
import kr.flowmeet.domain.node.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NodeValidator {

    private final NodeRepository nodeRepository;
    private final MeetingRepository meetingRepository;

    public void validateIsIn(Long nodeId, Long projectId) {
        if (!nodeRepository.existsByIdAndProjectId(nodeId, projectId)) {
            throw new BusinessException(NodeErrorCode.NODE_NOT_FOUND);
        }
    }

    public void validateNoActiveMeeting(final Node node) {
        if (meetingRepository.existsByNodeIdAndStatus(node.getId(), MeetingStatus.IN_PROGRESS)) {
            throw new BusinessException(NodeErrorCode.ACTIVE_MEETING_EXISTS);
        }
    }
}
