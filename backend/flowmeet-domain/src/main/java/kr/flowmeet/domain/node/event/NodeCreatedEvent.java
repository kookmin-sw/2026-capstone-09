package kr.flowmeet.domain.node.event;

public record NodeCreatedEvent(Long projectId) {

    public static NodeCreatedEvent of(final Long projectId) {
        return new NodeCreatedEvent(projectId);
    }
}
