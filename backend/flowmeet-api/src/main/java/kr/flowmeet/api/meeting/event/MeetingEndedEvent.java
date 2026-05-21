package kr.flowmeet.api.meeting.event;

public record MeetingEndedEvent(
        String jobId,
        String text
) {
}