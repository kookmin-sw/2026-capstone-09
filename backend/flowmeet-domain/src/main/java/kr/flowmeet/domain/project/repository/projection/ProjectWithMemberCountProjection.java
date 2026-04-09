package kr.flowmeet.domain.project.repository.projection;

import kr.flowmeet.domain.project.entity.Project;

public record ProjectWithMemberCountProjection(
        Project project,
        Long memberCount
) {
}
