package kr.flowmeet.external.meeting.dto;

import java.time.LocalDateTime;

public record CreateMeetingRoomCommand(
        String title,
        LocalDateTime startedAt,
        LocalDateTime endedAt,
        String hostRefreshToken
) {
}
