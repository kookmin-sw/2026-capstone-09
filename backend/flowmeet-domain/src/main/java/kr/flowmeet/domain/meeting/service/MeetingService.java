package kr.flowmeet.domain.meeting.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.entity.MeetingParticipant;
import kr.flowmeet.domain.meeting.entity.MeetingStatus;
import kr.flowmeet.domain.meeting.exception.MeetingErrorCode;
import kr.flowmeet.domain.meeting.repository.MeetingParticipantRepository;
import kr.flowmeet.domain.meeting.repository.MeetingRepository;
import kr.flowmeet.domain.meeting.service.vo.CreateMeetingCommand;
import kr.flowmeet.domain.meeting.service.vo.UpdateMeetingCommand;
import kr.flowmeet.domain.node.repository.NodeRepository;
import kr.flowmeet.domain.project.entity.ProjectMember;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingService {

    private static final long DEFAULT_REMINDER_MINUTES_BEFORE_START = 10L;

    private final MeetingRepository meetingRepository;
    private final MeetingParticipantRepository meetingParticipantRepository;
    private final NodeRepository nodeRepository;

    public Meeting findById(final Long meetingId) {
        return meetingRepository.findById(meetingId)
                .orElseThrow(() -> new BusinessException(MeetingErrorCode.MEETING_NOT_FOUND));
    }

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

    public List<Meeting> findScheduledToStart(final LocalDateTime now) {
        return meetingRepository.findAllByStatusAndStartedAtBefore(MeetingStatus.SCHEDULED, now);
    }

    public List<Meeting> findPendingReminders(final LocalDateTime now) {
        return meetingRepository.findPendingReminders(now.minusHours(1), now, MeetingStatus.SCHEDULED);
    }

    public List<MeetingParticipant> findAllParticipantsByMeetingIds(final List<Long> meetingIds) {
        return meetingParticipantRepository.findAllByMeetingIdIn(meetingIds);
    }

    public List<MeetingParticipant> findAllParticipantsByMeetingId(final Long meetingId) {
        return meetingParticipantRepository.findAllByMeetingId(meetingId);
    }

    @Transactional
    public void markRemindersSent(final List<Long> meetingIds) {
        meetingRepository.markRemindersSent(meetingIds);
    }

    @Transactional
    public void deleteAllByIds(final List<Long> meetingIds) {
        if (meetingIds.isEmpty()) {
            return;
        }
        meetingParticipantRepository.deleteAllByMeetingIdIn(meetingIds);
        meetingRepository.softDeleteAllByIdIn(meetingIds);
    }

    @Transactional
    public Meeting create(
            final Long nodeId,
            final Long createdById,
            final String meetingUrl,
            final String externalEventId,
            final CreateMeetingCommand command
    ) {
        nodeRepository.lockVersionById(nodeId);
        validateNoDuplicate(nodeId);
        validateFutureTime(command.startedAt());

        Meeting meeting = meetingRepository.save(
                Meeting.builder()
                        .nodeId(nodeId)
                        .createdById(createdById)
                        .status(MeetingStatus.SCHEDULED)
                        .startedAt(command.startedAt())
                        .isPushEnabled(command.isPushEnabled())
                        .pushNotifyAt(command.startedAt().minusMinutes(DEFAULT_REMINDER_MINUTES_BEFORE_START))
                        .meetingUrl(meetingUrl)
                        .externalEventId(externalEventId)
                        .build()
        );

        saveParticipants(meeting.getId(), command.participantUserIds());
        return meeting;
    }

    public void validateCreatable(final Long nodeId, final LocalDateTime startedAt) {
        validateNoDuplicate(nodeId);
        validateFutureTime(startedAt);
    }

    @Transactional
    public void updateMeeting(final ProjectMember projectMember, final Meeting meeting, final UpdateMeetingCommand command) {
        if (!meeting.isScheduled()) {
            throw new BusinessException(MeetingErrorCode.MEETING_NOT_SCHEDULED);
        }

        validateFutureTime(command.startedAt());
        validateCreatorOrOwner(meeting, projectMember);

        meeting.updateSchedule(
                command.startedAt(),
                command.startedAt().minusMinutes(DEFAULT_REMINDER_MINUTES_BEFORE_START)
        );

        meeting.updatePushEnabled(command.isPushEnabled());

        syncParticipants(meeting.getId(), command.participantUserIds());
    }

    private void syncParticipants(final Long meetingId, final List<Long> requestedUserIds) {
        Set<Long> requestedUserIdSet = requestedUserIds == null
                ? Set.of()
                : new HashSet<>(requestedUserIds);

        Set<Long> existingUserIdSet = meetingParticipantRepository.findAllByMeetingId(meetingId).stream()
                .map(MeetingParticipant::getUserId)
                .collect(Collectors.toSet());

        List<Long> userIdsToRemove = existingUserIdSet.stream()
                .filter(userId -> !requestedUserIdSet.contains(userId))
                .toList();
        List<Long> userIdsToAdd = requestedUserIdSet.stream()
                .filter(userId -> !existingUserIdSet.contains(userId))
                .toList();

        if (!userIdsToRemove.isEmpty()) {
            meetingParticipantRepository.deleteAllByMeetingIdAndUserIdIn(meetingId, userIdsToRemove);
        }
        saveParticipants(meetingId, userIdsToAdd);
    }

    @Transactional
    public void delete(final ProjectMember projectMember, final Meeting meeting) {
        validateCreatorOrOwner(meeting, projectMember);

        meetingParticipantRepository.deleteAllByMeetingId(meeting.getId());
        meetingRepository.delete(meeting);
    }

    private void saveParticipants(final Long meetingId, final List<Long> participantUserIds) {
        if (participantUserIds == null || participantUserIds.isEmpty()) {
            return;
        }
        List<MeetingParticipant> participants = participantUserIds.stream()
                .distinct()
                .map(userId -> MeetingParticipant.builder()
                        .meetingId(meetingId)
                        .userId(userId)
                        .build())
                .toList();
        meetingParticipantRepository.saveAll(participants);
    }

    @Transactional
    public void saveSummary(final Long meetingId, final String summary, final String mermaidCode) {
        Meeting meeting = findById(meetingId);
        meeting.saveSummary(summary, mermaidCode);
    }

    @Transactional
    public void startIfScheduled(Long meetingId) {
        Meeting meeting = findById(meetingId);

        if (meeting.isScheduled()) {
            meeting.start();
        }
    }

    private void validateNoDuplicate(final Long nodeId) {
        if (meetingRepository.existsByNodeId(nodeId)) {
            throw new BusinessException(MeetingErrorCode.MEETING_ALREADY_EXISTS);
        }
    }

    private void validateFutureTime(final LocalDateTime startedAt) {
        if (startedAt.isBefore(LocalDateTime.now())) {
            throw new BusinessException(MeetingErrorCode.MEETING_INVALID_TIME);
        }
    }

    private void validateCreatorOrOwner(final Meeting meeting, final ProjectMember projectMember) {
        if ((!meeting.isCreatedBy(projectMember.getUserId())) && (!projectMember.isOwner())) {
            throw new BusinessException(MeetingErrorCode.MEETING_DELETE_FORBIDDEN);
        }
    }
}
