package kr.flowmeet.api.scheduler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.entity.MeetingParticipant;
import kr.flowmeet.domain.meeting.service.MeetingService;
import kr.flowmeet.domain.notification.entity.NotificationSetting;
import kr.flowmeet.domain.notification.service.NotificationService;
import kr.flowmeet.domain.notification.service.NotificationSettingService;
import kr.flowmeet.domain.notification.service.vo.MeetingReminderNotificationCommand;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;
import kr.flowmeet.external.email.EmailSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MeetingReminderScheduler {

    private static final String REMINDER_TEMPLATE = "email/meeting-reminder";

    private final MeetingService meetingService;
    private final NotificationService notificationService;
    private final NotificationSettingService notificationSettingService;
    private final UserService userService;
    private final EmailSender emailSender;

    @Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul")
    public void sendMeetingReminders() {
        List<Meeting> meetings = meetingService.findPendingReminders(LocalDateTime.now());
        if (meetings.isEmpty()) {
            return;
        }
        sendNotifications(meetings);
        List<Long> meetingIds = meetings.stream().map(Meeting::getId).toList();
        meetingService.markRemindersSent(meetingIds);
    }

    private void sendNotifications(List<Meeting> meetings) {
        Map<Long, List<MeetingParticipant>> participantsByMeetingId = loadParticipantsByMeetingId(meetings);
        Map<Long, User> userMap = loadUsersByParticipants(participantsByMeetingId);
        Map<Long, Map<Long, NotificationSetting>> settingsByProjectId = loadSettingsByProjectId(meetings);

        meetings.forEach(meeting -> {
            Long projectId = meeting.getNode().getProjectId();
            String nodeName = meeting.getNode().getTitle();
            Long nodeId = meeting.getNodeId();
            Map<Long, NotificationSetting> settingByUserId = settingsByProjectId.getOrDefault(projectId, Map.of());

            for (MeetingParticipant p : participantsByMeetingId.getOrDefault(meeting.getId(), List.of())) {
                NotificationSetting setting = settingByUserId.get(p.getUserId());
                if (setting == null || !setting.isMeetingEnabled()) {
                    continue;
                }

                sendInAppNotification(p.getUserId(), projectId, nodeId, nodeName);

                if (setting.isEmailEnabled()) {
                    User user = userMap.get(p.getUserId());
                    if (user != null) {
                        sendEmailNotification(user, nodeName);
                    }
                }
            }
        });
    }

    private Map<Long, List<MeetingParticipant>> loadParticipantsByMeetingId(List<Meeting> meetings) {
        List<Long> meetingIds = meetings.stream().map(Meeting::getId).toList();
        return meetingService.findAllParticipantsByMeetingIds(meetingIds).stream()
                .collect(Collectors.groupingBy(MeetingParticipant::getMeetingId));
    }

    private Map<Long, User> loadUsersByParticipants(Map<Long, List<MeetingParticipant>> participantsByMeetingId) {
        List<Long> userIds = participantsByMeetingId.values().stream()
                .flatMap(List::stream)
                .map(MeetingParticipant::getUserId)
                .distinct()
                .toList();
        return userService.findAllByIdsAsMap(userIds);
    }

    private Map<Long, Map<Long, NotificationSetting>> loadSettingsByProjectId(List<Meeting> meetings) {
        List<Long> projectIds = meetings.stream()
                .map(m -> m.getNode().getProjectId())
                .distinct()
                .toList();
        return notificationSettingService.findAllByProjectIds(projectIds).stream()
                .collect(Collectors.groupingBy(
                        NotificationSetting::getProjectId,
                        Collectors.toMap(NotificationSetting::getUserId, Function.identity())
                ));
    }

    private void sendInAppNotification(Long userId, Long projectId, Long nodeId, String nodeName) {
        try {
            notificationService.send(MeetingReminderNotificationCommand.of(userId, projectId, nodeId, nodeName));
        } catch (Exception e) {
            log.error("[MeetingReminder] 인앱 알림 발송 실패. userId={}, nodeId={}", userId, nodeId, e);
        }
    }

    private void sendEmailNotification(User user, String nodeName) {
        try {
            String subject = "[FlowMeet] '" + nodeName + "' 회의가 곧 시작돼요";
            Map<String, Object> variables = Map.of("nodeName", nodeName);
            emailSender.send(user.getEmail(), subject, REMINDER_TEMPLATE, variables);
        } catch (Exception e) {
            log.error("[MeetingReminder] 이메일 발송 실패. userId={}, email={}", user.getId(), user.getEmail(), e);
        }
    }
}