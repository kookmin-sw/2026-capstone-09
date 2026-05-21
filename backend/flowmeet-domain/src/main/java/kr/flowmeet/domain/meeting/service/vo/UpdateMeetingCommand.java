package kr.flowmeet.domain.meeting.service.vo;

import java.time.LocalDateTime;
import java.util.List;

public record UpdateMeetingCommand(
        LocalDateTime startedAt,
        List<Long> participantUserIds,
        boolean isPushEnabled
) {
}
