package kr.flowmeet.api.project.event;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import kr.flowmeet.domain.node.event.NodeCreatedEvent;
import kr.flowmeet.domain.node.event.NodeDeletedEvent;
import kr.flowmeet.domain.node.event.NodeUpdatedEvent;
import kr.flowmeet.domain.project.repository.ProjectRepository;

@Component
@RequiredArgsConstructor
public class ProjectActivityEventListener {

    private final ProjectRepository projectRepository;

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
        projectRepository.touchLastActivityAt(projectId, LocalDateTime.now());
    }
}
