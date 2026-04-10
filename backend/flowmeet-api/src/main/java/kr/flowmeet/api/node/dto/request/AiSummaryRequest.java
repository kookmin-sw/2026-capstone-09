package kr.flowmeet.api.node.dto.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record AiSummaryRequest(
        @NotEmpty(message = "요약할 노드를 선택해 주세요.")
        List<Long> nodeIds
) {
}
