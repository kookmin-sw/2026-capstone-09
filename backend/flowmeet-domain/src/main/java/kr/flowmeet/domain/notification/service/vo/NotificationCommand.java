package kr.flowmeet.domain.notification.service.vo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import kr.flowmeet.domain.notification.entity.NotificationType;
import lombok.Getter;

@Getter
public class NotificationCommand {
    private final List<String> arguments = new ArrayList<>();
    private final Long userId;
    private final Long projectId;
    private final NotificationType type;

    public List<String> getArguments() {
        return List.copyOf(arguments);
    }

    protected NotificationCommand(Long userId, Long projectId, NotificationType type) {
        this.userId = userId;
        this.projectId = projectId;
        this.type = type;
    }

    protected void addArguments(String... args) {
        arguments.addAll(Arrays.asList(args));
    }
}
