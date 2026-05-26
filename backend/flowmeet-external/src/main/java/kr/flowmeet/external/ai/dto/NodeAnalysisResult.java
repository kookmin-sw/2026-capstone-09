package kr.flowmeet.external.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public record NodeAnalysisResult(
        @JsonProperty("meeting_relationships")
        List<MeetingRelationship> meetingRelationships,
        @JsonProperty("action_items_analysis")
        ActionItemsAnalysis actionItemsAnalysis,
        @JsonProperty("development_ideas")
        String developmentIdeas,
        @JsonProperty("notes_summary")
        String notesSummary,
        @JsonProperty("mermaid_code")
        String mermaidCode
) {

    public record MeetingRelationship(
            String from,
            String to,
            String relation,
            String reason
    ) {}

    public record ActionItemsAnalysis(
            @JsonProperty("total_count")
            int totalCount,
            @JsonProperty("by_person")
            Map<String, PersonAnalysis> byPerson
    ) {}

    public record PersonAnalysis(
            int count,
            double rate
    ) {}
}