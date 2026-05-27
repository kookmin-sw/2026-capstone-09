package kr.flowmeet.domain.notification.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {
    MEETING_INVITE("회의 초대", "%s님이 '%s' 회의에 초대했어요"),
    MEETING_REMINDER("회의 시작", "'%s' 회의가 곧 시작돼요"),
    NODE_ASSIGNED("노드 배정", "%s 프로젝트의 '%s' 노드에 배정됐어요"),
    ;

    private final String title;
    private final String contentTemplate;

    public String formatContent(final String... args) {
        return String.format(contentTemplate, (Object[]) args);
    }
}