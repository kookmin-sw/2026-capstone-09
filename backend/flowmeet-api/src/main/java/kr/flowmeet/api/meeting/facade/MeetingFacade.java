package kr.flowmeet.api.meeting.facade;

import java.time.LocalDateTime;
import kr.flowmeet.api.meeting.dto.request.CreateMeetingRequest;
import kr.flowmeet.api.meeting.dto.request.UpdateMeetingRequest;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.service.MeetingService;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.service.NodeService;
import kr.flowmeet.domain.node.service.NodeValidator;
import kr.flowmeet.domain.project.entity.ProjectMemberRole;
import kr.flowmeet.domain.project.service.ProjectMemberService;
import kr.flowmeet.domain.project.service.ProjectPermissionValidator;
import kr.flowmeet.external.meeting.MeetingRoomProvider;
import kr.flowmeet.external.meeting.dto.CreateMeetingRoomCommand;
import kr.flowmeet.external.meeting.dto.MeetingRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingFacade {

    private static final long DEFAULT_MEETING_DURATION_MINUTES = 60L;

    private final MeetingService meetingService;
    private final NodeService nodeService;
    private final NodeValidator nodeValidator;
    private final ProjectPermissionValidator projectPermissionValidator;
    private final ProjectMemberService projectMemberService;
    private final MeetingRoomProvider meetingRoomProvider;

    @Transactional
    public void createMeeting(
            final Long userId,
            final Long projectId,
            final Long nodeId,
            final CreateMeetingRequest request
    ) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);
        nodeValidator.validateIsIn(nodeId, projectId);
        projectPermissionValidator.validateAllAreMembers(projectId, request.participantIds());
        meetingService.validateCreatable(nodeId, request.startedAt());

        Node node = nodeService.findByIdAndProjectId(nodeId, projectId);
        MeetingRoom room = meetingRoomProvider.create(toCreateRoomCommand(node, request.startedAt()));
        meetingService.create(nodeId, userId, room.url(), room.externalEventId(), request.toCommand());
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
        meetingService.validateUpdatable(meeting, userId, isOwner(projectId, userId));
        projectPermissionValidator.validateAllAreMembers(projectId, request.participantIds());

        meetingService.updateSchedule(meeting, request.toCommand());
    }

    @Transactional
    public void deleteMeeting(final Long userId, final Long projectId, final Long meetingId) {
        projectPermissionValidator.validate(projectId, userId, ProjectMemberRole.MEMBER);

        Meeting meeting = meetingService.findById(meetingId);
        nodeValidator.validateIsIn(meeting.getNodeId(), projectId);
        meetingService.validateDeletable(meeting, userId, isOwner(projectId, userId));

        String externalEventId = meeting.getExternalEventId();
        meetingService.delete(meeting);

        if (externalEventId != null && !externalEventId.isBlank()) {
            meetingRoomProvider.delete(externalEventId);
        }
    }

    private CreateMeetingRoomCommand toCreateRoomCommand(final Node node, final LocalDateTime startedAt) {
        return new CreateMeetingRoomCommand(
                node.getTitle(),
                startedAt,
                startedAt.plusMinutes(DEFAULT_MEETING_DURATION_MINUTES)
        );
    }

    private boolean isOwner(final Long projectId, final Long userId) {
        return projectMemberService.findMemberRole(projectId, userId) == ProjectMemberRole.OWNER;
    }
}
