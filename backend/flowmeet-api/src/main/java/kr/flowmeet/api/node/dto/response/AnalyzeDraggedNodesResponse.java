package kr.flowmeet.api.node.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import kr.flowmeet.external.ai.dto.NodeAnalysisResult;

@Schema(description = "선택한 노드들의 회의록 기반 AI 분석 결과")
public record AnalyzeDraggedNodesResponse(
        @Schema(description = "회의 간 연관 관계 (구체화, 시너지, 선행조건 등)")
        List<MeetingRelationshipItem> meetingRelationships,
        @Schema(description = "회의에서 도출된 후속 업무의 담당자별 분배 현황")
        ActionItemsAnalysisItem actionItemsAnalysis,
        @Schema(description = "회의 내용 기반 AI 발전 아이디어 제안 (마크다운)")
        String developmentIdeas,
        @Schema(description = "노트 내용 기반 AI 요약")
        String notesSummary,
        @Schema(description = "회의 관계 시각화 Mermaid 코드")
        String mermaidCode
) {

    public static AnalyzeDraggedNodesResponse from(final NodeAnalysisResult result) {
        return new AnalyzeDraggedNodesResponse(
                result.meetingRelationships().stream()
                        .map(MeetingRelationshipItem::from)
                        .toList(),
                ActionItemsAnalysisItem.from(result.actionItemsAnalysis()),
                result.developmentIdeas(),
                result.notesSummary(),
                result.mermaidCode()
        );
    }

    @Schema(description = "회의 간 연관 관계")
    public record MeetingRelationshipItem(
            @Schema(description = "기준 회의 제목", example = "비즈니스 모델 전략 회의")
            String from,
            @Schema(description = "연관 회의 제목", example = "MVP기능 회의")
            String to,
            @Schema(description = "관계 유형 (구체화/변화 발생/시너지/선행조건/대체 가능/상충)", example = "구체화")
            String relation,
            @Schema(description = "해당 관계로 판단한 근거")
            String reason
    ) {
        public static MeetingRelationshipItem from(final NodeAnalysisResult.MeetingRelationship relationship) {
            return new MeetingRelationshipItem(
                    relationship.from(), relationship.to(), relationship.relation(), relationship.reason()
            );
        }
    }

    @Schema(description = "후속 업무 담당자별 분배 현황")
    public record ActionItemsAnalysisItem(
            @Schema(description = "전체 후속 업무 수", example = "15")
            int totalCount,
            @Schema(description = "담당자별 업무 배분")
            Map<String, PersonAnalysisItem> byPerson
    ) {
        public static ActionItemsAnalysisItem from(final NodeAnalysisResult.ActionItemsAnalysis analysis) {
            Map<String, PersonAnalysisItem> byPerson = analysis.byPerson().entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            e -> PersonAnalysisItem.from(e.getValue())
                    ));
            return new ActionItemsAnalysisItem(analysis.totalCount(), byPerson);
        }
    }

    @Schema(description = "담당자별 업무 배분")
    public record PersonAnalysisItem(
            @Schema(description = "배정된 업무 수", example = "5")
            int count,
            @Schema(description = "전체 대비 담당 비율 (합산 = 1.0)", example = "0.33")
            double rate
    ) {
        public static PersonAnalysisItem from(final NodeAnalysisResult.PersonAnalysis person) {
            return new PersonAnalysisItem(person.count(), person.rate());
        }
    }
}