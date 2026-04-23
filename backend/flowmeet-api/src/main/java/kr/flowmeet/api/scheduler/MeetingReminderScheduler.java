package kr.flowmeet.api.scheduler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
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

    @Scheduled(cron = "0 * * * * *")
    public void sendMeetingReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Meeting> pendingMeetings = meetingService.findPendingReminders(now);
        if (pendingMeetings.isEmpty()) {
            return;
        }

        // 이미 발송된 nodeId 일괄 조회 후 필터링
        List<Long> nodeIds = pendingMeetings.stream().map(Meeting::getNodeId).toList();
        Set<Long> alreadyNotifiedNodeIds = notificationService.findAlreadyNotifiedNodeIds(nodeIds);
        List<Meeting> meetingsToNotify = pendingMeetings.stream()
                .filter(m -> !alreadyNotifiedNodeIds.contains(m.getNodeId()))
                .toList();
        if (meetingsToNotify.isEmpty()) {
            return;
        }

        // 참여자 일괄 조회
        List<Long> meetingIds = meetingsToNotify.stream().map(Meeting::getId).toList();
        List<MeetingParticipant> allParticipants = meetingService.findAllParticipantsByMeetingIds(meetingIds);
        Map<Long, List<MeetingParticipant>> participantsByMeetingId = allParticipants.stream()
                .collect(Collectors.groupingBy(MeetingParticipant::getMeetingId));

        // 유저 일괄 조회
        List<Long> userIds = allParticipants.stream().map(MeetingParticipant::getUserId).distinct().toList();
        Map<Long, User> userMap = userService.findAllByIds(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        // 알림 설정 프로젝트별 일괄 조회
        List<Long> projectIds = meetingsToNotify.stream()
                .map(m -> m.getNode().getProjectId())
                .distinct()
                .toList();
        Map<Long, Map<Long, NotificationSetting>> settingsByProjectId = notificationSettingService
                .findAllByProjectIds(projectIds).stream()
                .collect(Collectors.groupingBy(
                        NotificationSetting::getProjectId,
                        Collectors.toMap(NotificationSetting::getUserId, Function.identity())
                ));

        for (Meeting meeting : meetingsToNotify) {
            Long projectId = meeting.getNode().getProjectId();
            String nodeName = meeting.getNode().getTitle();
            Long nodeId = meeting.getNodeId();
            List<MeetingParticipant> participants = participantsByMeetingId.getOrDefault(meeting.getId(), List.of());
            Map<Long, NotificationSetting> settingByUserId = settingsByProjectId.getOrDefault(projectId, Map.of());

            for (MeetingParticipant participant : participants) {
                Long userId = participant.getUserId();
                NotificationSetting setting = settingByUserId.get(userId);
                if (setting == null || !setting.isMeetingEnabled()) {
                    continue;
                }

                sendInAppNotification(userId, projectId, nodeId, nodeName);

                if (setting.isEmailEnabled()) {
                    User user = userMap.get(userId);
                    if (user != null) {
                        sendEmailNotification(user, nodeName);
                    }
                }

            }
        }
    }

    private void sendInAppNotification(Long userId, Long projectId, Long nodeId, String nodeName) {
        try {
            notificationService.send(MeetingReminderNotificationCommand.of(userId, projectId, nodeId, nodeName));
        } catch (Exception e) {
            log.error("[MeetingReminderScheduler] 인앱 알림 발송 실패. userId={}, nodeId={}", userId, nodeId, e);
        }
    }

    private void sendEmailNotification(User user, String nodeName) {
        try {
            String subject = "[FlowMeet] '" + nodeName + "' 회의가 곧 시작돼요";
            Map<String, Object> variables = Map.of("nodeName", nodeName);
            emailSender.send(user.getEmail(), subject, REMINDER_TEMPLATE, variables);
        } catch (Exception e) {
            log.error("[MeetingReminderScheduler] 이메일 발송 실패. userId={}, email={}", user.getId(), user.getEmail(), e);
        }
    }
}