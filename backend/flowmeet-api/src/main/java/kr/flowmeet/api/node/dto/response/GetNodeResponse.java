package kr.flowmeet.api.node.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.entity.MeetingParticipant;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.node.entity.NodeAssignee;
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
        @Schema(description = "노드 번호 (노드 1번의 서브 노드라면 1.1)", example = "1.1")
        String number,
        @Schema(description = "노드 제목", example = "로그인 화면 기획")
        String title,
        @Schema(description = "노드 설명", example = "OAuth2 로그인 플로우 정리")
        String description,
        @Schema(description = "노트 내용(마크다운)", example = "## 로그인 시나리오\n- Google OAuth ...")
        String noteContent,
        @Schema(description = "노드 상태", example = "IN_PROGRESS", allowableValues = {"WAITING", "IN_PROGRESS", "ON_HOLD", "DONE", "CLOSED"})
        String status,
        @Schema(description = "같은 상태 내 정렬 순서", example = "1024")
        int sortOrder,
        @Schema(description = "부여된 태그 목록")
        List<TagItem> tags,
        @Schema(description = "담당자 목록")
        List<AssigneeItem> assignees,
        @Schema(description = "연결된 회의 정보 (없으면 null)")
        MeetingItem meeting,
        @Schema(description = "하위 노드 회의록을 종합한 AI 요약 (메인 노드 전용, 서브 노드에서는 필드 자체가 생략됨)")
        @JsonInclude(JsonInclude.Include.NON_NULL)
        String mainSummary,
        @Schema(description = "생성 시각", example = "2026-03-01T09:00:00")
        LocalDateTime createdAt,
        @Schema(description = "마지막 수정 시각", example = "2026-04-19T10:15:30")
        LocalDateTime updatedAt
) {

    public static GetNodeResponse of(
            final Node node,
            final List<Tag> tags,
            final List<NodeAssignee> assignees,
            final Meeting meeting,
            final List<MeetingParticipant> meetingParticipants,
            final Map<Long, User> userMap
    ) {
        return new GetNodeResponse(
                node.getId(),
                node.getProjectId(),
                node.getParentId(),
                node.getNumber(),
                node.getTitle(),
                node.getDescription(),
                node.getNoteContent(),
                node.getStatus().name(),
                node.getSortOrder(),
                tags.stream().map(TagItem::from).toList(),
                assignees.stream().map(AssigneeItem::from).toList(),
                meeting != null ? MeetingItem.of(meeting, meetingParticipants, userMap) : null,
                node.getSummary(),
                node.getCreatedAt(),
                node.getUpdatedAt()
        );
    }

    @Schema(description = "노드에 연결된 회의 정보")
    public record MeetingItem(
            @Schema(description = "회의 ID", example = "57")
            Long meetingId,
            @Schema(description = "회의 상태", example = "SCHEDULED", allowableValues = {"SCHEDULED", "IN_PROGRESS", "ENDED"})
            String status,
            @Schema(description = "회의 시작 시각", example = "2026-04-20T14:00:00")
            LocalDateTime startedAt,
            @Schema(description = "회의 시작 푸시 알림 사용 여부", example = "true")
            boolean isPushEnabled,
            @Schema(description = "푸시 알림 예약 시각", example = "2026-04-20T13:50:00")
            LocalDateTime pushNotifyAt,
            @Schema(description = "화상 회의 링크", example = "https://meet.google.com/abc-defg-hij")
            String meetingUrl,
            @Schema(description = "회의록 AI 요약 (생성 전이라면 null)")
            String summary,
            @Schema(description = "Mermaid 다이어그램 코드 (생성 전이라면 null)")
            String mermaidCode,
            @Schema(description = "참여자 목록")
            List<ParticipantItem> participants,
            @Schema(description = "회의 생성자")
            CreatorItem createdBy,
            @Schema(description = "생성 시각", example = "2026-04-19T10:15:30")
            LocalDateTime createdAt
    ) {

        public static MeetingItem of(
                final Meeting meeting,
                final List<MeetingParticipant> participants,
                final Map<Long, User> userMap
        ) {
            return new MeetingItem(
                    meeting.getId(),
                    meeting.getStatus().name(),
                    meeting.getStartedAt(),
                    meeting.isPushEnabled(),
                    meeting.getPushNotifyAt(),
                    meeting.getMeetingUrl(),
                    meeting.getSummary(),
                    meeting.getMermaidCode(),
                    participants.stream()
                            .map(p -> ParticipantItem.of(p, userMap.get(p.getUserId())))
                            .toList(),
                    CreatorItem.from(userMap.get(meeting.getCreatedById())),
                    meeting.getCreatedAt()
            );
        }
    }

    @Schema(description = "회의 참여자")
    public record ParticipantItem(
            @Schema(description = "회의 참여자 ID", example = "1")
            Long meetingParticipantId,
            @Schema(description = "사용자 ID", example = "10")
            Long userId,
            @Schema(description = "닉네임", example = "홍길동")
            String nickname,
            @Schema(description = "이메일", example = "test@flowmeet.kr")
            String email,
            @Schema(description = "프로필 이미지 URL", example = "https://cdn.flowmit.com/profiles/10.png")
            String profileImageUrl
    ) {

        public static ParticipantItem of(final MeetingParticipant participant, final User user) {
            return new ParticipantItem(
                    participant.getId(),
                    participant.getUserId(),
                    user != null ? user.getNickname() : null,
                    user != null ? user.getEmail() : null,
                    user != null ? user.getProfileImageUrl() : null
            );
        }
    }

    @Schema(description = "회의 생성자")
    public record CreatorItem(
            @Schema(description = "사용자 ID", example = "10")
            Long userId,
            @Schema(description = "닉네임", example = "홍길동")
            String nickname
    ) {

        public static CreatorItem from(final User user) {
            if (user == null) {
                return null;
            }
            return new CreatorItem(user.getId(), user.getNickname());
        }
    }
}
