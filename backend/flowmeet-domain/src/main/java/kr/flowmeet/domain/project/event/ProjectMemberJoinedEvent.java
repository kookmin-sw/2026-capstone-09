package kr.flowmeet.domain.project.event;

public record ProjectMemberJoinedEvent(
        Long userId,
        Long projectId
) {

    public static ProjectMemberJoinedEvent of(Long userId, Long projectId) {
        return new ProjectMemberJoinedEvent(userId, projectId);
    }
}