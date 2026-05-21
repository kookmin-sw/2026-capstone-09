package kr.flowmeet.domain.node.event;

public record NodeUpdatedEvent(Long projectId) {

    public static NodeUpdatedEvent of(final Long projectId) {
        return new NodeUpdatedEvent(projectId);
    }
}
