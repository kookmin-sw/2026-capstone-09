package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.entity.Node;
import kr.flowmeet.domain.user.entity.User;

@Schema(description = "노드에 연결된 상대 노드 목록 조회 응답")
public record GetLinkedNodesResponse(
        @Schema(description = "연결된 노드 목록")
        List<LinkedNodeItem> linkedNodes
) {

    public static GetLinkedNodesResponse of(final Long nodeId, final List<Edge> edges) {
        List<LinkedNodeItem> items = edges.stream()
                .map(edge -> LinkedNodeItem.of(nodeId, edge))
                .toList();

        return new GetLinkedNodesResponse(items);
    }

    @Schema(description = "연결된 상대 노드 항목")
    public record LinkedNodeItem(
            @Schema(description = "연결선 ID", example = "9001")
            Long edgeId,
            @Schema(description = "조회한 노드의 연결선 내 역할", example = "START", allowableValues = {"START", "END"})
            NodeLinkType linkType,
            @Schema(description = "연결된 상대 노드 ID", example = "102")
            Long linkedNodeId,
            @Schema(description = "노드 번호 (노드 1번의 서브 노드라면 1.1)", example = "1")
            String number,
            @Schema(description = "노드 제목", example = "메인 노드 제목입니다.")
            String title,
            @Schema(description = "노드 설명", example = "노드 노트 요약 내용입니다.")
            String description,
            @Schema(description = "연결선 코멘트", example = "로그인 성공 시 대시보드로 이동")
            String comment,
            @Schema(description = "연결선을 만든 사용자 정보")
            LinkCreatorItem createdBy,
            @Schema(description = "연결선 생성 시각", example = "2026-04-19T10:15:30")
            LocalDateTime createdAt
    ) {

        public static LinkedNodeItem of(final Long nodeId, final Edge edge) {
            boolean isStart = nodeId.equals(edge.getStartNodeId());
            NodeLinkType linkType = isStart ? NodeLinkType.START : NodeLinkType.END;
            Node linkedNode = isStart ? edge.getEndNode() : edge.getStartNode();

            return new LinkedNodeItem(
                    edge.getId(),
                    linkType,
                    linkedNode.getId(),
                    linkedNode.getNumber(),
                    linkedNode.getTitle(),
                    linkedNode.getDescription(),
                    edge.getComment(),
                    LinkCreatorItem.from(edge.getCreatedBy()),
                    edge.getCreatedAt()
            );
        }
    }

    @Schema(description = "연결선을 만든 사용자 정보")
    public record LinkCreatorItem(
            @Schema(description = "사용자 ID", example = "91")
            Long userId,
            @Schema(description = "닉네임", example = "윤신지")
            String nickname,
            @Schema(description = "프로필 이미지 URL", example = "https://cdn.flowmeet.kr/profile/91.png")
            String profileImageUrl
    ) {

        public static LinkCreatorItem from(final User user) {
            return new LinkCreatorItem(user.getId(), user.getNickname(), user.getProfileImageUrl());
        }
    }

    @Schema(description = "조회한 노드의 연결선 내 역할 (START: 시작 노드, END: 끝 노드)")
    public enum NodeLinkType {
        START,
        END
    }
}
