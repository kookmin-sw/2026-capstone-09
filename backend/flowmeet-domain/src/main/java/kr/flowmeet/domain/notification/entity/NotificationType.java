package kr.flowmeet.domain.notification.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {
    MEETING_CREATED("새 회의", "%s 프로젝트에 새 회의가 만들어졌어요"),
    MEETING_INVITE("회의 초대", "%s님이 '%s' 회의에 초대했어요"),
    MEETING_REMINDER("회의 시작", "'%s' 회의가 곧 시작돼요"),
    MEETING_ENDED("회의 종료", "'%s' 회의가 끝났어요"),
    MEMBER_INVITE("프로젝트 초대", "%s님이 %s 프로젝트에 초대했어요"),
    NODE_ASSIGNED("노드 배정", "%s 프로젝트의 '%s' 노드에 배정됐어요"),
    NODE_UPDATED("노드 변경", "%s 프로젝트의 '%s' 노드가 변경됐어요"),
    ;

    private final String title;
    private final String contentTemplate;

    public String formatContent(final String... args) {
        return String.format(contentTemplate, (Object[]) args);
    }
}