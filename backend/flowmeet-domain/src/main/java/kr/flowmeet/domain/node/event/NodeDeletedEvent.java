package kr.flowmeet.domain.node.event;

public record NodeDeletedEvent(Long projectId) {

    public static NodeDeletedEvent of(final Long projectId) {
        return new NodeDeletedEvent(projectId);
    }
}
