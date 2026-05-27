package kr.flowmeet.api.node.event;

public record NodeAssignedEvent(
        Long assigneeUserId,
        Long projectId,
        Long nodeId
) {
    public static NodeAssignedEvent of(final Long assigneeUserId, final Long projectId, final Long nodeId) {
        return new NodeAssignedEvent(assigneeUserId, projectId, nodeId);
    }
}