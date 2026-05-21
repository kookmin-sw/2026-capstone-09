package kr.flowmeet.api.meeting.facade;

import java.time.LocalDateTime;
import kr.flowmeet.api.meeting.dto.request.CreateMeetingRequest;
import kr.flowmeet.api.meeting.dto.request.UpdateMeetingRequest;
import kr.flowmeet.api.meeting.dto.response.EndMeetingResponse;
import kr.flowmeet.domain.ai.entity.AiTask;
import kr.flowmeet.domain.ai.entity.AiTaskType;
import kr.flowmeet.domain.ai.service.AiTaskService;
import kr.flowmeet.domain.common.exception.BusinessException;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.exception.MeetingErrorCode;
import kr.flowmeet.domain.meeting.service.MeetingService;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.node.service.NodeValidator;
import kr.flowmeet.domain.project.entity.ProjectMember;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;
import kr.flowmeet.api.meeting.event.MeetingEndedEvent;
import kr.flowmeet.domain.transcript.service.MeetingTranscriptService;
import kr.flowmeet.external.meeting.MeetingRoomProvider;
import kr.flowmeet.external.meeting.dto.CreateMeetingRoomCommand;
import kr.flowmeet.external.meeting.dto.MeetingRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MeetingFacade {

    private static final long DEFAULT_MEETING_DURATION_MINUTES = 60L;

    private final MeetingService meetingService;
    private final NodeService nodeService;
    private final NodeValidator nodeValidator;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final ProjectMemberService projectMemberService;
    private final UserService userService;
    private final MeetingRoomProvider meetingRoomProvider;
    private final MeetingTranscriptService meetingTranscriptService;
    private final AiTaskService aiTaskService;
    private final ApplicationEventPublisher eventPublisher;

    public void createMeeting(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final CreateMeetingRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);
        nodeValidator.validateIsIn(nodeId, projectId);
        projectPermissionValidator.validateAllAreMembers(projectId, request.participantUserIds());
        meetingService.validateCreatable(nodeId, request.startedAt());

        User host = userService.findById(userId);
        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);
        MeetingRoom room = meetingRoomProvider.create(toCreateRoomCommand(node, request.startedAt(), host.getGoogleRefreshToken()));

        //Meeting 생성 실패 시, 외부로 호출해서 생성한 회의실 삭제
        try {
            meetingService.create(nodeId, userId, room.url(), room.externalEventId(), request.toCommand());
        } catch (OptimisticLockingFailureException e) {
            rollbackMeetingRoom(room.externalEventId(), e);
            throw new BusinessException(MeetingErrorCode.MEETING_ALREADY_EXISTS);
        } catch (RuntimeException e) {
            rollbackMeetingRoom(room.externalEventId(), e);
            throw e;
        }
    }

    @Transactional
    public void updateMeeting(
            final Long userId,
            final Long projectId,
            final Long meetingId,
            final UpdateMeetingRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Meeting meeting = meetingService.findById(meetingId);

        nodeValidator.validateIsIn(meeting.getNodeId(), projectId);

        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);

        projectPermissionValidator.validateAllAreMembers(projectId, request.participantUserIds());

        meetingService.updateMeeting(projectMember, meeting, request.toCommand());
    }

    public void deleteMeeting(final Long userId, final Long projectId, final Long meetingId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Meeting meeting = meetingService.findById(meetingId);
        nodeValidator.validateIsIn(meeting.getNodeId(), projectId);

        ProjectMember projectMember = projectMemberService.findByProjectIdAndUserId(projectId, userId);
        String externalEventId = meeting.getExternalEventId();
        Long hostId = meeting.getCreatedById();

        meetingService.delete(projectMember, meeting);

        if (externalEventId != null && !externalEventId.isBlank()) {
            User host = userService.findById(hostId);
            meetingRoomProvider.delete(externalEventId, host.getGoogleRefreshToken());
        }
    }

    @Transactional
    public void appendTranscript(
            final Long userId,
            final Long projectId,
            final Long meetingId,
            final String content
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);
        Meeting meeting = meetingService.findById(meetingId);
        nodeValidator.validateIsIn(meeting.getNodeId(), projectId);

        meetingService.startIfScheduled(meetingId);
        meetingTranscriptService.create(meetingId, content);
    }

    @Transactional
    public EndMeetingResponse endMeeting(
            final Long userId,
            final Long projectId,
            final Long meetingId
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);
        Meeting meeting = meetingService.findById(meetingId);
        nodeValidator.validateIsIn(meeting.getNodeId(), projectId);
        validateMeetingInProgress(meeting);

        meeting.end();

        String mergedText = meetingTranscriptService.mergeAllByMeetingId(meetingId);
        if (mergedText.isBlank()) {
            throw new BusinessException(MeetingErrorCode.MEETING_NO_TRANSCRIPT);
        }

        AiTask aiTask = aiTaskService.create(userId, projectId, meetingId, AiTaskType.SUB_SUMMARY);
        eventPublisher.publishEvent(new MeetingEndedEvent(aiTask.getId(), mergedText));

        return EndMeetingResponse.from(aiTask.getId());
    }

    private void validateMeetingInProgress(final Meeting meeting) {
        if (!meeting.isInProgress()) {
            throw new BusinessException(MeetingErrorCode.MEETING_NOT_IN_PROGRESS);
        }
    }

    private CreateMeetingRoomCommand toCreateRoomCommand(
            final Node node,
            final LocalDateTime startedAt,
            final String hostRefreshToken
    ) {
        return new CreateMeetingRoomCommand(
                node.getTitle(),
                startedAt,
                startedAt.plusMinutes(DEFAULT_MEETING_DURATION_MINUTES),
                hostRefreshToken
        );
    }

    private void rollbackMeetingRoom(String externalEventId, Exception e) {
        try {
            meetingRoomProvider.delete(externalEventId, null);
        } catch (RuntimeException cleanupError) {
            e.addSuppressed(cleanupError);
        }
    }
}
