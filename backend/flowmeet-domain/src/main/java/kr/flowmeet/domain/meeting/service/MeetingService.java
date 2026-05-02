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
        meetingParticipantRepository.softDeleteAllByMeetingIdIn(meetingIds);
        meetingRepository.softDeleteAllByIdIn(meetingIds);
    }

    public void validateUpdatable(final Meeting meeting, final Long userId, final boolean isOwner) {
        if (!meeting.isScheduled()) {
            throw new BusinessException(MeetingErrorCode.MEETING_NOT_SCHEDULED);
        }
        if (!isCreatorOrOwner(meeting, userId, isOwner)) {
            throw new BusinessException(MeetingErrorCode.MEETING_UPDATE_FORBIDDEN);
        }
    }

    public void validateDeletable(final Meeting meeting, final Long userId, final boolean isOwner) {
        if (meeting.isInProgress()) {
            throw new BusinessException(MeetingErrorCode.MEETING_IN_PROGRESS);
        }
        if (!isCreatorOrOwner(meeting, userId, isOwner)) {
            throw new BusinessException(MeetingErrorCode.MEETING_DELETE_FORBIDDEN);
        }
    }

    @Transactional
    public Meeting create(
            final Long nodeId,
            final Long createdById,
            final String meetingUrl,
            final String externalEventId,
            final CreateMeetingCommand command
    ) {
        validateNoDuplicate(nodeId);
        validateFutureTime(command.startedAt());

        Meeting meeting = meetingRepository.save(
                Meeting.builder()
                        .nodeId(nodeId)
                        .createdById(createdById)
                        .status(MeetingStatus.SCHEDULED)
                        .startedAt(command.startedAt())
                        .isPushEnabled(true)
                        .pushNotifyAt(command.startedAt().minusMinutes(DEFAULT_REMINDER_MINUTES_BEFORE_START))
                        .meetingUrl(meetingUrl)
                        .externalEventId(externalEventId)
                        .build()
        );

        saveParticipants(meeting.getId(), command.participantIds());
        return meeting;
    }

    public void validateCreatable(final Long nodeId, final LocalDateTime startedAt) {
        validateNoDuplicate(nodeId);
        validateFutureTime(startedAt);
    }

    @Transactional
    public void updateSchedule(final Meeting meeting, final UpdateMeetingCommand command) {
        validateFutureTime(command.startedAt());

        meeting.updateSchedule(
                command.startedAt(),
                command.startedAt().minusMinutes(DEFAULT_REMINDER_MINUTES_BEFORE_START)
        );

        syncParticipants(meeting.getId(), command.participantIds());
    }

    private void syncParticipants(final Long meetingId, final List<Long> requestedUserIds) {
        Set<Long> requestedUserIdSet = requestedUserIds == null
                ? Set.of()
                : new HashSet<>(requestedUserIds);

        List<MeetingParticipant> existingParticipants =
                meetingParticipantRepository.findAllByMeetingId(meetingId);
        Set<Long> existingUserIdSet = existingParticipants.stream()
                .map(MeetingParticipant::getUserId)
                .collect(Collectors.toSet());

        List<MeetingParticipant> participantsToRemove = existingParticipants.stream()
                .filter(p -> !requestedUserIdSet.contains(p.getUserId()))
                .toList();
        List<Long> userIdsToAdd = requestedUserIdSet.stream()
                .filter(userId -> !existingUserIdSet.contains(userId))
                .toList();

        if (!participantsToRemove.isEmpty()) {
            meetingParticipantRepository.deleteAll(participantsToRemove);
        }
        saveParticipants(meetingId, userIdsToAdd);
    }

    @Transactional
    public void delete(final Meeting meeting) {
        meetingParticipantRepository.softDeleteAllByMeetingId(meeting.getId());
        meetingRepository.delete(meeting);
    }

    private void saveParticipants(final Long meetingId, final List<Long> participantIds) {
        if (participantIds == null || participantIds.isEmpty()) {
            return;
        }
        List<MeetingParticipant> participants = participantIds.stream()
                .distinct()
                .map(userId -> MeetingParticipant.builder()
                        .meetingId(meetingId)
                        .userId(userId)
                        .build())
                .toList();
        meetingParticipantRepository.saveAll(participants);
    }

    private boolean isCreatorOrOwner(final Meeting meeting, final Long userId, final boolean isOwner) {
        return meeting.isCreatedBy(userId) || isOwner;
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
}
