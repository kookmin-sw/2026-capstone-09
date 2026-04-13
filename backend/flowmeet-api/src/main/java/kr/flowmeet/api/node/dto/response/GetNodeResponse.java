package kr.flowmeet.api.node.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.user.entity.User;

public record GetNodeResponse(
        Long nodeId,
        Long projectId,
        Long parentId,
        String title,
        String description,
        String noteContent,
        String status,
        int sortOrder,
        List<TagItem> tags,
        List<AssigneeItem> assignees,
        MeetingItem meeting,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static GetNodeResponse of(final Node node, final List<Tag> tags,
                                     final List<User> assignees, final Meeting meeting) {
        return new GetNodeResponse(
                node.getId(),
                node.getProjectId(),
                node.getParentId(),
                node.getTitle(),
                node.getDescription(),
                node.getNoteContent(),
                node.getStatus().name(),
                node.getSortOrder(),
                tags.stream().map(TagItem::from).toList(),
                assignees.stream().map(AssigneeItem::from).toList(),
                meeting != null ? MeetingItem.from(meeting) : null,
                node.getCreatedAt(),
                node.getUpdatedAt()
        );
    }

    public record MeetingItem(
            Long meetingId,
            String status,
            LocalDateTime startedAt,
            boolean isPushEnabled,
            LocalDateTime pushNotifyAt
    ) {

        public static MeetingItem from(final Meeting meeting) {
            return new MeetingItem(
                    meeting.getId(),
                    meeting.getStatus().name(),
                    meeting.getStartedAt(),
                    meeting.isPushEnabled(),
                    null
            );
        }
    }
}
