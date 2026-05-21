package kr.flowmeet.api.meeting.scheduler;

import java.time.LocalDateTime;
import java.util.List;
import kr.flowmeet.domain.meeting.entity.Meeting;
import kr.flowmeet.domain.meeting.service.MeetingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class MeetingStatusScheduler {

    private final MeetingService meetingService;

    @Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul")
    @Transactional
    public void startScheduledMeetings() {
        List<Meeting> meetings = meetingService.findScheduledToStart(LocalDateTime.now());
        if (meetings.isEmpty()) {
            return;
        }

        meetings.forEach(Meeting::start);
        log.info("[startScheduledMeetings] 회의 상태 전환 완료 - SCHEDULED → IN_PROGRESS, {}건", meetings.size());
    }
}