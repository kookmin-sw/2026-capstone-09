package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.Tag;
import kr.flowmeet.domain.user.entity.User;

@Schema(description = "노드 상세 조회 응답")
public record GetNodeResponse(
        @Schema(description = "노드 ID", example = "101")
        Long nodeId,
        @Schema(description = "프로젝트 ID", example = "17")
        Long projectId,
        @Schema(description = "상위 노드 ID (루트인 경우 null)", example = "100")
        Long parentId,
        @Schema(description = "노드 제목", example = "로그인 화면 기획")
        String title,
        @Schema(description = "노드 설명", example = "OAuth2 로그인 플로우 정리")
        String description,
        @Schema(description = "노트 내용(마크다운)", example = "## 로그인 시나리오\n- Google OAuth ...")
        String noteContent,
        @Schema(description = "노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "DONE"})
        String status,
        @Schema(description = "같은 상태 내 정렬 순서", example = "1024")
        int sortOrder,
        @Schema(description = "부여된 태그 목록")
        List<TagItem> tags,
        @Schema(description = "담당자 목록")
        List<AssigneeItem> assignees,
        @Schema(description = "연결된 회의 정보 (없으면 null)")
        MeetingItem meeting,
        @Schema(description = "생성 시각", example = "2026-03-01T09:00:00")
        LocalDateTime createdAt,
        @Schema(description = "마지막 수정 시각", example = "2026-04-19T10:15:30")
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

    @Schema(description = "노드에 연결된 회의 정보")
    public record MeetingItem(
            @Schema(description = "회의 ID", example = "57")
            Long meetingId,
            @Schema(description = "회의 상태", example = "SCHEDULED")
            String status,
            @Schema(description = "회의 시작 시각", example = "2026-04-20T14:00:00")
            LocalDateTime startedAt,
            @Schema(description = "회의 시작 푸시 알림 사용 여부", example = "true")
            boolean isPushEnabled,
            @Schema(description = "푸시 알림 예약 시각", example = "2026-04-20T13:50:00")
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
