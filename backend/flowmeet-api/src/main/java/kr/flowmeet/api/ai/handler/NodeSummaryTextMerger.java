package kr.flowmeet.api.ai.handler;

import java.util.List;
import java.util.Map;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.node.entity.Node;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class NodeSummaryTextMerger {

    public static String merge(final List<Node> childNodes, final Map<Long, Meeting> meetingByNodeId) {
        StringBuilder textBuilder = new StringBuilder();
        for (Node child : childNodes) {
            Meeting meeting = meetingByNodeId.get(child.getId());
            if (meeting != null && meeting.getSummary() != null) {
                textBuilder.append("name: ").append(child.getTitle())
                        .append(" \"").append(meeting.getSummary()).append("\"  ");
            }
        }
        return textBuilder.toString().trim();
    }
}