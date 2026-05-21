package kr.flowmeet.api.project.event;

import java.time.LocalDateTime;
import kr.flowmeet.domain.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import kr.flowmeet.domain.node.event.NodeCreatedEvent;
import kr.flowmeet.domain.node.event.NodeDeletedEvent;
import kr.flowmeet.domain.node.event.NodeUpdatedEvent;

@Component
@RequiredArgsConstructor
public class ProjectActivityEventListener {

    private final ProjectService projectService;

    @TransactionalEventListener
    public void handleNodeCreated(final NodeCreatedEvent event) {
        touch(event.projectId());
    }

    @TransactionalEventListener
    public void handleNodeUpdated(final NodeUpdatedEvent event) {
        touch(event.projectId());
    }

    @TransactionalEventListener
    public void handleNodeDeleted(final NodeDeletedEvent event) {
        touch(event.projectId());
    }

    private void touch(final Long projectId) {
        projectService.touchLastActivityAt(projectId, LocalDateTime.now());
    }
}
