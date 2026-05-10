package kr.flowmeet.api.node.event;

public record NodeSummaryRequestEvent(
        String jobId,
        String text
) {
}