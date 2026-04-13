package kr.flowmeet.domain.project.event;

public record ProjectMemberJoinedEvent(Long userId, Long projectId) {
}