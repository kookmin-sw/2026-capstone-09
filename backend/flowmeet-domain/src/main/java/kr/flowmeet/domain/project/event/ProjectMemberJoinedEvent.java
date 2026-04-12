package kr.flowmeet.domain.project.event;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ProjectMemberJoinedEvent {

    private final Long userId;
    private final Long projectId;
}